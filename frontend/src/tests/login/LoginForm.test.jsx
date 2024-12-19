import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../components/Login/LoginForm';
import { toast } from 'react-toastify';

// Mock para toast
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe('LoginForm', () => {
  test('should show error toast on invalid credentials', async () => {
    // Simula una función de onLogin que devuelve un error con credenciales incorrectas
    const mockOnLogin = jest.fn().mockResolvedValue({ success: false, message: 'Credenciales inválidas.' });

    render(<LoginForm onLogin={mockOnLogin} />);

    // Simula la entrada de credenciales incorrectas
    fireEvent.change(screen.getByPlaceholderText('Ej. corporativo@miroqui.es'), {
      target: { value: 'fakeuser@domain.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' },
    });

    // Enviar el formulario
    fireEvent.submit(screen.getByRole('button', { name: /Ingresar/i }));

    // Espera que se llame a toast.error con el mensaje de error
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Credenciales inválidas.')
    );

    // Verifica que se haya llamado a la función onLogin con las credenciales incorrectas
    expect(mockOnLogin).toHaveBeenCalledWith('fakeuser@domain.com', 'wrongpassword');
  });
});
