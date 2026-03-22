import { useState, useEffect, useRef } from "react";

export default function ModalLogin({ isOpen, onLoginSuccess }) {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailAgain, setEmailAgain] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src*="challenges.cloudflare.com/turnstile"]',
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const tryRender = () => {
      if (cancelled) return;

      if (window.turnstile && turnstileRef.current) {
        if (widgetIdRef.current !== null) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (_) {}
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACoX9knGJ8rJ8a5h",
          callback: (token) => setCaptchaToken(token),
          "expired-callback": () => {
            setCaptchaToken(null);
            if (widgetIdRef.current)
              window.turnstile.reset(widgetIdRef.current);
          },
          "error-callback": (err) => console.error("Turnstile error:", err),
        });
      } else {
        setTimeout(tryRender, 300);
      }
    };

    const timer = setTimeout(tryRender, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setError("");

    if (!username.trim()) {
      setError("Por favor ingresa un nombre de usuario");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Por favor ingresa un email válido");
      return;
    }
    if (email !== emailAgain) {
      setError("Los emails no coinciden");
      return;
    }
    if (!captchaToken) {
      setError("Por favor completa el captcha");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captcha: captchaToken, username, email }),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess();
      } else {
        setError("Error: " + (data.message || "Captcha inválido"));
        setCaptchaToken(null);
        if (widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (_) {}
        }
      }
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setSubmitting(false);
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

        <div ref={turnstileRef} style={{ minHeight: 65 }} />

        {error && <div className="modal-error">{error}</div>}

        <button onClick={handleLogin} disabled={submitting}>
          {submitting ? "Verificando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}
