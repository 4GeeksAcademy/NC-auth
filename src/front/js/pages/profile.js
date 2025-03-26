import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        actions.getProfile();
    }, []);
    
    
        useEffect(() => {
            if (store.user !== null) {
                
                setLoading(false);
                
            }
        }, [store, actions]); 

    return (
        <div className="text-center mt-5">
            <h1>Perfil</h1>
            {loading ? <p>Email: {store.user}</p> : <p>Cargando perfil...</p>}
           
        </div>
    );
};