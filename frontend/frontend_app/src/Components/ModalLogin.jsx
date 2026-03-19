import { useState, useEffect, useRef } from "react";

export default function ModalLogin({ isOpen, onLoginSuccess }) {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailAgain, setEmailAgain] = useState("");

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        // Si ya hay un widget, lo removemos para evitar duplicados
        if (widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
        }

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACoX9knGJ8rJ8a5h",
          callback: (token) => {
            setCaptchaToken(token);
          },
          "expired-callback": () => {
            setCaptchaToken(null);
            window.turnstile.reset(widgetIdRef.current);
          },
          "error-callback": (error) => {
            console.error("Turnstile Error:", error);
          },
        });
      }
    };

    const timer = setTimeout(renderTurnstile, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!username || !email || email !== emailAgain) {
      alert("Revisa los datos del formulario");
      return;
    }

    if (!captchaToken) {
      alert("Por favor, espera a que el captcha cargue");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          captcha: captchaToken,
          username,
          email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess();
      } else {
        // Mostramos el código de error que viene del backend (ej: hostname-mismatch)
        alert("Error: " + (data.message || "Captcha inválido"));
        // Si falla, resetear el captcha para obtener un token nuevo
        if (widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="email"
          placeholder="Repetir Email"
          value={emailAgain}
          onChange={(e) => setEmailAgain(e.target.value)}
        />

        <div
          ref={turnstileRef}
          style={{ marginTop: "15px", minHeight: "65px" }}
        ></div>

        <button onClick={handleLogin} style={{ marginTop: "15px" }}>
          Entrar
        </button>
      </div>
    </div>
  );
}
