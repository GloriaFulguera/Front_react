// src/pages/Login.jsx
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErr] = useState("");
  const navigate = useNavigate();

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/login",
        { usuario, password },                      
        { headers: { "Content-Type": "application/json" } }
      );

      if (res?.data?.login && res?.data?.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        await sleep(300);
        navigate("/home");
      } else {
        setErr("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setErr("No se pudo iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 360, margin: "4rem auto", background: "#fff", padding: 16, borderRadius: 12}}>
      <h1 style={{fontSize: 20, fontWeight: 600, marginBottom: 12}}>Ingresar</h1>
      <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column", gap: 8}}>
        <input
          placeholder="Usuario"
          value={usuario}
          onChange={(e)=>setUsuario(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e)=>setPass(e.target.value)}
          className="border p-2 rounded"
        />
        <button disabled={isLoading} className="bg-black text-white rounded py-2">
          {isLoading ? "Ingresando..." : "Entrar"}
        </button>
        {error && <p style={{color: "red", fontSize: 12}}>{error}</p>}
      </form>
    </div>
  );
}
