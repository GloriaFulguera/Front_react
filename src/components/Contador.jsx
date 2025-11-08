import Boton from './Boton'
import { useState } from 'react'

function Contador() {
    const [contador, setContador] = useState(0)
    const salto = 2

    const incrementar = () => setContador(contador + salto)
    const decrementar = () => setContador(contador - salto)
    const resetear = () => setContador(0)

    return (
        <div>
            <h1 className="text-5xl font-bold mb-8 px-6 py-4 border-4 border-blue-700  bg-gray-100 rounded">
                Contador: {contador}
            </h1>

            <div className="flex flex-col space-y-4">
                <Boton label="Incrementar" onClick={incrementar}></Boton>
                <Boton label="Decrementar" onClick={decrementar}></Boton>
                <Boton label={contador != 0 ? ("Resetear") : ("NO hago nada")} onClick={resetear}></Boton>
            </div>
        </div>
    )
}

export default Contador