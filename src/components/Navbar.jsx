import Button from "./Boton"; 

function btn(active) {
  return `border rounded px-3 py-1 ${active ? "bg-black text-white" : ""}`;
}

export default function Navbar({ user, vista, setVista, onLogout }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
      background: "#fff", padding: 12, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)"
    }}>
      <strong>G A M I  </strong>
      {(user?.rol === 1 || user.rol===2) && (
        <button className={btn(vista === "alumnos")} onClick={() => setVista("alumnos")}>Alumnos</button>
      )}
      {/* <button className={btn(vista === "alumnos")} onClick={() => setVista("alumnos")}>Alumnos</button> */}
      <button className={btn(vista === "materias")} onClick={() => setVista("materias")}>Materias</button>
      {user?.rol === 3 && (
        <button className={btn(vista === "misMaterias")} onClick={() => setVista("misMaterias")}>Mis materias</button>
      )}
      {(user.rol === 3||user.rol===1) && (
      <button className={btn(vista === "inscribirme")} onClick={() => setVista("inscribirme")}>{user.rol === 3 ? "Inscribirme" : "Inscribir"}</button>
      )}

      {user?.rol === 3 && (
        <button className={btn(vista === "miPerfil")} onClick={() => setVista("miPerfil")}>Mi Perfil</button>
      )}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <small style={{ color: "#555" }}>
        {user ? ` ${user.username || "user"} • ${
          user.rol === 1 ? "ADMIN" :
          user.rol === 2 ? "COORDINADOR" :
          user.rol === 3 ? "ALUMNO" :
          "Indefinido" 
        }` : "Sesión"}
        </small>
        
        <Button onClick={onLogout} size="sm">
          Salir
        </Button>
      </div>
    </div>
  );
}