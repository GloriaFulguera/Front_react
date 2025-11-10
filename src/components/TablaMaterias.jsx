import Tabla from "./Tabla";
import Button from "./Boton"; 

export default function TablaMaterias({ items, titulo = "Materias", onEditar, onDarBaja, onVerAlumnos, user }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{titulo}</h3>
      <Tabla
        headers={["Id", "Nombre", "Carrera", "Estado", "Acciones"]}
        rows={(items || []).map(m => [
          m.idMateria,
          m.nombre,
          m.carrera,
          
          m.fe_baja ? "Baja" : "Activa",

          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {user?.rol === 1 && (
              <Button
                size="sm"
                onClick={() => onEditar(m)} 
              >
                Editar
              </Button>
            )}

            {user?.rol === 1 && !m.fe_baja && (
              <Button
                size="sm"
                onClick={() => onDarBaja(m.idMateria)}
              >
                Dar de Baja
              </Button>
            )}

            {(user?.rol === 1||user.rol===2) && onVerAlumnos && (
              <Button size="sm" onClick={() => onVerAlumnos(m)}>
                Ver Alumnos
              </Button>
            )}

          </div>
        ])}
      />
    </div>
  );
}