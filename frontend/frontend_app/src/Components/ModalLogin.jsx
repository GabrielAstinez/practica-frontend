import { useState, useEffect } from "react";

export default function ModalLogin({ isOpen, onClose }) {
  const [captchaToken, setCaptchaToken] = useState(null);

  useEffect(() => {
    window.onTurnstileSuccess = function (token) {
      console.log("Captcha token:", token);
      setCaptchaToken(token);
    };
  }, []);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!captchaToken) {
      alert("Completa el captcha");
      return;
    }

    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        captcha: captchaToken,
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

        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Introduce mail" />
        <input type="email" placeholder="Introduce mail again" />

        <div
          className="cf-turnstile"
          data-sitekey="0x4AAAAAACoX9knGJ8rJ8a5h"
          data-callback="onTurnstileSuccess"
        ></div>

        <button onClick={handleLogin}>Entrar</button>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
