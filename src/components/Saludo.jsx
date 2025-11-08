function Saludo(props) {
    return(
        <h1>Hola {props.usuario.nombre} {props.usuario.apellido}</h1>
    )
}

export default Saludo