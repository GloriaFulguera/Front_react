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

export default function Home() {
  const navigate = useNavigate();

  // Estados
  const [vista, setVista] = useState("alumnos");
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [misMaterias, setMisMaterias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [materiaSel, setMateriaSel] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [mostrandoFormCrear, setMostrandoFormCrear] = useState(false);
  const [alumnoParaEditar, setAlumnoParaEditar] = useState(null); // Estado para edición

  // Configuración de Axios
  axios.defaults.baseURL = axios.defaults.baseURL || "http://localhost:3000";

  // Helpers
  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => decodeJWT(token), [token]); // ¡Aquí está tu usuario!
  
  // (El console.log que usamos para debuggear)
  // console.log("DATOS DEL USUARIO:", user);

  // Efecto para la autenticación
  useEffect(() => {
    if (!token) {
      navigate("/"); return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token, navigate]);


  // ===== LLAMADAS API (con tu estilo de función flecha) =====

  const fetchAlumnos = async () => {
    setCargando(true); setError("");
    try {
      const { data } = await axios.get(`/api/alumnos`);
      setAlumnos(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };
  
  const fetchMaterias = async () => {
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
  
  const fetchMisMaterias = async (alumnoId) => {
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
  
  const fetchAlumnoById = async (id) => {
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
  
  const crearAlumno = async (alumnoData) => {
    // 'alumnoData' viene de 'CrearAlumnoForm'
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

  // --- ESTA ES LA FUNCIÓN CORREGIDA ---
  const editarAlumno = async (id, alumnoData) => {
    // 'id' es el ID del alumno a editar
    // 'alumnoData' viene de 'EditarAlumnoForm' y tiene:
    // { Nombre, Mail, Username, Password? }

    setCargando(true);
    setError("");

    // 1. Construimos el body final que pide la API
    const bodyFinal = {
      // Datos del formulario
      nombre: alumnoData.Nombre,
      mail: alumnoData.Mail,
      username: alumnoData.Username,

      // Datos de auditoría (sacados del 'user' logueado)
      // Asegúrate de que user.username exista. Si no, usa user.id o lo que tengas.
      userMod: user.username, // O user.id, user.mail, etc.
      userModRol: user.rol // (Este ya sabemos que es el ID del rol, ej: 1)
    };

    // 2. Solo agregamos el password al body SI se escribió uno
    if (alumnoData.Password) {
      bodyFinal.password = alumnoData.Password; // (Ajusta la clave 'password' si es distinta)
    }
    
    try {
      // 3. Enviamos el 'bodyFinal'
      await axios.put(`/api/alumnos/${id}`, bodyFinal, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Alumno actualizado exitosamente");
      setAlumnoParaEditar(null); // Ocultamos el form de edición
      await fetchAlumnos(); // Recargamos la lista
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al actualizar alumno");
    } finally {
      setCargando(false);
    }
  };
  // --- FIN DE LA FUNCIÓN CORREGIDA ---

  const inscribirme = async () => {
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

  useEffect(() => {
    setError("");
    setAlumnoSeleccionado(null);
    setMostrandoFormCrear(false);
    setAlumnoParaEditar(null); // Limpiamos el estado de edición al cambiar de vista
    
    if (vista === "alumnos") fetchAlumnos();
    if (vista === "materias") fetchMaterias();
    if (vista === "misMaterias" && user?.id) fetchMisMaterias(user.id);
    if (vista === "inscribirme") {
      if (materias.length === 0) fetchMaterias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, user?.id]);

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
                {alumnoSeleccionado ? (
                  // 1. Muestra el detalle
                  <DetalleAlumno
                    alumno={alumnoSeleccionado}
                    onVolver={() => setAlumnoSeleccionado(null)}
                  />
                ) : alumnoParaEditar ? (
                  // 2. Muestra el form de EDICIÓN
                  <EditarAlumnoForm
                    alumno={alumnoParaEditar} // El objeto del alumno a editar
                    onGuardar={editarAlumno} // La función API que acabamos de corregir
                    onCancelar={() => setAlumnoParaEditar(null)}
                    cargando={cargando}
                  />
                ) : mostrandoFormCrear ? (
                  // 3. Muestra el form de CREACIÓN
                  <CrearAlumnoForm
                    onGuardar={crearAlumno}
                    onCancelar={() => setMostrandoFormCrear(false)}
                    cargando={cargando}
                  />
                ) : (
                  // 4. Muestra la tabla (default)
                  <>
                    {/* El botón de crear, visible solo para rol 1 */}
                    {user?.rol === 1 && (
                      <div style={{ marginBottom: 16 }}>
                        <Button onClick={() => setMostrandoFormCrear(true)}>
                          + Crear Nuevo Alumno
                        </Button>
                      </div>
                    )}
                    
                    <TablaAlumnos
                      items={alumnos}
                      onVerDetalle={fetchAlumnoById}
                      onEditar={(alumno) => setAlumnoParaEditar(alumno)} // Setea el alumno a editar
                      user={user} // Pasa el 'user' para los permisos del botón
                    />
                  </>
                )}
              </>
            )}
            
            {vista === "materias" && <TablaMaterias items={materias} />}
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