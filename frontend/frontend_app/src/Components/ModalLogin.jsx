export default function ModalLogin({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Iniciar Sesión</h2>

        <input type="text" placeholder="Username" />

        <input type="gmail" placeholder="Enter your mail" />
        <input type="gmail" placeholder="Enter your mail again" />

        <button>Entrar</button>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
