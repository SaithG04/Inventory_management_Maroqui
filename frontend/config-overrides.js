//config-overrides.js
module.exports = {
  jest: (config) => {
      config.transformIgnorePatterns = [
          "node_modules/(?!axios|js-cookie|primeicons|primereact)/",
      ]; // Asegúrate de transformar módulos específicos si es necesario
      return config;
  },
};
