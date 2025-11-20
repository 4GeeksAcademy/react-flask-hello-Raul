import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Private = () => {
    const navigate = useNavigate();
    const CerrarSesion = () => {
        localStorage.removeItem("jwt-token");
        navigate("/");
    }

    const [email,setEmail] = useState("") 
    useEffect(() => {
        const obtenerEmail = async () => {
            const token = localStorage.getItem('jwt-token');
            
            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/user`, { 
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (resp.ok) {
                    const data = await resp.json()
                    setEmail(data.email);
                } else {
                    localStorage.removeItem('jwt-token');
                    navigate("/", { replace: true });
                }
            } catch{
                navigate("/", { replace: true });
            }
        };

        obtenerEmail();
    }, []);
    return (
        <>
            <h1>Holaa {email}</h1>
            <button className="btn btn-dark" onClick={CerrarSesion}>Cerrar Sesión</button>
        </>
        
    
    );

};

export default Private;