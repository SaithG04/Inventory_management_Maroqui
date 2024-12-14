module.exports = {
  // Especifica cómo manejar módulos especiales como CSS o servicios mockeados
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "identity-obj-proxy", // Mock de archivos CSS
    "^ProviderService$": "<rootDir>/src/__mocks__/ProviderService.js", // Mock de servicios
    "^.+\\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2)$": "<rootDir>/src/__mocks__/fileMock.js", // Mock de archivos estáticos
  },

  // Transforma archivos JS/JSX usando Babel
  transform: {
    "^.+\\.jsx?$": "babel-jest", // Transforma archivos JS/JSX con Babel
  },

  // Entorno de prueba para componentes React
  testEnvironment: "jsdom",

  // Ignora estas rutas para pruebas
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Directorio raíz del proyecto
  rootDir: ".",

  // Opción para resolver módulos
  moduleFileExtensions: ["js", "jsx", "json", "node"],

  // Limpia mocks automáticamente
  clearMocks: true,

  // Configuración adicional para mejorar los mensajes de error
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
