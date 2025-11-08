import Tabla from "./Tabla";

export default function TablaAlumnos({ items }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Alumnos</h3>
      <Tabla
        headers={["Id", "Nombre", "Mail", "Estado"]}
        rows={(items || []).map(a => [
          a.Id ?? a.id,
          a.Nombre ?? a.nombre,
          a.Mail ?? a.mail,
          a.fe_baja ? "Baja" : "Activo"
        ])}
      />
    </div>
  );
}