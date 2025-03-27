import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const { store } = useContext(Context); // Accede a BACKEND_URL desde el contexto
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("Datos que se envían:", form);  // Añadir esto para verificar los datos
    
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
    
            if (response.ok) {
                alert("✅ El usuario ha sido registrado correctamente.");
                setForm({ email: "", password: "" }); // Limpiar el formulario
                navigate("/");
            } else {
                alert("❌ Hubo un error al registrar el usuario.");
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            alert("❌ Error al conectar con el servidor.");
        }
    };    

    return (
        <div className="container mt-5">
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
        </div>
    );
};