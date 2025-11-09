import Tabla from "./Tabla";
import Button from "./Boton";

export default function TablaAlumnos({ items, onVerDetalle }) { 
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Alumnos</h3>
      <Tabla
        headers={["Id", "Nombre", "Mail", "Estado", "Acciones"]} 
        rows={(items || []).map(a => [
          a.Id ?? a.id,
          a.Nombre ?? a.nombre,
          a.Mail ?? a.mail,
          a.fe_baja ? "Baja" : "Activo",
          <Button
            size="sm"
            onClick={() => onVerDetalle(a.Id ?? a.id)}
          >
            Ver
          </Button>
        ])}
      />
    </div>
  );
}