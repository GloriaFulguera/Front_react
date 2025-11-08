// src/components/Navbar.jsx

// ===== estilos botón navbar =====
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
      <button className={btn(vista === "alumnos")} onClick={() => setVista("alumnos")}>Alumnos</button>
      <button className={btn(vista === "materias")} onClick={() => setVista("materias")}>Materias</button>
      <button className={btn(vista === "misMaterias")} onClick={() => setVista("misMaterias")}>Mis materias</button>
      <button className={btn(vista === "inscribirme")} onClick={() => setVista("inscribirme")}>Inscribirme</button>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <small style={{ color: "#555" }}>
          {user ? `👤 ${user.username || "user"} • id: ${user.id} • rol: ${user.rol}` : "Sesión"}
        </small>
        <button className="bg-black text-white rounded px-3 py-1" onClick={onLogout}>Salir</button>
      </div>
    </div>
  );
}