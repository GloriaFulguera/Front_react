import { useState } from "react";
import Button from "./Boton";

export default function CrearAlumnoForm({ onGuardar, onCancelar, cargando }) {
  const [nombre, setNombre] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !mail || !password) {
      alert("Por favor completa todos los campos (Nombre, Mail y Password).");
      return;
    }
    onGuardar({ Nombre: nombre, Mail: mail, Password: password });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Crear Nuevo Alumno</h3>
      
      <div style={{ marginBottom: 8 }}>
        <label className="text-sm">Nombre</label>
        <input
          type="text"
          className="border rounded px-2 py-2 w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={cargando}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label className="text-sm">Mail</label>
        <input
          type="email"
          className="border rounded px-2 py-2 w-full"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          disabled={cargando}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label className="text-sm">Password</label>
        <input
          type="password"
          className="border rounded px-2 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={cargando}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Button
          type="button"
          onClick={onCancelar}
          disabled={cargando}
          size="sm"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={cargando} size="md">
          Guardar Alumno
        </Button>
      </div>
    </form>
  );
}