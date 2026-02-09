import React from "react";

function Boton({ color }) {
  const buttonStyle = {
    backgroundColor: color,
    border: "1px solid #374151",
    color: "black",
    padding: "10px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return <button style={buttonStyle}>Click me</button>;
}

export default Boton;
