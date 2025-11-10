import Tabla from "./Tabla"; 

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