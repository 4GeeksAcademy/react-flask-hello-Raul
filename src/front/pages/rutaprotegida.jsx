import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const RutaProtegida = () => {
    const navigate = useNavigate();
    const [Autorizado, setAutorizado] = useState(false);

    useEffect(() => {
        const verificarToken = async () => {
            const token = localStorage.getItem('jwt-token');
            
            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/verificar_jwt`, { 
                    method: 'GET',
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (resp.ok) {
                    setAutorizado(true);
                } else {
                    localStorage.removeItem('jwt-token');
                    navigate("/", { replace: true });
                }
            } catch{
                navigate("/", { replace: true });
            }
        };

        verificarToken();
    }, []);

    return Autorizado ? <Outlet /> : null;
}

export default RutaProtegida;