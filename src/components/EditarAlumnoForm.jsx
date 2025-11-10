import { useState } from "react";
import Button from "./Boton"; 

export default function EditarAlumnoForm({ onGuardar, onCancelar, cargando, alumno }) {
  const [nombre, setNombre] = useState(alumno.nombre ?? "");
  const [mail, setMail] = useState(alumno.mail ?? "");
  const [username, setUsername] = useState(alumno.username ?? "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !mail || !username) {
      alert("Los campos Nombre, Mail y Username no pueden estar vacíos.");
      return;
    }

    const data = {
      Nombre: nombre,
      Mail: mail,
      Username: username,
    };
    
    onGuardar(alumno.Id ?? alumno.id, data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
        Editar Alumno (ID: {alumno.Id ?? alumno.id})
      </h3>
      
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

      <div style={{ marginBottom: 8 }}>
        <label className="text-sm">Username</label>
        <input
          type="text"
          className="border rounded px-2 py-2 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          Actualizar Alumno
        </Button>
      </div>
    </form>
  );
}