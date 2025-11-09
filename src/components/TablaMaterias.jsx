// src/components/TablaMaterias.jsx
import Tabla from "./Tabla";
import Button from "./Boton"; // Necesitamos el Botón

// 1. Recibimos 'onDarBaja' como nueva prop
export default function TablaMaterias({ items, titulo = "Materias", onEditar, onDarBaja, user }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{titulo}</h3>
      <Tabla
        // (Asumiré que también quieres mostrar el estado 'Baja' en el futuro)
        headers={["Id", "Nombre", "Carrera", "Estado", "Acciones"]}
        rows={(items || []).map(m => [
          m.idMateria,
          m.nombre,
          m.carrera,
          
          // 2. Agregamos la columna Estado (igual que en alumnos)
          m.fe_baja ? "Baja" : "Activa",

          <div style={{ display: 'flex', gap: 4 }}>
            {/* Lógica de Editar (solo admin) */}
            {user?.rol === 1 && (
              <Button
                size="sm"
                onClick={() => onEditar(m)} // Pasamos el objeto 'm' (materia)
              >
                Editar
              </Button>
            )}

            {/* 3. Lógica de Baja (solo admin y si no está de baja) */}
            {user?.rol === 1 && !m.fe_baja && (
              <Button
                size="sm"
                onClick={() => onDarBaja(m.idMateria)}
              >
                Dar de Baja
              </Button>
            )}
          </div>
        ])}
      />
    </div>
  );
}