function Boton(props) {
    return(
        <button 
            className="px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-600 transition"
            onClick={props.onClick}
        >
            {props.label}
        </button>
    )
}

export default Boton