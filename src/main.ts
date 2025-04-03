import { InventoryTool } from './tools/inventory';
import { FinancingTool } from './tools/financing';
import { TestDriveTool } from './tools/testDrive';
import { QuotationTool } from "./tools/quotations";
import { InvoiceTool } from "./tools/invoices";

class DealerMCPServer {
  private inventoryTool: InventoryTool;
  private financingTool: FinancingTool;
  private testDriveTool: TestDriveTool;
  private quotationTool: QuotationTool;
  private invoiceTool: InvoiceTool;

  constructor() {
    this.inventoryTool = new InventoryTool();
    this.financingTool = new FinancingTool();
    this.testDriveTool = new TestDriveTool();
    this.quotationTool = new QuotationTool();
    this.invoiceTool = new InvoiceTool();
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
      case 'quotation':
        selectedTool = this.quotationTool;
        break;
      case 'invoice':
        selectedTool = this.invoiceTool;
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
    },
    {
      tool: 'quotation',
      method: 'createQuotation',
      params: {
        customerName: 'María Rodríguez',
        customerId: 'CUST-001',
        customerEmail: 'maria.rodriguez@example.com',
        customerPhone: '555-1234',
        date: '2024-04-03',
        expirationDate: '2024-05-03',
        status: 'draft',
        items: [
          {
            description: 'Honda Civic 2023',
            quantity: 1,
            unitPrice: 27000,
            discount: 5,
            tax: 16
          },
          {
            description: 'Seguro de auto por 1 año',
            quantity: 1,
            unitPrice: 1200,
            tax: 16
          }
        ],
        notes: 'Cliente interesado en financiamiento a 60 meses.'
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