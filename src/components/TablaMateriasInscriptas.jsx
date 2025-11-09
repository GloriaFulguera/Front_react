// src/components/TablaMateriasInscriptas.jsx
import Tabla from "./Tabla"; // Reutilizamos la tabla genérica

// Este componente solo muestra las materias, sin acciones.
// Asume que la API devuelve {idMateria, nombre}
export default function TablaMateriasInscriptas({ items }) {
  return (
    <div>
      <Tabla
        headers={["Id", "Nombre"]}
        rows={(items || []).map(m => [
          m.idMateria, // Buscamos cualquier clave de ID
          m.materia,
        ])}
      />
    </div>
  );
}