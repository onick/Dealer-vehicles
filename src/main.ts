import { InventoryTool } from './tools/inventory';
import { FinancingTool } from './tools/financing';
import { TestDriveTool } from './tools/testDrive';

class DealerMCPServer {
  private inventoryTool: InventoryTool;
  private financingTool: FinancingTool;
  private testDriveTool: TestDriveTool;

  constructor() {
    this.inventoryTool = new InventoryTool();
    this.financingTool = new FinancingTool();
    this.testDriveTool = new TestDriveTool();
  }

  async processSSERequest(request: any) {
    const { tool, method, params } = request;

    // Seleccionar la herramienta apropiada
    let selectedTool;
    switch (tool) {
      case 'inventory':
        selectedTool = this.inventoryTool;
        break;
      case 'financing':
        selectedTool = this.financingTool;
        break;
      case 'testDrive':
        selectedTool = this.testDriveTool;
        break;
      default:
        throw new Error(`Tool ${tool} not found`);
    }

    // Verificar que el método existe
    if (typeof selectedTool[method] !== 'function') {
      throw new Error(`Method ${method} not found in tool ${tool}`);
    }

    // Ejecutar el método
    return selectedTool[method](...(Array.isArray(params) ? params : [params]));
  }
}

async function startServer() {
  const server = new DealerMCPServer();

  // Algunos escenarios de prueba
  const testScenarios = [
    {
      tool: 'testDrive',
      method: 'scheduleTestDrive',
      params: {
        customer: 'Juan Pérez',
        vehicle: 'Toyota Corolla',
        date: '2024-05-15',
        time: '15:00'
      }
    }
  ];

  console.log('🚗 Dealer MCP Server Started');
  
  // Ejecutar escenarios de prueba
  for (const scenario of testScenarios) {
    try {
      console.log(`\n🔍 Running: ${scenario.tool}.${scenario.method}`);
      const result = await server.processSSERequest(scenario);
      console.log('📋 Result:', result);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
}

// Iniciar el servidor si se ejecuta directamente
if (import.meta.main) {
  startServer();
}

export default DealerMCPServer;