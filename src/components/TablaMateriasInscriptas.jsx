import Tabla from "./Tabla"; 

export default function TablaMateriasInscriptas({ items }) {
  return (
    <div>
      <Tabla
        headers={["Id", "Nombre"]}
        rows={(items || []).map(m => [
          m.idMateria, 
          m.materia,
        ])}
      />
    </div>
  );
}