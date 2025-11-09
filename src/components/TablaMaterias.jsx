// src/components/TablaMaterias.jsx
import Tabla from "./Tabla";
import Button from "./Boton"; // Necesitamos el Botón

// 1. Recibimos 'onEditar' y 'user' como props
export default function TablaMaterias({ items, titulo = "Materias", onEditar, user }) {
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{titulo}</h3>
      <Tabla
        // 2. Agregamos 'Acciones' a los headers
        headers={["Id", "Nombre", "Carrera", "Acciones"]}
        rows={(items || []).map(m => [
          m.idMateria,
          m.nombre,
          m.carrera,
          
          // 3. Agregamos la celda de acciones
          <div style={{ display: 'flex', gap: 4 }}>
            {/* 4. Lógica de permisos (solo admin) */}
            {user?.rol === 1 && (
              <Button
                size="sm"
                onClick={() => onEditar(m)} // Pasamos el objeto 'm' (materia)
              >
                Editar
              </Button>
            )}
          </div>
        ])}
      />
    </div>
  );
}