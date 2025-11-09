// src/components/CrearMateriaForm.jsx
import { useState } from "react";
import Button from "./Boton";

// 1. Definimos las carreras aquí mismo.
const carreras = [
  { id: 1, nombre: "Tecnicatura en Análisis de Sistemas" },
  { id: 2, nombre: "Tecnicatura en Administración de Empresas" },
  { id: 3, nombre: "Profesorado en Educación Inicial" },
  { id: 4, nombre: "Profesorado en Educación Superior" },
];

export default function CrearMateriaForm({ onGuardar, onCancelar, cargando }) {
  const [nombre, setNombre] = useState("");
  // 2. El estado ahora guarda el ID de la carrera seleccionada
  const [carreraId, setCarreraId] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !carreraId) { // 3. Validamos el ID
      alert("Por favor completa todos los campos (Nombre y Carrera).");
      return;
    }
    // 4. Pasamos el ID de la carrera
    onGuardar({ Nombre: nombre, Carrera: Number(carreraId) });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Crear Nueva Materia</h3>
      
      {/* Campo Nombre (sin cambios) */}
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

      {/* 5. REEMPLAZAMOS EL INPUT POR UN SELECT */}
      <div style={{ marginBottom: 12 }}>
        <label className="text-sm">Carrera</label>
        <select
          className="border rounded px-2 py-2 w-full"
          value={carreraId}
          onChange={(e) => setCarreraId(e.target.value)}
          disabled={cargando}
        >
          <option value="">-- Elegí una carrera --</option>
          {carreras.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Botones (sin cambios) */}
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
          Guardar Materia
        </Button>
      </div>
    </form>
  );
}