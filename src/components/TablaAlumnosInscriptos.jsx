// src/components/TablaAlumnosInscriptos.jsx
import Tabla from "./Tabla"; // Reutilizamos la tabla genérica

// Este componente solo muestra los alumnos, sin acciones.
// Asume que la API devuelve {id, nombre, mail}
export default function TablaAlumnosInscriptos({ items }) {
      console.log(items);
    return (
    <div>
      <Tabla
        headers={["Id", "Nombre"]}
        rows={(items || []).map(a => [
          a.idAlumno,
          a.alumno,
        ])}
      />
    </div>
  );
}