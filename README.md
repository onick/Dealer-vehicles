# Dealer MCP Server 🚗

## Descripción
Servidor de Protocolo de Contexto de Modelo (MCP) para gestión integral de concesionarios de vehículos. Permite automatizar operaciones de venta, inventario, financiamiento y más mediante una API potente y fácil de usar.

## 🌟 Características

- **Gestión de inventario**: Seguimiento completo de vehículos, búsqueda y filtrado
- **Calculadora de financiamiento**: Cálculo de pagos mensuales y generación de escenarios
- **Agenda de pruebas de manejo**: Programación y seguimiento de pruebas de manejo
- **Cotizaciones**: Generación de cotizaciones para clientes con cálculo automático de totales
- **Facturación**: Sistema completo de generación y gestión de facturas
- **API REST**: Interfaz para integración con otras aplicaciones
- **Soporte para n8n**: Flujos de trabajo automatizados

## 📋 Requisitos previos

- **Bun 1.0+**: Motor de JavaScript rápido y moderno
- **Git**: Para clonar el repositorio (opcional)

## 🚀 Inicio rápido

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/onick/Dealer-vehicles.git
cd Dealer-vehicles

# Instalar dependencias
bun install
```

### Ejecución

```bash
# Iniciar servidor en modo CLI
./dealer-mcp.sh

# Iniciar servidor en modo API REST
./start-api.sh

# Ejecutar pruebas
bun test

# Construir proyecto
bun run build
```

## 🔧 Herramientas disponibles

- **Inventario**: Gestión del inventario de vehículos
- **Financiamiento**: Cálculo de opciones de financiamiento 
- **Pruebas de Manejo**: Programación y seguimiento de pruebas de manejo
- **Cotizaciones**: Generación y gestión de cotizaciones para clientes
- **Facturas**: Sistema de facturación completo

## 📚 Documentación

Para obtener más información sobre cómo utilizar este servidor MCP, consulta los siguientes documentos:

- [Guía de Conexión](GUIA-CONEXION.md): Instrucciones paso a paso para conectarse al servidor
- [N8N Integración](N8N-INTEGRACION.md): Cómo integrar el servidor con n8n
- [Ejemplos de Flujos en n8n](EJEMPLOS-N8N.md): Ejemplos detallados de flujos de trabajo con n8n
- [Facturas y Cotizaciones](FACTURAS-COTIZACIONES.md): Documentación sobre el módulo de facturas y cotizaciones

## 📝 Ejemplos de uso

### Usando la línea de comandos

```bash
# Buscar vehículos Toyota
./dealer-mcp.sh --tool inventory --method searchInventory --params '{"brand":"Toyota"}'

# Calcular financiamiento
./dealer-mcp.sh --tool financing --method calculateFinancing --params '{"price":25000,"downPayment":5000,"term":60,"interestRate":0.045}'
```

### Usando la API REST

```bash
# Buscar vehículos
curl -X POST -H "Content-Type: application/json" \
  -d '{"tool":"inventory","method":"searchInventory","params":{"brand":"Toyota"}}' \
  http://localhost:3000/api/mcp
```

## 👨‍💻 Autor

Marcelino Francisco Martinez

## 📄 Licencia

MIT
