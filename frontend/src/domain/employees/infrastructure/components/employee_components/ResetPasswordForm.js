import React, { useState } from "react";
import { Password } from 'primereact/password';
import { Button } from 'primereact/button'; // Asegúrate de importar los botones de PrimeReact
import { toast } from "react-toastify";
import "./ResetPasswordForm.css";

const ResetPasswordForm = ({ employeeId, onPasswordReset }) => {
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Validar que las contraseñas no estén vacías y coincidan
  const validatePasswords = () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.warn("Ambas contraseñas son obligatorias.");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.warn("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      // Simulación de API
      console.log(`Restableciendo contraseña para empleado ${employeeId}`, passwordData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Contraseña restablecida exitosamente.");
      onPasswordReset(); // Notifica al componente padre
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      toast.error("Error al restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onPasswordReset(); // Cierra el formulario sin realizar cambios
  };

  return (
    <div className="reset-password-form">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="p-field">
          <Password
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Nueva Contraseña"
            toggleMask
            className="p-inputtext p-component"
          />
        </div>
        <div className="p-field">
          <Password
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Confirmar Contraseña"
            toggleMask
            className="p-inputtext p-component"
          />
        </div>
        <div className="form-buttons">
          <Button
            type="submit"
            label={loading ? "Guardando..." : "Restablecer Contraseña"}
            className="p-button p-button-success"
            disabled={loading}
          />
          <Button
            type="button"
            label="Cancelar"
            className="p-button p-button-secondary"
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
