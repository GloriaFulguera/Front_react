// src/components/TablaAlumnos.jsx
import Tabla from "./Tabla";
import Button from "./Boton"; 

// 1. Recibimos 'onEditar' y 'user' como props
export default function TablaAlumnos({ items, onVerDetalle, onEditar, user }) { 
  return (
    <div>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Alumnos</h3>
      <Tabla
        headers={["Id", "Nombre", "Mail", "Estado", "Acciones"]} 
        rows={(items || []).map(a => [ // 'a' es el alumno actual del map
          a.Id ?? a.id,
          a.Nombre ?? a.nombre,
          a.Mail ?? a.mail,
          a.fe_baja ? "Baja" : "Activo",
          
          // 2. Usamos un div para agrupar los botones
          <div style={{ display: 'flex', gap: 4 }}>
            <Button
              size="sm"
              onClick={() => onVerDetalle(a.Id ?? a.id)}
            >
              Ver
            </Button>
            
            {/* 3. LÓGICA DE PERMISOS:
              Muestra el botón si el rol es 1 (admin)
              O si el ID del usuario logueado es igual al ID del alumno de esta fila
            */}
            {(user?.rol === 1 || user?.id === (a.Id ?? a.id)) && (
              <Button
                size="sm"
                onClick={() => onEditar(a)} // Pasamos el objeto 'a' completo
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