// src/components/EditarAlumnoForm.jsx
import { useState } from "react";
import Button from "./Boton"; // Uso tu import de "Boton"

// 1. Recibe el 'alumno' que vamos a editar
export default function EditarAlumnoForm({ onGuardar, onCancelar, cargando, alumno }) {
  // 2. Pre-cargamos los useState con los datos del alumno
  const [nombre, setNombre] = useState(alumno.nombre ?? "");
  const [mail, setMail] = useState(alumno.mail ?? "");
  const [username, setUsername] = useState(alumno.username ?? "");
  const [password, setPassword] = useState(""); // El password empieza vacío

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !mail || !username) {
      alert("Los campos Nombre, Mail y Username no pueden estar vacíos.");
      return;
    }

    // 3. Creamos el body solo con los datos
    const data = {
      Nombre: nombre,
      Mail: mail,
      Username: username,
    };
    
    
    // 5. Llamamos a onGuardar con el ID del alumno y los nuevos datos
    onGuardar(alumno.Id ?? alumno.id, data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
        Editar Alumno (ID: {alumno.Id ?? alumno.id})
      </h3>
      
      {/* Campo Nombre */}
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

      {/* Campo Mail */}
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

      {/* Campo Username */}
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

      {/* Botones */}
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