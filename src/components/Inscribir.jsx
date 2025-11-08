export default function InscribirView({ materias, materiaSel, setMateriaSel, onInscribir }) {
  return (
    <div style={{ maxWidth: 420 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Inscribirme en una materia</h3>
      <label className="text-sm">Materia</label>
      <select
        className="border rounded px-2 py-2 w-full"
        value={materiaSel}
        onChange={(e) => setMateriaSel(e.target.value)}
      >
        <option value="">-- Elegí una materia --</option>
        {materias.map(m => (
          <option key={m.Id ?? m.id} value={m.Id ?? m.id}>
            {(m.Id ?? m.id) + " - " + (m.Nombre ?? m.nombre)}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          disabled={!materiaSel}
          className="bg-black text-white rounded px-4 py-2"
          onClick={onInscribir}
        >
          Inscribirme
        </button>
      </div>
    </div>
  );
}