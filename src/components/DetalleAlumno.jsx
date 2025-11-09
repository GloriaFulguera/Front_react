import Button from "./Boton";

export default function DetalleAlumno({ alumno, onVolver }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
        Detalle del Alumno
      </h3>
      
      <div style={{ marginBottom: 16 }}>
        <p><strong>ID:</strong> {alumno.Id ?? alumno.id}</p>
        <p><strong>Nombre:</strong> {alumno.Nombre ?? alumno.nombre}</p>
        <p><strong>Mail:</strong> {alumno.Mail ?? alumno.mail}</p>
        <p><strong>Estado:</strong> {alumno.fe_baja ? "Baja" : "Activo"}</p>
      </div>

      <Button onClick={onVolver} size="sm">
        Volver al listado
      </Button>
    </div>
  );
}