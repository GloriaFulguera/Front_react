// src/components/DetalleAlumno.jsx
import Button from "./Boton";
// 1. CAMBIAMOS EL IMPORT
import TablaMateriasInscriptas from "./TablaMateriasInscriptas"; 

export default function DetalleAlumno({ alumno, onVolver, materias, user }) {
  return (
    <div>
      {/* ... (Datos del alumno no cambian) ... */}
      <div style={{ marginBottom: 16 }}>
        <p><strong>ID:</strong> {alumno.Id ?? alumno.id}</p>
        <p><strong>Nombre:</strong> {alumno.nombre}</p>
        <p><strong>Mail:</strong> {alumno.mail}</p>
        <p><strong>Username:</strong> {alumno.username}</p>
        <p><strong>Estado:</strong> {alumno.fe_baja ? "Baja" : "Activo"}</p>
      </div>

      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontWeight: 600, marginBottom: 8 }}>
          Materias en las que está inscripto
        </h4>
        {/* 2. USAMOS EL NUEVO COMPONENTE */}
        <TablaMateriasInscriptas
          items={materias}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Button onClick={onVolver} size="sm">
          Volver al listado
        </Button>
      </div>
    </div>
  );
}