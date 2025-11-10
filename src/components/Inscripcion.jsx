import Button from "./Boton";

export default function Inscripcion({ 
  materias, materiaSel, setMateriaSel, onInscribir,
  user, alumnos, alumnoSel, setAlumnoSel 
}) {

  const alumnosActivos = alumnos.filter(a => !a.fe_baja);
  const materiasActivas = materias.filter(m => !m.fe_baja);

  return (
    <div style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Inscribir en una materia</h3>

      {(user?.rol === 1 || user.rol===2) && (
        <div style={{ marginBottom: 12 }}>
          <label className="text-sm">Alumno a inscribir</label>
          <select
            className="border rounded px-2 py-2 w-full"
            value={alumnoSel}
            onChange={(e) => setAlumnoSel(e.target.value)}
          >
            <option value="">-- Elegí un alumno --</option>
            {alumnosActivos.map(a => (
              <option key={a.Id ?? a.id} value={a.Id ?? a.id}>
                {(a.Id ?? a.id) + " - " + (a.Nombre ?? a.nombre)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label className="text-sm">Materia</label>
        <select
          className="border rounded px-2 py-2 w-full"
          value={materiaSel}
          onChange={(e) => setMateriaSel(e.target.value)}
        >
          <option value="">-- Elegí una materia --</option>
          {materiasActivas.map(m => (
            <option key={m.idMateria} value={m.idMateria}>
              {m.idMateria + " - " + m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Button
          onClick={onInscribir} 
          disabled={!materiaSel || (user?.rol === 1 && !alumnoSel)}
          size="md"
        >
          Inscribir
        </Button>
      </div>
    </div>
  );
}