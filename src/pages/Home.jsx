// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeJWT } from "../utils/auth";

// IMPORTAMOS LOS COMPONENTES
import Navbar from "../components/Navbar";
import TablaAlumnos from "../components/TablaAlumnos";
import TablaMaterias from "../components/TablaMaterias";
import InscribirView from "../components/Inscribir";

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

  // Configuración de Axios
  axios.defaults.baseURL = axios.defaults.baseURL || "http://localhost:3000";

  // Helpers
  const token = useMemo(() => localStorage.getItem("token"), []);
  const user = useMemo(() => decodeJWT(token), [token]);

  // Efecto para la autenticación
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token, navigate]);

  const fetchAlumnos = async () => {
    setCargando(true);
    setError("");
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
    setCargando(true);
    setError("");
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
    setCargando(true);
    setError("");
    try {
      const { data } = await axios.get(`/api/alumnos/${alumnoId}/materias`);
      setMisMaterias(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };

  const inscribirme = async () => {
    if (!user?.id || !materiaSel) return;
    
    setCargando(true);
    setError("");
    try {
      const body = {
        alumnoId: Number(user.id),
        materiaId: Number(materiaSel),
        Id_alumno: Number(user.id),
        Id_materia: Number(materiaSel),
      };
      await axios.post(`/api/inscripciones`, body, {
        headers: { "Content-Type": "application/json" }
      });
      
      // Reutilizamos la función para recargar los datos
      await fetchMisMaterias(user.id);
      
      setVista("misMaterias");
      alert("Inscripción realizada ✅");
      
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error");
    } finally {
      setCargando(false);
    }
  };



  useEffect(() => {
    setError(""); // Limpia errores al cambiar de vista
    if (vista === "alumnos") fetchAlumnos();
    if (vista === "materias") fetchMaterias();
    if (vista === "misMaterias" && user?.id) fetchMisMaterias(user.id);
    if (vista === "inscribirme") {
      // Precarga las materias si no están cargadas
      if (materias.length === 0) fetchMaterias();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, user?.id]);

  // Función de Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // Renderizado del componente
  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto" }}>
      {/* Componente Navbar */}
      <Navbar
        user={user}
        vista={vista}
        setVista={setVista}
        onLogout={logout}
      />

      {/* Contenedor de contenido */}
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)", marginTop: 12 }}>
        {cargando && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          <>
            {/* Renderizado condicional de la vista */}
            {vista === "alumnos" && <TablaAlumnos items={alumnos} />}
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