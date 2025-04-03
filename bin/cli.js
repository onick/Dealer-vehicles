#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);

// Verificar si se solicita ayuda
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  🚗 Dealer MCP Server CLI 🚗
  
  Usage:
    npx dealer-mcp-server [options]
  
  Options:
    --api                    Start in API mode
    --port <number>          Specify API port (default: 3000)
    --tool <name>            Specify a tool to use directly
    --method <name>          Specify a method to call
    --params <json_string>   Parameters for the method call
    --help, -h               Show this help message
    --ignore-robots-txt      Flag ignored (compatibility)
  
  Examples:
    # Start API server
    npx dealer-mcp-server --api
    
    # Start API on specific port
    npx dealer-mcp-server --api --port 8080
    
    # Search inventory
    npx dealer-mcp-server --tool inventory --method searchInventory --params '{"brand":"Toyota"}'
  `);
  process.exit(0);
}

// Determinar el directorio base (donde está instalado el paquete)
const baseDir = path.dirname(__dirname);

// Determinar si necesitamos iniciar la API o usar una herramienta específica
if (args.includes('--api')) {
  // Extraer puerto si se especifica
  let port = 3000;
  const portIndex = args.indexOf('--port');
  if (portIndex !== -1 && portIndex + 1 < args.length) {
    const portValue = parseInt(args[portIndex + 1], 10);
    if (!isNaN(portValue)) {
      port = portValue;
    }
  }
  
  // Ejecutar como API
  const apiProcess = spawn('bun', ['run', 'src/api.ts'], {
    cwd: baseDir,
    env: { ...process.env, PORT: port.toString() },
    stdio: 'inherit'
  });
  
  apiProcess.on('error', (err) => {
    console.error('Error al iniciar API:', err);
    process.exit(1);
  });
} else {
  // Comprobar si se especifican herramienta y método
  const hasToolMethod = args.includes('--tool') && args.includes('--method');
  
  if (!hasToolMethod) {
    console.log(`
    🚗 Dealer MCP Server
    
    No se proporcionó un comando específico. Use --help para ver las opciones disponibles.
    `);
    process.exit(0);
  }
  
  // Ejecutar CLI con los argumentos proporcionados
  const cliArgs = ['run', 'src/cli.ts', ...args];
  
  const cliProcess = spawn('bun', cliArgs, {
    cwd: baseDir,
    stdio: 'inherit'
  });
  
  cliProcess.on('error', (err) => {
    console.error('Error al ejecutar CLI:', err);
    process.exit(1);
  });
}
