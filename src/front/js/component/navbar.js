import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
    const { store, actions } = useContext(Context); 
    const navigate = useNavigate();

    // Función que maneja el logout
    const handleLogout = () => {
        actions.logout(); 
        navigate("/");
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">React Boilerplate</span>
                </Link>
                <div className="ml-auto d-flex gap-2">
                    {/* Si el usuario está autenticado, mostrar el botón de logout */}
                    {store.auth ? (
                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    ) : null}
                    <Link to="/signup">
                        <button className="btn btn-success">Create new user</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};