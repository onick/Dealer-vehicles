# Integración con n8n

Este documento describe cómo integrar el servidor MCP del concesionario con n8n para crear flujos de trabajo automatizados.

## Configuración de la API REST

El servidor MCP ahora incluye una API REST que puede ser utilizada por n8n para interactuar con las herramientas del concesionario.

### Iniciar la API

```bash
# Iniciar la API en el puerto predeterminado (3000)
./start-api.sh

# O especificar un puerto diferente
./start-api.sh 8080
```

## Ejemplos de flujos de trabajo en n8n

### Ejemplo 1: Obtener información de inventario

1. En n8n, crear un nuevo flujo de trabajo
2. Añadir un nodo "HTTP Request"
3. Configurar como POST a `http://localhost:3000/api/mcp`
4. En el cuerpo JSON, añadir:
   ```json
   {
     "tool": "inventory",
     "method": "searchInventory",
     "params": {"brand": "Toyota"}
   }
   ```
5. Conectar a nodos para procesar la respuesta (ej. "Set" para extraer datos)

### Ejemplo 2: Programar una prueba de manejo

1. Añadir un nodo desencadenante (por ejemplo, "Webhook" para recibir datos de un formulario)
2. Añadir un nodo "HTTP Request"
3. Configurar como POST a `http://localhost:3000/api/mcp`
4. En el cuerpo JSON, usar expresiones para incluir datos del formulario:
   ```json
   {
     "tool": "testDrive",
     "method": "scheduleTestDrive",
     "params": {
       "customer": "{{$json.customerName}}",
       "vehicle": "{{$json.vehicleModel}}",
       "date": "{{$json.date}}",
       "time": "{{$json.time}}"
     }
   }
   ```
5. Añadir un nodo "Telegram" o "Email" para notificar de la nueva prueba de manejo

### Ejemplo 3: Proceso automatizado de financiamiento

1. Crear un nodo desencadenante (Webhook, Formulario, etc.)
2. Añadir un nodo "HTTP Request" configurado para calcular financiamiento
3. Añadir un nodo "If" para comprobar si la mensualidad es asequible
4. En caso afirmativo, enviar propuesta por email
5. En caso negativo, calcular alternativas con términos más largos

## Endpoints disponibles

La API expone los siguientes endpoints:

- `POST /api/mcp`: Endpoint principal para ejecutar comandos MCP
- `GET /api/docs`: Documentación de la API
- `GET /api/health`: Verificar el estado de la API
- `GET /api/tools`: Listar todas las herramientas y métodos disponibles

## Uso en n8n con Webhook

Puedes configurar un webhook en n8n para recibir datos desde un formulario web y luego procesarlos con el servidor MCP:

1. Crear un nodo "Webhook" en n8n
2. Configurar un formulario HTML que envíe datos a ese webhook
3. Usar los datos recibidos para realizar operaciones con el servidor MCP

## Consideraciones de seguridad

- Esta API no incluye autenticación. Para entornos de producción, considera añadir autenticación con JWT.
- No expongas la API directamente a Internet sin protección adecuada.
- Considera utilizar HTTPS para conexiones seguras.
