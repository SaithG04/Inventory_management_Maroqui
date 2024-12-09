import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthPort } from "../../ports/authPort"; // Importar el archivo AuthPort
import Logo from "../../assets/logo.png"; // Importa el logo de la empresa
import './LoginForm.css';

const LoginForm = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Asegúrate de que navigate esté disponible

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validación y envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;

    // Validaciones
    if (!email || !password) {
      toast.error("Por favor ingrese ambos campos.");
      return;
    }

    // Validación de formato de email
    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("El correo electrónico no es válido.");
      return;
    }

    try {
      // Llamar a AuthPort.loginUser para autenticar al usuario
      const result = await AuthPort.loginUser(email, password);

      if (result.success) {
        // Si la autenticación es exitosa, redirigir al usuario al dashboard
        toast.success("¡Bienvenido!");
        navigate("/dashboard"); // Cambia esto a la ruta de tu dashboard
      } else {
        // Si la autenticación falla, mostrar el error
        toast.error(result.message || "Error de autenticación. Por favor, inténtalo más tarde.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      toast.error("Error de autenticación. Por favor, inténtalo más tarde.");
    }
  };

  return (
    <section className="login-section">
      <ToastContainer /> {/* Contenedor para notificaciones emergentes */}
      <div className="login-container">
        <div className="login-logo-section">
          {/* Usamos el logo importado */}
          <img
            className="login-logo"
            src={Logo} // Usa la variable Logo en lugar de la ruta
            alt="Company Logo"
          />
        </div>

        <div className="login-form-section">
          <form onSubmit={handleSubmit} className="login-form w-full max-w-md">
            <div className="login-title-container">
              <h2 className="login-title">¡Bienvenido, Digite Credenciales!</h2> {/* Título del formulario */}
            </div>

            <div className="login-fields-container">
              {/* Campo de Email */}
              <div className="login-input-container">
                <div className="login-icon-container">
                  <FaEnvelope className="icon" style={{ color: "#022852", fontSize: "1.5rem" }} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Ej. corporativo@miroqui.es"
                  value={state.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="login-input-field"
                />
              </div>

              {/* Campo de Contraseña */}
              <div className="login-input-container">
                <div className="login-icon-container">
                  <FaLock className="icon" style={{ color: "#022852", fontSize: "1.5rem" }} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Contraseña"
                  value={state.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="login-input-field"
                />
              </div>

              <div className="mt-8">
                <button type="submit" className="login-button">
                  Ingresar {/* Botón para enviar el formulario */}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
