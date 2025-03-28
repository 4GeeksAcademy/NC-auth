import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Llamando a getProfile...");
        actions.getProfile();
    }, []);

    useEffect(() => {
        console.log("Datos del perfil en store (después de getProfile):", store.user);
        if (store.user !== null) {
            setLoading(false);
        }
    }, [store.user]); 

    return (
        <div className="text-center mt-5">
            <h1>Perfil</h1>
            {loading ? <p>Cargando perfil...</p> : <p>Email: {store.user?.email}</p>}
        </div>
    );
};