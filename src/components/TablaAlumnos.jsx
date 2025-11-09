// src/components/TablaAlumnos.jsx
import Tabla from "./Tabla";
import Button from "./Boton"; 

// 1. Recibimos 'onDarBaja' como nueva prop
export default function TablaAlumnos({ items, onVerDetalle, onEditar, onDarBaja, user }) { 
  return (
    <div>
      {console.log(items)}
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Alumnos</h3>
      <Tabla
        headers={["Id", "Nombre", "Mail", "Estado", "Acciones"]} 
        rows={(items || []).map(a => [ // 'a' es el alumno actual del map
          a.Id ?? a.id,
          a.Nombre ?? a.nombre,
          a.Mail ?? a.mail,
          a.fe_baja ? "Baja" : "Activo",
          
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Button
              size="sm"
              onClick={() => onVerDetalle(a.Id ?? a.id)}
            >
              Ver
            </Button>
            
            {/* Lógica de permisos para Editar */}
            {(user?.rol === 1 || user?.id === (a.Id ?? a.id)) && (
              <Button
                size="sm"
                onClick={() => onEditar(a)} // Pasamos el objeto 'a' completo
              >
                Editar
              </Button>
            )}

            {/* 2. NUEVO BOTÓN (Baja lógica) */}
            {/* Visible solo si:
                1. El usuario es admin (rol 1)
                2. El alumno NO está ya dado de baja (!a.fe_baja)
            */}
            {user?.rol === 1 && !a.fe_baja && (
              <Button
                size="sm"
                onClick={() => onDarBaja(a.Id ?? a.id)}
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