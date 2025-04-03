# Módulo de Facturas y Cotizaciones

Este documento describe cómo utilizar las nuevas funcionalidades de generación de facturas y cotizaciones en el servidor MCP del concesionario.

## Cotizaciones

Las cotizaciones permiten generar presupuestos para clientes interesados en vehículos y servicios.

### Crear una nueva cotización

```bash
./dealer-mcp.sh --tool quotation --method createQuotation --params '{
  "customerId": "CUST-001",
  "customerName": "Carlos López",
  "customerEmail": "carlos@example.com",
  "customerPhone": "555-1234",
  "date": "2024-04-03",
  "expirationDate": "2024-05-03",
  "status": "draft",
  "items": [
    {
      "description": "Toyota Corolla 2023",
      "quantity": 1,
      "unitPrice": 25000,
      "discount": 2,
      "tax": 16
    },
    {
      "description": "Seguro de auto por 1 año",
      "quantity": 1,
      "unitPrice": 1200,
      "tax": 16
    }
  ],
  "notes": "Cliente interesado en financiamiento a 60 meses."
}'
```

### Obtener una cotización por ID

```bash
./dealer-mcp.sh --tool quotation --method getQuotation --params '"5bf5f2e9-786f-4d67-a75a-1c66a4ad8668"'
```

Nota: Reemplaza el ID con el generado al crear la cotización.

### Listar todas las cotizaciones

```bash
./dealer-mcp.sh --tool quotation --method listQuotations
```

### Filtrar cotizaciones

```bash
./dealer-mcp.sh --tool quotation --method listQuotations --params '{"status": "draft"}'
```

### Actualizar estado de una cotización

```bash
./dealer-mcp.sh --tool quotation --method updateQuotationStatus --params '{
  "id": "5bf5f2e9-786f-4d67-a75a-1c66a4ad8668",
  "status": "sent"
}'
```

### Generar PDF de cotización

```bash
./dealer-mcp.sh --tool quotation --method generateQuotationPDF --params '"5bf5f2e9-786f-4d67-a75a-1c66a4ad8668"'
```

### Enviar cotización por email

```bash
./dealer-mcp.sh --tool quotation --method sendQuotationByEmail --params '{
  "id": "5bf5f2e9-786f-4d67-a75a-1c66a4ad8668",
  "email": "cliente@example.com"
}'
```

## Facturas

Las facturas permiten registrar ventas y llevar control de los pagos.

### Crear una nueva factura

```bash
./dealer-mcp.sh --tool invoice --method createInvoice --params '{
  "customerId": "CUST-001",
  "customerName": "Carlos López",
  "customerEmail": "carlos@example.com",
  "customerPhone": "555-1234",
  "customerAddress": "Av. Principal 123, Ciudad",
  "date": "2024-04-03",
  "dueDate": "2024-05-03",
  "status": "pending",
  "items": [
    {
      "description": "Toyota Corolla 2023",
      "quantity": 1,
      "unitPrice": 25000,
      "discount": 2,
      "tax": 16
    },
    {
      "description": "Seguro de auto por 1 año",
      "quantity": 1,
      "unitPrice": 1200,
      "tax": 16
    }
  ],
  "notes": "Factura por compra de vehículo."
}'
```

### Obtener una factura por ID

```bash
./dealer-mcp.sh --tool invoice --method getInvoice --params '"188adf9b-eeab-4e84-afdd-ce0315c76168"'
```

### Obtener una factura por número

```bash
./dealer-mcp.sh --tool invoice --method getInvoiceByNumber --params '"INV-000001"'
```

### Listar todas las facturas

```bash
./dealer-mcp.sh --tool invoice --method listInvoices
```

### Filtrar facturas

```bash
./dealer-mcp.sh --tool invoice --method listInvoices --params '{"status": "pending"}'
```

### Actualizar estado de una factura

```bash
./dealer-mcp.sh --tool invoice --method updateInvoiceStatus --params '{
  "id": "188adf9b-eeab-4e84-afdd-ce0315c76168",
  "status": "paid"
}'
```

### Registrar pago de una factura

```bash
./dealer-mcp.sh --tool invoice --method recordPayment --params '{
  "id": "188adf9b-eeab-4e84-afdd-ce0315c76168",
  "paymentMethod": "Transferencia bancaria",
  "paymentDate": "2024-04-10"
}'
```

### Generar PDF de factura

```bash
./dealer-mcp.sh --tool invoice --method generateInvoicePDF --params '"188adf9b-eeab-4e84-afdd-ce0315c76168"'
```

### Enviar factura por email

```bash
./dealer-mcp.sh --tool invoice --method sendInvoiceByEmail --params '{
  "id": "188adf9b-eeab-4e84-afdd-ce0315c76168",
  "email": "cliente@example.com"
}'
```

## Integración con n8n

### Ejemplo 1: Flujo de trabajo para crear una cotización

1. Crear un nodo "HTTP Request" en n8n
2. Configurarlo como POST a `http://localhost:3000/api/mcp`
3. En el cuerpo JSON, incluir:
   ```json
   {
     "tool": "quotation",
     "method": "createQuotation",
     "params": {
       "customerId": "{{$node.trigger.json.clientId}}",
       "customerName": "{{$node.trigger.json.name}}",
       "customerEmail": "{{$node.trigger.json.email}}",
       "date": "{{$today.format('YYYY-MM-DD')}}",
       "expirationDate": "{{$today.plus(30, 'days').format('YYYY-MM-DD')}}",
       "status": "draft",
       "items": [
         {
           "description": "{{$node.trigger.json.vehicleModel}}",
           "quantity": 1,
           "unitPrice": {{$node.trigger.json.price}},
           "discount": {{$node.trigger.json.discount || 0}},
           "tax": 16
         }
       ]
     }
   }
   ```

### Ejemplo 2: Flujo de trabajo para enviar recordatorios de facturas pendientes

1. Crear un nodo "Cron" para ejecutarse diariamente
2. Añadir un nodo "HTTP Request" configurado como POST a `http://localhost:3000/api/mcp`
3. En el cuerpo JSON, incluir:
   ```json
   {
     "tool": "invoice",
     "method": "listInvoices",
     "params": {
       "status": "pending"
     }
   }
   ```
4. Añadir un nodo "Function" para filtrar las facturas próximas a vencer
5. Añadir un nodo "Loop" para iterar sobre cada factura
6. Añadir un nodo "Email" para enviar recordatorios a los clientes

## Notas sobre implementación

- Las funcionalidades de generación de PDF y envío de email son simuladas en esta versión
- Para una implementación completa, se recomienda integrar con servicios como PDFKit y Nodemailer
- Los datos no son persistentes y se almacenan en memoria
