import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { decodeJWT } from "../utils/auth";

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
import Tabla from "../components/Tabla";

export default function Home() {
  const navigate = useNavigate();

  const [vista, setVista] = useState(null);
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
  const [miPerfilData, setMiPerfilData] = useState(null);
  
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
      const response = await axios.get(`/api/alumnos`);
      setAlumnos(response.data);
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
  
  const fetchAlumnosDeMateria = async (materia) => {
    setCargando(true);
    setError("");
    setAlumnosDeMateria([]);
    try {
      const { data } = await axios.get(`/api/materias/${materia.idMateria}/alumnos`);
      setAlumnosDeMateria(data);
      setMateriaSeleccionada(materia);
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
      setMateriasDelAlumno(resMaterias.data); 

    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al buscar alumno o sus materias");
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
      setMostrandoFormCrear(false);
      await fetchAlumnos();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al crear alumno");
    } finally {
      setCargando(false);
    }
  };
  const editarAlumno = async (id, alumnoData) => {
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

  const darBajaAlumno = async (id) => {
    const confirmado = window.confirm(
      `¿Estás seguro de que deseas dar de baja al alumno con ID: ${id}?`
    );

    if (!confirmado) {
      return;
    }

    setCargando(true);
    setError("");
    try {
      await axios.delete(`/api/alumnos/${id}`);
      alert("Alumno dado de baja exitosamente.");
      await fetchAlumnos(); 
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al dar de baja al alumno");
    } finally {
      setCargando(false);
    }
  };

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
      setMostrandoFormCrearMateria(false);
      await fetchMaterias();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al crear materia");
    } finally {
      setCargando(false);
    }
  };

  const inscribirme = async () => { 
    
    let idAlumnoParaInscribir;

    if (user?.rol === 1) {
      idAlumnoParaInscribir = alumnoSel;
      if (!idAlumnoParaInscribir) {
        alert("Por favor, selecciona un alumno.");
        return;
      }
    } else { 
      idAlumnoParaInscribir = user?.id;
    }

    if (!materiaSel) {
      alert("Por favor, selecciona una materia.");
      return;
    }

    setCargando(true); 
    setError("");
    
    try {
      const body = {
        idAlumno: Number(idAlumnoParaInscribir),
        idMateria: Number(materiaSel)
      };

      await axios.post(`/api/inscripciones`, body, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Inscripción realizada");

      if (user?.rol === 1) {
        setAlumnoSel("");
        setMateriaSel("");
      } else {
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
    setCargando(true);
    setError("");

    const bodyFinal = {
      nombre: materiaData.Nombre,
      carrera: materiaData.CarreraId,
      userMod: user.username, 
      userModRol: user.rol  
    };

    try {
      await axios.put(`/api/materias/${id}`, bodyFinal, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Materia actualizada exitosamente");
      setMateriaParaEditar(null);
      await fetchMaterias();
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

  const darBajaInscripcion = async (idMateria) => {
    
    const confirmado = window.confirm(
      `¿Estás seguro de que deseas anular tu inscripción a esta materia?`
    );
    if (!confirmado) return;

    setCargando(true);
    setError("");
    try {
      const body = {
        idAlumno: Number(user.id),
        idMateria: Number(idMateria)
      };
      await axios.delete(`/api/inscripciones`, { data: body });
      
      alert("Inscripción anulada exitosamente.");
      setMisMaterias(listaAnterior => 
        listaAnterior.filter(m => m.idMateria !== idMateria)
      );
      
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al anular la inscripción");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setError("");
    setAlumnoSeleccionado(null);
    setMostrandoFormCrear(false);
    setAlumnoParaEditar(null); 
    setMostrandoFormCrearMateria(false);
    setMateriaParaEditar(null);
    setMiPerfilData(null);
    
    if (vista === null) {
      if (user?.rol === 3) {
        setVista("materias");
      } else { 
        setVista("alumnos");
      }
      return; 
    }

    if (vista === "alumnos") fetchAlumnos();
    if (vista === "materias") fetchMaterias();
    if (vista === "misMaterias" && user?.id) fetchMisMaterias(user.id);
    if (vista === "inscribirme") {
      if (materias.length === 0) fetchMaterias();
    }
    if (vista === "miPerfil" && user?.id) {
      const cargarMiPerfil = async () => {
        setCargando(true);
        setError("");
        try {
          const response = await axios.get(`/api/alumnos/${user.id}`);
          setMiPerfilData(response.data[0]);
        } catch (e) {
          setError(e?.response?.data?.message || e.message || "Error al cargar tu perfil");
        } finally {
          setCargando(false);
        }
      };
      cargarMiPerfil();
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
            {vista === "alumnos" && (
              <>
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
                      onEditar={(alumno) => setAlumnoParaEditar(alumno)} 
                      onDarBaja={darBajaAlumno} 
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
                  <>
                    {user?.rol === 1 && (
                      <div style={{ marginBottom: 16 }}>
                        <Button onClick={() => setMostrandoFormCrearMateria(true)}>
                          + Crear Nueva Materia
                        </Button>
                      </div>
                    )}

                    <TablaMaterias 
                      items={materias} 
                      onEditar={(materia) => setMateriaParaEditar(materia)}
                      onDarBaja={darBajaMateria}
                      onVerAlumnos={fetchAlumnosDeMateria}
                      user={user}
                    />
                  </>
                )}
              </>
            )}
            {vista === "misMaterias" && (
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
                  Materias en las que estoy inscripto/a
                </h3>
                <Tabla
                  headers={["Id", "Nombre", "Acciones"]}
                  rows={(misMaterias || []).map(m => [
                    m.idMateria,
                    m.materia,
                    <Button
                      size="sm"
                      onClick={() => darBajaInscripcion(m.idMateria)}
                    >
                      Anular Inscripción
                    </Button>
                  ])}
                />
              </div>
            )}
            {vista === "inscribirme" && (
              <InscribirView
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
            {vista === "miPerfil" && (
              <>
                {miPerfilData ? (
                  <EditarAlumnoForm
                    alumno={miPerfilData}
                    onGuardar={editarAlumno} 
                    onCancelar={() => setVista("misMaterias")} 
                    cargando={cargando}
                  />
                ) : (
                  <p>Cargando tu perfil...</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}