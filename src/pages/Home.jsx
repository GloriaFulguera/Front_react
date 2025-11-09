import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeJWT } from "../utils/auth";

import Navbar from "../components/Navbar";
import TablaAlumnos from "../components/TablaAlumnos";
import TablaMaterias from "../components/TablaMaterias";
import InscribirView from "../components/Inscripcion";
import DetalleAlumno from "../components/DetalleAlumno";
import CrearAlumnoForm from "../components/CrearAlumnoForm"; 
import Button from "../components/Boton"; 

export default function Home() {
  const navigate = useNavigate();

  const [vista, setVista] = useState("alumnos");
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [misMaterias, setMisMaterias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [materiaSel, setMateriaSel] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [mostrandoFormCrear, setMostrandoFormCrear] = useState(false);

  axios.defaults.baseURL = axios.defaults.baseURL || "http://localhost:3000";

  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => decodeJWT(token), [token]);

  useEffect(() => {
    if (!token) {
      navigate("/"); return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token, navigate]);


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
      setAlumnoSeleccionado(response.data[0]);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al buscar alumno");
    } finally {
      setCargando(false);
    }
  };
  
  const crearAlumno = async (alumnoData) => {
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
      setMostrandoFormCrear(false); // Ocultamos el form
      await fetchAlumnos(); // Recargamos la lista de alumnos
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al crear alumno");
    } finally {
      setCargando(false);
    }
  };

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


  useEffect(() => {
    setError("");
    setAlumnoSeleccionado(null);
    setMostrandoFormCrear(false); 
    
    if (vista === "alumnos") fetchAlumnos();
    if (vista === "materias") fetchMaterias();
    if (vista === "misMaterias" && user?.id) fetchMisMaterias(user.id);
    if (vista === "inscribirme") {
      if (materias.length === 0) fetchMaterias();
    }
  }, [vista, user?.id]);

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };


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
            {/* 4. MODIFICAMOS LA LÓGICA DE RENDERIZADO DE 'alumnos' */}
            {vista === "alumnos" && (
              <>
                {alumnoSeleccionado ? (

                  <DetalleAlumno
                    alumno={alumnoSeleccionado}
                    onVolver={() => setAlumnoSeleccionado(null)}
                  />
                ) : mostrandoFormCrear ? (

                  <CrearAlumnoForm
                    onGuardar={crearAlumno}
                    onCancelar={() => setMostrandoFormCrear(false)}
                    cargando={cargando}
                  />
                ) : (
                  <>
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