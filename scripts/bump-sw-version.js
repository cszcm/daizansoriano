const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const configPath = path.join(__dirname, '../_config.yml');

// Read the _config.yml file
let configContent = fs.readFileSync(configPath, 'utf8');
let config;

try {
  config = yaml.load(configContent);
} catch (e) {
  console.error('Error al analizar el archivo YAML:', e);
  process.exit(1);
}

if (!config.pwa_sw_version) {
  console.error('No se encontró la versión del Service Worker en _config.yml');
  process.exit(1);
}

// Increment the patch version
const versionParts = config.pwa_sw_version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1;
const newVersion = versionParts.join('.');

config.pwa_sw_version = newVersion;

// Convert back to YAML
configContent = yaml.dump(config);

// Write the updated content back to _config.yml
fs.writeFileSync(configPath, configContent, 'utf8');

console.log(`Versión del Service Worker actualizada a ${newVersion}`);