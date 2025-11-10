import Tabla from "./Tabla";
import Button from "./Boton"; 

export default function TablaAlumnos({ items, onVerDetalle, onEditar, onDarBaja, user }) { 
  return (
    <div>
      {console.log(items)}
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Alumnos</h3>
      <Tabla
        headers={["Id", "Nombre", "Mail", "Estado", "Acciones"]} 
        rows={(items || []).map(a => [ 
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
            
            {(user?.rol === 1 || user?.id === (a.Id ?? a.id)) && (
              <Button
                size="sm"
                onClick={() => onEditar(a)} 
              >
                Editar
              </Button>
            )}

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