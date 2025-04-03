import DealerMCPServer from './main';

/**
 * CLI para interactuar con el servidor MCP del concesionario
 */
async function runCLI() {
  const server = new DealerMCPServer();
  
  // Procesar argumentos de la línea de comandos
  const args = process.argv.slice(2);
  const request: any = {};
  
  // Obtener parámetros de la línea de comandos
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tool' && i + 1 < args.length) {
      request.tool = args[i + 1];
      i++;
    } else if (args[i] === '--method' && i + 1 < args.length) {
      request.method = args[i + 1];
      i++;
    } else if (args[i] === '--params' && i + 1 < args.length) {
      try {
        request.params = JSON.parse(args[i + 1]);
      } catch (e) {
        console.error('Error: Los parámetros deben estar en formato JSON válido');
        process.exit(1);
      }
      i++;
    }
  }
  
  // Verificar que se proporcionaron los parámetros necesarios
  if (!request.tool || !request.method) {
    console.log(`
🚗 CLI del Servidor MCP del Concesionario 🚗

Uso:
  bun run src/cli.ts --tool <herramienta> --method <método> --params '<json_params>'

Herramientas disponibles:
  inventory      - Gestión de inventario de vehículos
  financing      - Calculadora de financiamiento
  testDrive      - Gestión de pruebas de manejo

Ejemplos:
  # Programar una prueba de manejo
  bun run src/cli.ts --tool testDrive --method scheduleTestDrive --params '{"customer":"María García","vehicle":"Honda Civic","date":"2024-04-04","time":"14:00"}'

  # Calcular financiamiento
  bun run src/cli.ts --tool financing --method calculateFinancing --params '{"price":25000,"downPayment":5000,"term":60,"interestRate":0.045}'

  # Buscar vehículos en inventario
  bun run src/cli.ts --tool inventory --method searchInventory --params '{"brand":"Toyota"}'
  
  # Ver pruebas de manejo programadas
  bun run src/cli.ts --tool testDrive --method listTestDrives
`);
    process.exit(0);
  }
  
  try {
    console.log(`\n🔍 Ejecutando: ${request.tool}.${request.method}`);
    const result = await server.processSSERequest(request);
    console.log('📋 Resultado:');
    console.log(result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

if (import.meta.main) {
  runCLI();
}
