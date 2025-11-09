// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeJWT } from "../utils/auth";

// IMPORTAMOS LOS COMPONENTES
import Navbar from "../components/Navbar";
import TablaAlumnos from "../components/TablaAlumnos";
import TablaMaterias from "../components/TablaMaterias";
import InscribirView from "../components/Inscripcion"; // Tu nombre de componente
import DetalleAlumno from "../components/DetalleAlumno";
import CrearAlumnoForm from "../components/CrearAlumnoForm";
import EditarAlumnoForm from "../components/EditarAlumnoForm"; 
import Button from "../components/Boton"; // Tu nombre de componente
import CrearMateriaForm from "../components/CrearMateriaForm";
import EditarMateriaForm from "../components/EditarMateriaForm";
import TablaAlumnosInscriptos from "../components/TablaAlumnosInscriptos";
import TablaMateriasInscriptas from "../components/TablaMateriasInscriptas";

export default function Home() {
  const navigate = useNavigate();

  // Estados (sin cambios)
  const [vista, setVista] = useState("alumnos");
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [misMaterias, setMisMaterias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [materiaSel, setMateriaSel] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [mostrandoFormCrear, setMostrandoFormCrear] = useState(false);
  const [alumnoParaEditar, setAlumnoParaEditar] = useState(null); 
  const [mostrandoFormCrearMateria, setMostrandoFormCrearMateria] = useState(false);
  const [materiaParaEditar, setMateriaParaEditar] = useState(null);
  const [alumnoSel, setAlumnoSel] = useState("");
  const [materiasDelAlumno, setMateriasDelAlumno] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [alumnosDeMateria, setAlumnosDeMateria] = useState([]);

  // Configuración de Axios (sin cambios)
  axios.defaults.baseURL = axios.defaults.baseURL || "http://localhost:3000";

  // Helpers (sin cambios)
  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => decodeJWT(token), [token]); 
  
  // Efecto para la autenticación (sin cambios)
  useEffect(() => {
    if (!token) {
      navigate("/"); return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token, navigate]);


  // ===== LLAMADAS API (con tu estilo de función flecha) =====

  // (Todas las funciones de fetch, crear y editar quedan EXACTAMENTE IGUAL)
  const fetchAlumnos = async () => { /* ... tu código ... */ 
    setCargando(true); setError("");
    try {
      const response = await axios.get(`/api/alumnos`);
      setAlumnos(response.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };
  const fetchMaterias = async () => { /* ... tu código ... */ 
    setCargando(true); setError("");
    try {
      const response = await axios.get(`/api/materias`);
      setMaterias(response.data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };
  const fetchMisMaterias = async (alumnoId) => { /* ... tu código ... */ 
    setCargando(true); setError("");
    try {
      const { data } = await axios.get(`/api/alumnos/${alumnoId}/materias`);
      setMisMaterias(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };
  
  const fetchAlumnosDeMateria = async (materia) => {
    setCargando(true);
    setError("");
    setAlumnosDeMateria([]);
    try {
      const { data } = await axios.get(`/api/materias/${materia.idMateria}/alumnos`);
      setAlumnosDeMateria(data);
      setMateriaSeleccionada(materia); // Guardamos la materia para mostrar el título
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al buscar alumnos de la materia");
    } finally {
      setCargando(false);
    }
  };

  const fetchAlumnoById = async (id) => { 
    setCargando(true); 
    setError(""); 
    setAlumnoSeleccionado(null);
    setMateriasDelAlumno([]); 
    try {
      const resAlumno = await axios.get(`/api/alumnos/${id}`);
      setAlumnoSeleccionado(resAlumno.data[0]); 

      const resMaterias = await axios.get(`/api/alumnos/${id}/materias`);
      // Esta API devuelve la lista de materias inscriptas (formato simple)
      setMateriasDelAlumno(resMaterias.data); 

    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al buscar alumno o sus materias");
    } finally {
      setCargando(false);
    }
  };

  const crearAlumno = async (alumnoData) => { /* ... tu código ... */ 
    const body = {
      nombre: alumnoData.Nombre,
      mail: alumnoData.Mail,
      password: alumnoData.Password,
    };
    setCargando(true);
    setError("");
    try {
      await axios.post(`/api/alumnos`, body, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Alumno creado exitosamente");
      setMostrandoFormCrear(false);
      await fetchAlumnos();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al crear alumno");
    } finally {
      setCargando(false);
    }
  };
  const editarAlumno = async (id, alumnoData) => { /* ... tu código ... */ 
    setCargando(true);
    setError("");
    const bodyFinal = {
      nombre: alumnoData.Nombre,
      mail: alumnoData.Mail,
      username: alumnoData.Username,
      userMod: user.username, 
      userModRol: user.rol 
    };
    if (alumnoData.Password) {
      bodyFinal.password = alumnoData.Password; 
    }
    try {
      await axios.put(`/api/alumnos/${id}`, bodyFinal, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Alumno actualizado exitosamente");
      setAlumnoParaEditar(null); 
      await fetchAlumnos(); 
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al actualizar alumno");
    } finally {
      setCargando(false);
    }
  };

  // --- 1. AQUÍ AGREGAMOS LA NUEVA FUNCIÓN ---
  const darBajaAlumno = async (id) => {
    // a. Pedimos confirmación
    const confirmado = window.confirm(
      `¿Estás seguro de que deseas dar de baja al alumno con ID: ${id}?`
    );

    if (!confirmado) {
      return; // Si el admin cancela, no hacemos nada
    }

    setCargando(true);
    setError("");
    try {
      // b. Llamamos al endpoint DELETE
      await axios.delete(`/api/alumnos/${id}`);
      
      alert("Alumno dado de baja exitosamente.");
      
      // c. Refrescamos la lista
      await fetchAlumnos(); 
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al dar de baja al alumno");
    } finally {
      setCargando(false);
    }
  };
  // --- FIN DE LA NUEVA FUNCIÓN ---


  const crearMateria = async (materiaData) => {
    const body = {
      nombre: materiaData.Nombre,
      carrera: materiaData.Carrera,
    };
    
    setCargando(true);
    setError("");
    try {
      await axios.post(`/api/materias`, body, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Materia creada exitosamente");
      setMostrandoFormCrearMateria(false); // Ocultamos el form
      await fetchMaterias(); // Recargamos la lista de MATERIAS
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al crear materia");
    } finally {
      setCargando(false);
    }
  };

  const inscribirme = async () => { 
    
    // a. Determinamos qué alumno inscribir
    let idAlumnoParaInscribir;

    if (user?.rol === 1) { // Si es Admin
      idAlumnoParaInscribir = alumnoSel;
      if (!idAlumnoParaInscribir) {
        alert("Modo Admin: Por favor, selecciona un alumno.");
        return;
      }
    } else { // Si es Alumno
      idAlumnoParaInscribir = user?.id;
    }

    // b. Validamos la materia
    if (!materiaSel) {
      alert("Por favor, selecciona una materia.");
      return;
    }

    setCargando(true); 
    setError("");
    
    try {
      // c. Construimos el body que pide la API
      const body = {
        idAlumno: Number(idAlumnoParaInscribir),
        idMateria: Number(materiaSel),
        userMod: user.username, 
        userModRol: user.rol
      };

      await axios.post(`/api/inscripciones`, body, {
        headers: { "Content-Type": "application/json" }
      });

      alert("Inscripción realizada");

      // d. Lógica de feedback (diferente por rol)
      if (user?.rol === 1) {
        // Si es admin, limpiamos los campos y se queda en la vista
        setAlumnoSel("");
        setMateriaSel("");
      } else {
        // Si es alumno, lo mandamos a "Mis Materias"
        await fetchMisMaterias(user.id); 
        setVista("misMaterias");
      }

    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al inscribir");
    } finally {
      setCargando(false);
    }
  };
  
  const editarMateria = async (id, materiaData) => {
    // 'id' es el ID de la materia
    // 'materiaData' viene de EditarMateriaForm: { Nombre: "...", CarreraId: 2 }

    setCargando(true);
    setError("");

    // 4. Construimos el body EXACTO que pide tu API
    const bodyFinal = {
      nombre: materiaData.Nombre,
      carrera: materiaData.CarreraId, // ID de la carrera
      userMod: user.username,         // Usuario de auditoría
      userModRol: user.rol            // Rol de auditoría
    };
    console.log("MATERIA DATA")
    console.log(materiaData)
    try {
      await axios.put(`/api/materias/${id}`, bodyFinal, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Materia actualizada exitosamente");
      setMateriaParaEditar(null); // Ocultamos el form
      await fetchMaterias(); // Recargamos la lista
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al actualizar materia");
    } finally {
      setCargando(false);
    }
  };
  const darBajaMateria = async (id) => {
    
    const confirmado = window.confirm(
      `¿Estás seguro de que deseas dar de baja la materia con ID: ${id}?`
    );

    if (!confirmado) {
      return; 
    }

    setCargando(true);
    setError("");
    try {
      await axios.delete(`/api/materias/${id}`);
      
      alert("Materia dada de baja exitosamente.");
      
    } catch (e)
    {
      setError(e?.response?.data?.message || e.message || "Error al dar de baja la materia");
    } finally {
      setCargando(false);
    }
  };
  // ===== FIN DE LLAMADAS API =====

  // useEffect (sin cambios)
  useEffect(() => {
    setError("");
    setAlumnoSeleccionado(null);
    setMostrandoFormCrear(false);
    setAlumnoParaEditar(null); 
    setMostrandoFormCrearMateria(false);
    setMateriaParaEditar(null);
    
    if (vista === "alumnos") fetchAlumnos();
    if (vista === "materias") fetchMaterias();
    if (vista === "misMaterias" && user?.id) fetchMisMaterias(user.id);
    if (vista === "inscribirme") {
      if (materias.length === 0) fetchMaterias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, user?.id]);

  // logout (sin cambios)
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // Renderizado del componente
  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto" }}>
      <Navbar
        user={user}
        vista={vista}
        setVista={setVista}
        onLogout={logout}
      />

      <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)", marginTop: 12 }}>
        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          <>
            {/* Lógica de renderizado de 'alumnos' */}
            {vista === "alumnos" && (
              <>
                {/* ... (lógica de detalle, editar, crear no cambia) ... */}
                {alumnoSeleccionado ? (
                  <DetalleAlumno
                    alumno={alumnoSeleccionado}
                    onVolver={() => setAlumnoSeleccionado(null)}
                    materias={materiasDelAlumno}
                    user={user}
                  />
                ) : alumnoParaEditar ? (
                  <EditarAlumnoForm
                    alumno={alumnoParaEditar}
                    onGuardar={editarAlumno} 
                    onCancelar={() => setAlumnoParaEditar(null)}
                    cargando={cargando}
                  />
                ) : mostrandoFormCrear ? (
                  <CrearAlumnoForm
                    onGuardar={crearAlumno}
                    onCancelar={() => setMostrandoFormCrear(false)}
                    cargando={cargando}
                  />
                ) : (
                  // Muestra la tabla (default)
                  <>
                    {user?.rol === 1 && (
                      <div style={{ marginBottom: 16 }}>
                        <Button onClick={() => setMostrandoFormCrear(true)}>
                          + Crear Nuevo Alumno
                        </Button>
                      </div>
                    )}
                    
                    {/* --- 2. AQUÍ PASAMOS LA NUEVA PROP --- */}
                    <TablaAlumnos
                      items={alumnos}
                      onVerDetalle={fetchAlumnoById}
                      onEditar={(alumno) => setAlumnoParaEditar(alumno)} 
                      onDarBaja={darBajaAlumno} // <-- PROP NUEVA
                      user={user} 
                    />
                  </>
                )}
              </>
            )}
            
            {vista === "materias" && (
              <>
              {materiaSeleccionada ? (
                  <div>
                    <h3>Alumnos inscriptos en: {materiaSeleccionada.nombre}</h3>
                    
                    {/* USAMOS EL NUEVO COMPONENTE */}
                    <TablaAlumnosInscriptos
                      items={alumnosDeMateria}
                    />
                    
                    <div style={{ marginTop: 16 }}>
                      <Button onClick={() => setMateriaSeleccionada(null)} size="sm">
                        Volver a Materias
                      </Button>
                    </div>
                  </div>
                  ) : materiaParaEditar ? (
                  <EditarMateriaForm
                    materia={materiaParaEditar}
                    onGuardar={editarMateria}
                    onCancelar={() => setMateriaParaEditar(null)}
                    cargando={cargando}
                  />
                ) : mostrandoFormCrearMateria ? (
                  <CrearMateriaForm
                    onGuardar={crearMateria}
                    onCancelar={() => setMostrandoFormCrearMateria(false)}
                    cargando={cargando}
                  />
                ) : (
                  // Muestra la tabla (default)
                  <>
                    {user?.rol === 1 && (
                      <div style={{ marginBottom: 16 }}>
                        <Button onClick={() => setMostrandoFormCrearMateria(true)}>
                          + Crear Nueva Materia
                        </Button>
                      </div>
                    )}
                    
                    {/* --- 3. PASAMOS LA NUEVA PROP 'onDarBaja' --- */}
                    <TablaMaterias 
                      items={materias} 
                      onEditar={(materia) => setMateriaParaEditar(materia)}
                      onDarBaja={darBajaMateria} // <-- PROP NUEVA
                      onVerAlumnos={fetchAlumnosDeMateria}
                      user={user}
                    />
                  </>
                )}
              </>
            )}
            {vista === "misMaterias" && <TablaMaterias items={misMaterias} titulo="Materias en las que estoy inscripto/a" />}
            {vista === "inscribirme" && (
              <InscribirView
                // Pasamos todo lo que necesita
                user={user}
                alumnos={alumnos}
                materias={materias}
                materiaSel={materiaSel}
                setMateriaSel={setMateriaSel}
                alumnoSel={alumnoSel}
                setAlumnoSel={setAlumnoSel}
                onInscribir={inscribirme}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}