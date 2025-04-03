# Ejemplos de Flujos de Trabajo en n8n

Este documento proporciona ejemplos detallados de cómo integrar el servidor MCP del concesionario con n8n para crear flujos de trabajo automatizados.

## Configuración inicial

Antes de crear cualquier flujo de trabajo, asegúrate de:

1. Tener n8n instalado y funcionando
2. Tener el servidor MCP funcionando en modo API (`./start-api.sh`)

## Ejemplo 1: Notificación diaria de pruebas de manejo

Este flujo revisa cada mañana las pruebas de manejo programadas para el día y envía notificaciones a los asesores de ventas.

### Componentes del flujo:

1. **Nodo Schedule**:
   - Configuración: Cada día a las 8:00 AM

2. **Nodo HTTP Request**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body:
     ```json
     {
       "tool": "testDrive",
       "method": "listTestDrives"
     }
     ```

3. **Nodo Function**:
   - Código:
     ```javascript
     // Filtra pruebas de manejo para el día actual
     const today = new Date().toISOString().split('T')[0];
     const todaysDrives = $input.json.data.filter(drive => drive.date === today);
     
     if (todaysDrives.length === 0) {
       return []; // No hay pruebas hoy
     }
     
     return {json: {
       drives: todaysDrives,
       count: todaysDrives.length,
       message: `Hay ${todaysDrives.length} pruebas de manejo programadas para hoy.`
     }};
     ```

4. **Nodo IF**:
   - Condición: `{{$json.count}}` mayor que 0

5. **Nodo Telegram/Email** (si hay pruebas):
   - Texto: 
     ```
     📅 Pruebas de manejo para hoy: {{$json.count}}
     
     {{#each $json.drives}}
     - {{this.customer}}: {{this.vehicle}} a las {{this.time}}
     {{/each}}
     ```

### Estructura en n8n:
```
[Schedule] → [HTTP Request] → [Function] → [IF] → [Telegram/Email]
```

## Ejemplo 2: Procesamiento automático de solicitudes de cotización

Este flujo recibe solicitudes de cotización desde un formulario web, genera cotizaciones en el sistema y envía un PDF al cliente.

### Componentes del flujo:

1. **Nodo Webhook**:
   - Método: POST
   - Path: /quote-request
   - Respuesta: Activada

2. **Nodo HTTP Request (para generar cotización)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body:
     ```json
     {
       "tool": "quotation",
       "method": "createQuotation",
       "params": {
         "customerId": "WEB-{{$json.phone}}",
         "customerName": "{{$json.name}}",
         "customerEmail": "{{$json.email}}",
         "customerPhone": "{{$json.phone}}",
         "date": "{{$today.format('YYYY-MM-DD')}}",
         "expirationDate": "{{$today.plus(30, 'days').format('YYYY-MM-DD')}}",
         "status": "draft",
         "items": [
           {
             "description": "{{$json.carModel}} {{$json.year}}",
             "quantity": 1,
             "unitPrice": {{$json.price}},
             "discount": {{$json.discount || 0}},
             "tax": 16
           }
         ],
         "notes": "{{$json.notes}}"
       }
     }
     ```

3. **Nodo Set (para extraer ID)**:
   - Nombre: extraerID
   - Valor: `{{$json.data.id}}`

4. **Nodo HTTP Request (para generar PDF)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body:
     ```json
     {
       "tool": "quotation",
       "method": "generateQuotationPDF",
       "params": "{{$node.extraerID.json}}"
     }
     ```

5. **Nodo Email**:
   - To: `{{$json.email}}`
   - Subject: "Tu cotización para {{$json.carModel}}"
   - Body: 
     ```html
     <p>Hola {{$json.name}},</p>
     <p>Gracias por tu interés en el {{$json.carModel}}. Adjuntamos la cotización solicitada.</p>
     <p>La cotización es válida por 30 días.</p>
     <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
     ```
   - Attachments: URL del PDF (en producción)

6. **Nodo Respond to Webhook**:
   - Response Code: 200
   - Response Body:
     ```json
     {
       "success": true,
       "message": "Cotización creada y enviada por email",
       "quotationId": "{{$node.extraerID.json}}"
     }
     ```

### Estructura en n8n:
```
[Webhook] → [HTTP Request cotización] → [Set] → [HTTP Request PDF] → [Email] → [Respond to Webhook]
```

## Ejemplo 3: Seguimiento automático de facturas vencidas

Este flujo revisa diariamente las facturas pendientes, identifica las que están vencidas y activa un proceso de seguimiento.

### Componentes del flujo:

1. **Nodo Schedule**:
   - Configuración: Cada día a las 9:00 AM

2. **Nodo HTTP Request**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body:
     ```json
     {
       "tool": "invoice",
       "method": "listInvoices",
       "params": {
         "status": "pending"
       }
     }
     ```

3. **Nodo Function**:
   - Código:
     ```javascript
     // Identifica facturas vencidas
     const today = new Date();
     const overdueInvoices = $input.json.data.filter(invoice => {
       const dueDate = new Date(invoice.dueDate);
       return dueDate < today;
     });
     
     if (overdueInvoices.length === 0) {
       return []; // No hay facturas vencidas
     }
     
     // Clasificar por días de retraso
     const result = {
       invoices: overdueInvoices,
       count: overdueInvoices.length,
       byDelay: {
         critical: [], // >30 días
         high: [],     // 15-30 días
         medium: [],   // 7-14 días
         low: []       // 1-6 días
       }
     };
     
     const MS_PER_DAY = 1000 * 60 * 60 * 24;
     
     overdueInvoices.forEach(invoice => {
       const dueDate = new Date(invoice.dueDate);
       const daysLate = Math.floor((today - dueDate) / MS_PER_DAY);
       invoice.daysLate = daysLate;
       
       if (daysLate > 30) result.byDelay.critical.push(invoice);
       else if (daysLate >= 15) result.byDelay.high.push(invoice);
       else if (daysLate >= 7) result.byDelay.medium.push(invoice);
       else result.byDelay.low.push(invoice);
     });
     
     return {json: result};
     ```

4. **Nodo IF**:
   - Condición: `{{$json.count}}` mayor que 0

5. **Nodo SplitInBatches**:
   - Input: `{{$json.invoices}}`

6. **Nodo HTTP Request (actualizar estado)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body:
     ```json
     {
       "tool": "invoice",
       "method": "updateInvoiceStatus",
       "params": {
         "id": "{{$json.id}}",
         "status": "overdue"
       }
     }
     ```

7. **Nodo Email**:
   - To: `{{$json.customerEmail}}`
   - Subject: "Factura vencida - {{$json.invoiceNumber}}"
   - Body: Template según días de retraso

8. **Nodo Telegram**:
   - Para notificar al departamento de cobranza
   - Mensaje con resumen de facturas vencidas

### Estructura en n8n:
```
[Schedule] → [HTTP Request] → [Function] → [IF] → [SplitInBatches] → [HTTP Request actualizar] → [Email]
                                            ↓
                                        [Telegram]
```

## Ejemplo 4: Dashboard de KPIs para dirección

Este flujo genera cada semana un informe con los principales indicadores del concesionario.

### Componentes del flujo:

1. **Nodo Schedule**:
   - Configuración: Cada lunes a las 7:00 AM

2. **Nodo HTTP Request (inventario)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body: `{"tool":"inventory","method":"searchInventory"}`

3. **Nodo HTTP Request (cotizaciones)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body: `{"tool":"quotation","method":"listQuotations"}`

4. **Nodo HTTP Request (facturas)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body: `{"tool":"invoice","method":"listInvoices"}`

5. **Nodo HTTP Request (pruebas de manejo)**:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Body: `{"tool":"testDrive","method":"listTestDrives"}`

6. **Nodo Function (calcular KPIs)**:
   - Genera estadísticas y KPIs a partir de todos los datos
   - Calcula tasas de conversión, promedio de ventas, etc.

7. **Nodo Google Sheets/Excel**:
   - Actualiza una hoja de cálculo con los KPIs

8. **Nodo Email**:
   - Envía informe semanal a directivos
   - Incluye gráficos y datos clave

### Estructura en n8n:
```
                      ┌→ [HTTP inventario] →┐
                      ├→ [HTTP cotizaciones]┤
[Schedule] → [Parallel]┼→ [HTTP facturas]   ┼→ [Function KPIs] → [Google Sheets] → [Email]
                      └→ [HTTP test drives] ┘
```

## Notas adicionales

- Para entornos de producción, considera añadir manejo de errores y reintentos
- Puedes configurar el nodo "Error Trigger" para ser notificado de fallos en los flujos
- Considera usar variables de entorno de n8n para almacenar la URL del servidor API
- Para procesamiento en tiempo real, puedes usar webhooks en lugar de procesos programados
