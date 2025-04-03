/**
 * API REST para el servidor MCP del concesionario
 * Este archivo permite exponer el servidor MCP como una API REST para integración con n8n y otras herramientas
 */

import DealerMCPServer from './main';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
const server = new DealerMCPServer();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Punto de entrada principal para el MCP
app.post('/api/mcp', async (req, res) => {
  try {
    const { tool, method, params } = req.body;
    
    if (!tool || !method) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los campos "tool" y "method"'
      });
    }
    
    console.log(`📨 Solicitud recibida: ${tool}.${method}`);
    const result = await server.processSSERequest({ tool, method, params });
    
    console.log(`✅ Respuesta enviada: ${tool}.${method}`);
    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para obtener la documentación de la API
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Dealer MCP API',
    version: '1.0.0',
    description: 'API para gestión de concesionario de vehículos',
    endpoints: [
      {
        path: '/api/mcp',
        method: 'POST',
        description: 'Punto de entrada principal para ejecutar comandos MCP',
        body: {
          tool: 'Nombre de la herramienta (inventory, financing, testDrive, quotation, invoice)',
          method: 'Método a ejecutar',
          params: 'Parámetros para el método (opcional)'
        }
      },
      {
        path: '/api/docs',
        method: 'GET',
        description: 'Documentación de la API'
      },
      {
        path: '/api/health',
        method: 'GET',
        description: 'Verificar estado de la API'
      },
      {
        path: '/api/tools',
        method: 'GET',
        description: 'Listar herramientas y métodos disponibles'
      }
    ]
  });
});

// Endpoint para verificar el estado de la API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para listar herramientas y métodos disponibles
app.get('/api/tools', (req, res) => {
  res.json({
    tools: {
      inventory: [
        { 
          method: 'searchInventory', 
          description: 'Buscar vehículos por criterios',
          params: 'Objeto con propiedades de filtro (brand, model, color, etc.)'
        },
        { 
          method: 'getVehicleDetails', 
          description: 'Obtener detalles de un vehículo',
          params: 'String con el VIN del vehículo'
        },
        { 
          method: 'addVehicle', 
          description: 'Añadir un vehículo al inventario',
          params: 'Objeto con datos del vehículo'
        },
        { 
          method: 'updateAvailability', 
          description: 'Actualizar disponibilidad de un vehículo',
          params: { vin: 'String con el VIN del vehículo', available: 'Boolean con la disponibilidad' }
        }
      ],
      financing: [
        { 
          method: 'calculateFinancing', 
          description: 'Calcular financiamiento',
          params: { 
            price: 'Precio del vehículo', 
            downPayment: 'Pago inicial', 
            term: 'Plazo en meses', 
            interestRate: 'Tasa de interés (decimal)' 
          }
        },
        { 
          method: 'generateFinancingScenarios', 
          description: 'Generar escenarios de financiamiento',
          params: 'Número con el precio del vehículo'
        }
      ],
      testDrive: [
        { 
          method: 'scheduleTestDrive', 
          description: 'Programar una prueba de manejo',
          params: { 
            customer: 'Nombre del cliente', 
            vehicle: 'Vehículo a probar', 
            date: 'Fecha (YYYY-MM-DD)', 
            time: 'Hora (HH:MM)' 
          }
        },
        { 
          method: 'listTestDrives', 
          description: 'Listar pruebas de manejo',
          params: 'Objeto con filtros (opcional)'
        },
        { 
          method: 'updateTestDriveStatus', 
          description: 'Actualizar estado de una prueba de manejo',
          params: { 
            customer: 'Nombre del cliente', 
            vehicle: 'Vehículo', 
            newStatus: 'Nuevo estado (Pending, Confirmed, Cancelled)'
          }
        }
      ],
      quotation: [
        {
          method: 'createQuotation',
          description: 'Crear una nueva cotización',
          params: {
            customerId: 'ID del cliente',
            customerName: 'Nombre del cliente',
            customerEmail: 'Email del cliente (opcional)',
            customerPhone: 'Teléfono del cliente (opcional)',
            date: 'Fecha de cotización (YYYY-MM-DD)',
            expirationDate: 'Fecha de vencimiento (YYYY-MM-DD)',
            items: 'Array de items (ver documentación)',
            notes: 'Notas adicionales (opcional)',
            status: 'Estado (draft, sent, accepted, rejected, expired)'
          }
        },
        {
          method: 'getQuotation',
          description: 'Obtener detalles de una cotización',
          params: 'ID de la cotización'
        },
        {
          method: 'listQuotations',
          description: 'Listar cotizaciones',
          params: 'Objeto con filtros (opcional)'
        },
        {
          method: 'updateQuotationStatus',
          description: 'Actualizar estado de una cotización',
          params: {
            id: 'ID de la cotización',
            status: 'Nuevo estado (draft, sent, accepted, rejected, expired)'
          }
        },
        {
          method: 'generateQuotationPDF',
          description: 'Generar PDF de cotización',
          params: 'ID de la cotización'
        },
        {
          method: 'sendQuotationByEmail',
          description: 'Enviar cotización por email',
          params: {
            id: 'ID de la cotización',
            email: 'Email destinatario'
          }
        }
      ],
      invoice: [
        {
          method: 'createInvoice',
          description: 'Crear una nueva factura',
          params: {
            customerId: 'ID del cliente',
            customerName: 'Nombre del cliente',
            customerEmail: 'Email del cliente (opcional)',
            customerPhone: 'Teléfono del cliente (opcional)',
            customerAddress: 'Dirección del cliente (opcional)',
            date: 'Fecha de factura (YYYY-MM-DD)',
            dueDate: 'Fecha de vencimiento (YYYY-MM-DD)',
            items: 'Array de items (ver documentación)',
            notes: 'Notas adicionales (opcional)',
            status: 'Estado (pending, paid, overdue, cancelled)'
          }
        },
        {
          method: 'getInvoice',
          description: 'Obtener detalles de una factura',
          params: 'ID de la factura'
        },
        {
          method: 'listInvoices',
          description: 'Listar facturas',
          params: 'Objeto con filtros (opcional)'
        },
        {
          method: 'updateInvoiceStatus',
          description: 'Actualizar estado de una factura',
          params: {
            id: 'ID de la factura',
            status: 'Nuevo estado (pending, paid, overdue, cancelled)'
          }
        },
        {
          method: 'recordPayment',
          description: 'Registrar pago de una factura',
          params: {
            id: 'ID de la factura',
            paymentMethod: 'Método de pago',
            paymentDate: 'Fecha de pago (YYYY-MM-DD)'
          }
        },
        {
          method: 'generateInvoicePDF',
          description: 'Generar PDF de factura',
          params: 'ID de la factura'
        },
        {
          method: 'sendInvoiceByEmail',
          description: 'Enviar factura por email',
          params: {
            id: 'ID de la factura',
            email: 'Email destinatario'
          }
        }
      ]
    }
  });
});

// Iniciar servidor
function startApiServer() {
  app.listen(port, () => {
    console.log(`🚀 API del servidor MCP ejecutándose en http://localhost:${port}`);
    console.log(`📚 Documentación disponible en http://localhost:${port}/api/docs`);
  });
}

// Iniciar si se ejecuta directamente
if (import.meta.main) {
  startApiServer();
}

export { app, startApiServer };
