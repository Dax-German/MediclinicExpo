const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Obtener la configuración predeterminada
const config = getDefaultConfig(__dirname);

// Añadir patrones de exclusión para archivos de servicios
config.resolver.blacklistRE = [
  // Excluir los archivos de servicios API para que no sean tratados como rutas
  /src\/api\/services\/.*\.ts$/,
  /src\/api\/services\.ts$/
];

// Configuración adicional
config.watchFolders = [path.resolve(__dirname)];

module.exports = config; 