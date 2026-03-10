import { useState, useEffect, useRef } from "react";

export default function ModalLogin({ isOpen, onClose }) {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailAgain, setEmailAgain] = useState("");

  const turnstileRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    if (window.turnstile && turnstileRef.current) {
      window.turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAACoX9knGJ8rJ8a5h",
        callback: function (token) {
          console.log("Captcha token:", token);
          setCaptchaToken(token);
        },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!username) {
      alert("Introduce un username");
      return;
    }

    if (!validateEmail(email)) {
      alert("El mail no es válido");
      return;
    }

    if (email !== emailAgain) {
      alert("Los correos no coinciden");
      return;
    }

    if (!captchaToken) {
      alert("Completa el captcha");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        captcha: captchaToken,
        username: username,
        email: email,
      }),
    });

    const data = await response.json();

    if (data.success) {
      onClose();
    } else {
      alert("Captcha inválido");
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
          placeholder="Introduce mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="email"
          placeholder="Introduce mail again"
          value={emailAgain}
          onChange={(e) => setEmailAgain(e.target.value)}
        />

        <div ref={turnstileRef}></div>

        <button onClick={handleLogin}>Entrar</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
