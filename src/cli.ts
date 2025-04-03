import DealerMCPServer from './main';

/**
 * CLI para interactuar con el servidor MCP del concesionario
 */
export async function runCLI(options?: { tool?: string, method?: string, params?: string }) {
  const server = new DealerMCPServer();
  
  // Variable para almacenar la solicitud
  const request: any = {};
  
  // Si recibimos opciones directamente, usarlas
  if (options) {
    request.tool = options.tool;
    request.method = options.method;
    
    // Si params es un string, intentar parsearlo como JSON
    if (options.params && typeof options.params === 'string') {
      try {
        request.params = JSON.parse(options.params);
      } catch (e) {
        console.error('Error: Los parámetros deben estar en formato JSON válido');
        return;
      }
    } else if (options.params) {
      request.params = options.params;
    }
  } else {
    // Procesar argumentos de la línea de comandos
    const args = process.argv.slice(2);
    
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
  }
  
  // Verificar que se proporcionaron los parámetros necesarios
  if (!request.tool || !request.method) {
    console.log(`
🚗 CLI del Servidor MCP del Concesionario 🚗

Uso:
  npx dealer-mcp-server --tool <herramienta> --method <método> --params '<json_params>'

Herramientas disponibles:
  inventory      - Gestión de inventario de vehículos
  financing      - Calculadora de financiamiento
  testDrive      - Gestión de pruebas de manejo
  quotation      - Gestión de cotizaciones
  invoice        - Gestión de facturas

Ejemplos:
  # Programar una prueba de manejo
  npx dealer-mcp-server --tool testDrive --method scheduleTestDrive --params '{"customer":"María García","vehicle":"Honda Civic","date":"2024-04-04","time":"14:00"}'

  # Calcular financiamiento
  npx dealer-mcp-server --tool financing --method calculateFinancing --params '{"price":25000,"downPayment":5000,"term":60,"interestRate":0.045}'

  # Buscar vehículos en inventario
  npx dealer-mcp-server --tool inventory --method searchInventory --params '{"brand":"Toyota"}'
  
  # Crear una cotización
  npx dealer-mcp-server --tool quotation --method createQuotation --params '{"customerId":"CUST-001","customerName":"Carlos López","date":"2024-04-03","expirationDate":"2024-05-03","status":"draft","items":[{"description":"Toyota Corolla 2023","quantity":1,"unitPrice":25000,"discount":2,"tax":16}]}'
  
  # Crear una factura
  npx dealer-mcp-server --tool invoice --method createInvoice --params '{"customerId":"CUST-001","customerName":"Carlos López","date":"2024-04-03","dueDate":"2024-05-03","status":"pending","items":[{"description":"Toyota Corolla 2023","quantity":1,"unitPrice":25000,"discount":2,"tax":16}]}'
`);
    return;
  }
  
  try {
    console.log(`\n🔍 Ejecutando: ${request.tool}.${request.method}`);
    const result = await server.processSSERequest(request);
    console.log('📋 Resultado:');
    console.log(result);
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.main) {
  runCLI();
}

export default runCLI;
