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
  const fetchAlumnoById = async (id) => { /* ... tu código ... */ 
    setCargando(true); setError(""); setAlumnoSeleccionado(null);
    try {
      const response= await axios.get(`/api/alumnos/${id}`);
      setAlumnoSeleccionado(response.data[0]); // Tu lógica
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al buscar alumno");
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

  const inscribirme = async () => { /* ... tu código ... */ 
    if (!user?.id || !materiaSel) return;
    setCargando(true); setError("");
    try {
      const body = {
        alumnoId: Number(user.id), materiaId: Number(materiaSel),
        Id_alumno: Number(user.id), Id_materia: Number(materiaSel),
      };
      await axios.post(`/api/inscripciones`, body, {
        headers: { "Content-Type": "application/json" }
      });
      await fetchMisMaterias(user.id);
      setVista("misMaterias");
      alert("Inscripción realizada");
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
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
            
            {/* ... (el resto de vistas no cambia) ... */}
            {vista === "materias" && (
              <>
                {mostrandoFormCrearMateria ? (
                  // 1. Muestra el form si estamos creando
                  <CrearMateriaForm
                    onGuardar={crearMateria}
                    onCancelar={() => setMostrandoFormCrearMateria(false)}
                    cargando={cargando}
                  />
                ) : (
                  // 2. Muestra la tabla (default)
                  <>
                    {/* Botón de crear, visible solo para rol 1 (admin) */}
                    {user?.rol === 1 && (
                      <div style={{ marginBottom: 16 }}>
                        <Button onClick={() => setMostrandoFormCrearMateria(true)}>
                          + Crear Nueva Materia
                        </Button>
                      </div>
                    )}
                    
                    <TablaMaterias items={materias} />
                  </>
                )}
              </>
            )}
            {vista === "misMaterias" && <TablaMaterias items={misMaterias} titulo="Materias en las que estoy inscripto/a" />}
            {vista === "inscribirme" && (
              <InscribirView
                materias={materias}
                materiaSel={materiaSel}
                setMateriaSel={setMateriaSel}
                onInscribir={inscribirme}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}