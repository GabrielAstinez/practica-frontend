package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"reflect"

	"github.com/google/cel-go/cel"
	"github.com/google/cel-go/common/types"
	"github.com/google/cel-go/common/types/ref"
	"github.com/google/cel-go/common/types/traits"
	"github.com/google/cel-go/ext"
)

// Input is the JSON payload read from stdin.
type Input struct {
	Expression string                 `json:"expression"`
	Context    map[string]interface{} `json:"context"`
}

// Output is the JSON result written to stdout.
type Output struct {
	Success bool        `json:"success"`
	Result  interface{} `json:"result,omitempty"`
	Message string      `json:"message,omitempty"`
}

func main() {
	var input Input
	if err := json.NewDecoder(os.Stdin).Decode(&input); err != nil {
		respond(Output{Success: false, Message: fmt.Sprintf("invalid JSON input: %v", err)})
		return
	}

	// Unwrap "data" wrapper so expressions like `user.name` work directly
	if data, ok := input.Context["data"].(map[string]interface{}); ok {
		input.Context = data
	}

	env, err := buildEnv(input.Context)
	if err != nil {
		respond(Output{Success: false, Message: fmt.Sprintf("env error: %v", err)})
		return
	}

	ast, iss := env.Compile(input.Expression)
	if iss.Err() != nil {
		respond(Output{Success: false, Message: fmt.Sprintf("compile error: %v", iss.Err())})
		return
	}

	prg, err := env.Program(ast)
	if err != nil {
		respond(Output{Success: false, Message: fmt.Sprintf("program error: %v", err)})
		return
	}

	activation := make(map[string]interface{}, len(input.Context))
	for k, v := range input.Context {
		activation[k] = convertValue(v)
	}

	out, _, err := prg.Eval(activation)
	if err != nil {
		respond(Output{Success: false, Message: fmt.Sprintf("eval error: %v", err)})
		return
	}

	respond(Output{Success: true, Result: celToJSON(out)})
}

// buildEnv constructs a CEL environment with variable declarations inferred
// from the context and registers extended functions (sum, ext.Strings, ext.Math).
func buildEnv(context map[string]interface{}) (*cel.Env, error) {
	opts := []cel.EnvOption{
		ext.Strings(),
		ext.Math(),
		cel.CrossTypeNumericComparisons(true),
		sumFunction(),
	}
	for name, value := range context {
		opts = append(opts, cel.Variable(name, inferCelType(value)))
	}
	return cel.NewEnv(opts...)
}

// inferCelType maps a JSON-decoded Go value to its CEL type.
func inferCelType(v interface{}) *cel.Type {
	switch val := v.(type) {
	case bool:
		return cel.BoolType
	case float64:
		if isIntegral(val) {
			return cel.IntType
		}
		return cel.DoubleType
	case string:
		return cel.StringType
	case []interface{}:
		if len(val) > 0 {
			return cel.ListType(inferCelType(val[0]))
		}
		return cel.ListType(cel.DynType)
	case map[string]interface{}:
		return cel.MapType(cel.StringType, cel.DynType)
	default:
		return cel.DynType
	}
}

// convertValue recursively converts JSON-decoded Go values so integers that
// arrived as float64 are cast to int64, which CEL recognises as type "int".
func convertValue(v interface{}) interface{} {
	switch val := v.(type) {
	case float64:
		if isIntegral(val) {
			return int64(val)
		}
		return val
	case map[string]interface{}:
		m := make(map[string]interface{}, len(val))
		for k, vv := range val {
			m[k] = convertValue(vv)
		}
		return m
	case []interface{}:
		a := make([]interface{}, len(val))
		for i, vv := range val {
			a[i] = convertValue(vv)
		}
		return a
	default:
		return v
	}
}

func isIntegral(f float64) bool {
	return f == math.Trunc(f) && f >= -9007199254740992 && f <= 9007199254740992
}

// celToJSON converts a CEL ref.Val into a plain Go value suitable for JSON
// marshalling.
func celToJSON(v ref.Val) interface{} {
	switch val := v.(type) {
	case types.Bool:
		return bool(val)
	case types.Int:
		return int64(val)
	case types.Double:
		return float64(val)
	case types.String:
		return string(val)
	case types.Null:
		return nil
	}

	// Lists
	if lister, ok := v.(traits.Lister); ok {
		var result []interface{}
		it := lister.Iterator()
		for it.HasNext() == types.True {
			result = append(result, celToJSON(it.Next()))
		}
		if result == nil {
			return []interface{}{}
		}
		return result
	}

	// Maps
	if mapper, ok := v.(traits.Mapper); ok {
		result := make(map[string]interface{})
		it := mapper.Iterator()
		for it.HasNext() == types.True {
			key := it.Next()
			val := mapper.Get(key)
			result[fmt.Sprintf("%v", celToJSON(key))] = celToJSON(val)
		}
		return result
	}

	// Fallback: try ConvertToNative to interface{}
	native, err := v.ConvertToNative(reflect.TypeOf((*interface{})(nil)).Elem())
	if err == nil {
		return native
	}
	return fmt.Sprintf("%v", v.Value())
}

// sumFunction registers a custom global sum() function for list<int> and
// list<double> — the CEL spec does not include sum() by default.
func sumFunction() cel.EnvOption {
	return cel.Function("sum",
		cel.Overload(
			"sum_list_int",
			[]*cel.Type{cel.ListType(cel.IntType)},
			cel.IntType,
			cel.UnaryBinding(func(val ref.Val) ref.Val {
				lister := val.(traits.Lister)
				it := lister.Iterator()
				var total int64
				for it.HasNext() == types.True {
					total += int64(it.Next().(types.Int))
				}
				return types.Int(total)
			}),
		),
		cel.Overload(
			"sum_list_double",
			[]*cel.Type{cel.ListType(cel.DoubleType)},
			cel.DoubleType,
			cel.UnaryBinding(func(val ref.Val) ref.Val {
				lister := val.(traits.Lister)
				it := lister.Iterator()
				var total float64
				for it.HasNext() == types.True {
					total += float64(it.Next().(types.Double))
				}
				return types.Double(total)
			}),
		),
	)
}

func respond(r Output) {
	json.NewEncoder(os.Stdout).Encode(r)
}
