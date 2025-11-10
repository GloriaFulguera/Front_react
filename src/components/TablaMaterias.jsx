// src/components/TablaMaterias.jsx
import Tabla from "./Tabla";
import Button from "./Boton"; // Necesitamos el Botón

// 1. RECIBIMOS 'onVerAlumnos' aquí
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
            {/* Lógica de Editar (solo admin) */}
            {user?.rol === 1 && (
              <Button
                size="sm"
                onClick={() => onEditar(m)} // Pasamos el objeto 'm' (materia)
              >
                Editar
              </Button>
            )}

            {/* Lógica de Baja (solo admin y si no está de baja) */}
            {user?.rol === 1 && !m.fe_baja && (
              <Button
                size="sm"
                onClick={() => onDarBaja(m.idMateria)}
              >
                Dar de Baja
              </Button>
            )}

            {/* --- 2. ESTE ES EL BLOQUE QUE TE FALTABA --- */}
            {/* Botón "Ver Alumnos" (Solo Admin) */}
            {/* 'onVerAlumnos' solo existe si Home se lo pasa (no en "Mis Materias") */}
            {(user?.rol === 1||user.rol===2) && onVerAlumnos && (
              <Button size="sm" onClick={() => onVerAlumnos(m)}>
                Ver Alumnos
              </Button>
            )}
            {/* --- FIN DEL BLOQUE QUE FALTABA --- */}

          </div>
        ])}
      />
    </div>
  );
}