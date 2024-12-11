// shared/actionbutton/checkboxFunctions.js

// Función para manejar el estado de los checkboxes
export const handleCheckboxChange = (value, isAvailable, setIsAvailable) => {
    setIsAvailable(prevStatus => prevStatus === value ? null : value);
};
