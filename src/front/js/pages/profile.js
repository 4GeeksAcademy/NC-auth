import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getProfile();
    }, []);

    return (
        <div className="text-center mt-5">
            <h1>Perfil</h1>
            {store.user ? <p>Email: {store.user}</p> : <p>Cargando perfil...</p>}
        </div>
    );
};