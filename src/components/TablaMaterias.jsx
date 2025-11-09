import Tabla from "./Tabla";

export default function TablaMaterias({ items, titulo = "Materias" }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{titulo}</h3>
      <Tabla
        headers={["Id", "Nombre", "Carrera"]}
        rows={(items || []).map(m => [
          m.idMateria,
          m.nombre,
          m.carrera
        ])}
      />
    </div>
  );
}