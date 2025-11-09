export default function Tabla({ headers = [], rows = [] }) {
  if (!rows.length) return <p style={{ color: "#555" }}>Sin registros</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="w-full text-sm">
        
        <thead className="text-left border-b">
          <tr>
            {headers.map((encabezado) => (
              <th key={encabezado} className="py-2 pr-3">{encabezado}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((fila, indiceFila) => (
            <tr key={indiceFila} className="border-b last:border-0">
              
              {fila.map((celda, indiceCelda) => (
                <td key={indiceCelda} className="py-2 pr-3">
                  {celda ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}