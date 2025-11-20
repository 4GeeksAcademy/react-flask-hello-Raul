import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";



const Login = () => {
    const navigate = useNavigate()
    const url = import.meta.env.VITE_BACKEND_URL
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [mensaje, setMensaje] = useState("")
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }))
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch(`${url}api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
            setMensaje("Exito al iniciar sesion")
            localStorage.setItem("jwt-token", data.token)
            navigate("/protegida")
        }
        else {
            setMensaje(data.error)
        }


    }
    return (
        <>
            <h5 className="inter-texto text-start ms-2">Iniciar sesión</h5>
            <form className="p-2" onSubmit={handleSubmit}>
                <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-control"></input>
                <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" className="form-control mt-2" />
                <button type="submit" className="btn w-100 mt-3 text-white"
                    style={{ "backgroundColor": "black" }}>Continuar</button>
            </form>
            <Link to={'/signup'}><p className="enlace">Registro</p></Link>
            <p className="text-center text-danger">{mensaje}</p>
        </>
    )
}
export default Login;