# Guía de Conexión al Servidor MCP del Concesionario

Esta guía detalla paso a paso cómo conectarse y utilizar el servidor MCP del concesionario de vehículos.

## Índice

1. [Requisitos previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Iniciar el servidor](#iniciar-el-servidor)
4. [Conexión desde diferentes plataformas](#conexión-desde-diferentes-plataformas)
   - [Línea de comandos](#línea-de-comandos)
   - [API REST](#api-rest)
   - [n8n](#integración-con-n8n)
   - [Claude o ChatGPT](#conexión-desde-claude-o-chatgpt)
5. [Ejemplos prácticos](#ejemplos-prácticos)
6. [Solución de problemas](#solución-de-problemas)

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Bun**: Runtime de JavaScript (versión 1.0.0 o superior)
- **Git**: Para clonar el repositorio

### Instalar Bun

```bash
# En macOS o Linux
curl -fsSL https://bun.sh/install | bash

# En Windows (mediante WSL)
curl -fsSL https://bun.sh/install | bash
```

Verifica la instalación:
```bash
bun --version
```

## Instalación

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/onick/Dealer-vehicles.git
cd Dealer-vehicles
```

### Paso 2: Instalar dependencias

```bash
bun install
```

## Iniciar el servidor

Existen varias formas de iniciar el servidor, dependiendo de tus necesidades:

### 1. Modo CLI (línea de comandos)

Este modo te permite ejecutar comandos específicos:

```bash
./dealer-mcp.sh
```

### 2. Modo API REST

Este modo inicia un servidor HTTP que permite la conexión desde otras aplicaciones:

```bash
./start-api.sh
```

Por defecto, el servidor se ejecuta en el puerto 3000. Para usar otro puerto:

```bash
./start-api.sh 8080
```

## Conexión desde diferentes plataformas

### Línea de comandos

Puedes interactuar con el servidor usando el script `dealer-mcp.sh`:

```bash
# Estructura general
./dealer-mcp.sh --tool <herramienta> --method <método> --params '<json_params>'

# Ejemplo: Buscar vehículos Toyota
./dealer-mcp.sh --tool inventory --method searchInventory --params '{"brand":"Toyota"}'

# Ejemplo: Crear una cotización
./dealer-mcp.sh --tool quotation --method createQuotation --params '{
  "customerId": "CUST-001",
  "customerName": "Carlos López",
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
    }
  ]
}'
```

### API REST

#### Endpoint principal

Todas las solicitudes deben enviarse a: `http://localhost:3000/api/mcp` (o el puerto que hayas configurado)

#### Estructura de las solicitudes

```json
{
  "tool": "nombre_de_herramienta",
  "method": "nombre_del_método",
  "params": { ... }
}
```

#### Ejemplos con cURL

```bash
# Buscar vehículos
curl -X POST -H "Content-Type: application/json" \
  -d '{"tool":"inventory","method":"searchInventory","params":{"brand":"Toyota"}}' \
  http://localhost:3000/api/mcp

# Crear una factura
curl -X POST -H "Content-Type: application/json" \
  -d '{"tool":"invoice","method":"createInvoice","params":{
    "customerId":"CUST-001",
    "customerName":"Ana Martínez",
    "date":"2024-04-03",
    "dueDate":"2024-05-03",
    "status":"pending",
    "items":[{"description":"Honda Civic 2023","quantity":1,"unitPrice":27000,"tax":16}]
  }}' \
  http://localhost:3000/api/mcp
```

#### Endpoints adicionales

- `GET http://localhost:3000/api/docs` - Documentación de la API
- `GET http://localhost:3000/api/health` - Estado del servidor
- `GET http://localhost:3000/api/tools` - Listar herramientas disponibles

### Integración con n8n

#### Paso 1: Configurar n8n

1. Inicia n8n en tu entorno
2. Asegúrate de que el servidor MCP esté ejecutándose en modo API

#### Paso 2: Crear un flujo en n8n

1. Añade un nodo desencadenante (trigger) como "Schedule" o "Webhook"
2. Añade un nodo "HTTP Request"
3. Configura el nodo HTTP:
   - Método: POST
   - URL: http://localhost:3000/api/mcp
   - Headers: Content-Type: application/json
   - Body: Incluye tu solicitud JSON

#### Ejemplo: Crear una cotización en n8n

Configura el Body del nodo HTTP Request:

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
        "tax": 16
      }
    ]
  }
}
```

### Conexión desde Claude o ChatGPT

Para conectar asistentes de IA como Claude o ChatGPT a tu servidor MCP:

#### 1. Registrar el servidor MCP

Primero, asegúrate de que el servidor MCP esté instalado en el entorno donde se ejecuta el asistente:

```bash
# Para Claude o asistentes que soporten MCP nativo
cd ruta/a/Dealer-vehicles
bun install
```

#### 2. Solicitar acciones al asistente

Puedes pedir directamente al asistente que realice acciones utilizando el servidor MCP:

```
"Genera una cotización para un Toyota Corolla 2023 por $25,000 para el cliente Carlos López"
```

O ser más específico:

```
"Usa el servidor MCP del concesionario para buscar todos los vehículos Honda disponibles"
```

## Ejemplos prácticos

### Flujo completo de venta de un vehículo

1. **Buscar vehículos disponibles**:
   ```bash
   ./dealer-mcp.sh --tool inventory --method searchInventory --params '{"brand":"Toyota","available":true}'
   ```

2. **Generar una cotización**:
   ```bash
   ./dealer-mcp.sh --tool quotation --method createQuotation --params '{
     "customerId": "CUST-001",
     "customerName": "Carlos López",
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
       }
     ]
   }'
   ```

3. **Programar una prueba de manejo**:
   ```bash
   ./dealer-mcp.sh --tool testDrive --method scheduleTestDrive --params '{
     "customer": "Carlos López",
     "vehicle": "Toyota Corolla",
     "date": "2024-04-10",
     "time": "15:00"
   }'
   ```

4. **Calcular opciones de financiamiento**:
   ```bash
   ./dealer-mcp.sh --tool financing --method calculateFinancing --params '{
     "price": 25000,
     "downPayment": 5000,
     "term": 60,
     "interestRate": 0.045
   }'
   ```

5. **Generar la factura**:
   ```bash
   ./dealer-mcp.sh --tool invoice --method createInvoice --params '{
     "customerId": "CUST-001",
     "customerName": "Carlos López",
     "date": "2024-04-15",
     "dueDate": "2024-05-15",
     "status": "pending",
     "items": [
       {
         "description": "Toyota Corolla 2023",
         "quantity": 1,
         "unitPrice": 25000,
         "discount": 2,
         "tax": 16
       }
     ]
   }'
   ```

6. **Actualizar disponibilidad del vehículo**:
   ```bash
   ./dealer-mcp.sh --tool inventory --method updateAvailability --params '{
     "vin": "VIN123",
     "available": false
   }'
   ```

## Solución de problemas

### Problemas comunes

#### El servidor no inicia

Verifica que Bun esté correctamente instalado:
```bash
bun --version
```

Si hay problemas, reinstala Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

#### Error "Tool not found"

Asegúrate de usar el nombre correcto de la herramienta. Las herramientas disponibles son:
- `inventory`
- `financing`
- `testDrive`
- `quotation`
- `invoice`

#### Error al parsear JSON

Los parámetros deben estar en formato JSON válido. Verifica que:
- Las comillas sean del tipo correcto (`"` y no `'` dentro del JSON)
- No falten comas entre propiedades
- No haya comas tras la última propiedad

#### Error de conexión a la API

Verifica que:
- El servidor esté en ejecución
- Estés usando el puerto correcto
- No haya un firewall bloqueando la conexión

### Obtener ayuda

Si encuentras algún problema no cubierto aquí, puedes:
1. Revisar los logs del servidor
2. Abrir un issue en el repositorio GitHub
3. Contactar al desarrollador para soporte adicional
