import { Invoice, InvoiceItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class InvoiceTool {
  private invoices: Invoice[] = [];
  private lastInvoiceNumber = 0;

  // Crear una nueva factura
  createInvoice(
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'totalBeforeTax' | 'totalTax' | 'totalAmount'>
  ): Invoice {
    // Generar número de factura
    this.lastInvoiceNumber += 1;
    const invoiceNumber = `INV-${String(this.lastInvoiceNumber).padStart(6, '0')}`;
    
    // Calcular totales
    const totals = this.calculateTotals(data.items);
    
    // Crear nueva factura
    const newInvoice: Invoice = {
      id: uuidv4(),
      invoiceNumber,
      ...data,
      ...totals
    };
    
    this.invoices.push(newInvoice);
    return newInvoice;
  }
  
  // Obtener una factura por ID
  getInvoice(id: string): Invoice | undefined {
    return this.invoices.find(inv => inv.id === id);
  }
  
  // Obtener una factura por número
  getInvoiceByNumber(invoiceNumber: string): Invoice | undefined {
    return this.invoices.find(inv => inv.invoiceNumber === invoiceNumber);
  }
  
  // Listar todas las facturas, opcionalmente filtradas
  listInvoices(filters?: Partial<Invoice>): Invoice[] {
    if (!filters) return this.invoices;
    
    return this.invoices.filter(invoice => 
      Object.entries(filters).every(
        ([key, value]) => invoice[key as keyof Invoice] === value
      )
    );
  }
  
  // Actualizar el estado de una factura
  updateInvoiceStatus(id: string, status: Invoice['status']): boolean {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = status;
      return true;
    }
    return false;
  }
  
  // Registrar pago de una factura
  recordPayment(id: string, paymentMethod: string, paymentDate: string): boolean {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (invoice) {
      invoice.status = 'paid';
      invoice.paymentMethod = paymentMethod;
      invoice.paymentDate = paymentDate;
      return true;
    }
    return false;
  }
  
  // Actualizar una factura existente
  updateInvoice(
    id: string,
    data: Partial<Omit<Invoice, 'id' | 'invoiceNumber' | 'totalBeforeTax' | 'totalTax' | 'totalAmount'>>
  ): Invoice | undefined {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) return undefined;
    
    // Actualizar campos
    Object.assign(invoice, data);
    
    // Si se actualizaron los items, recalcular totales
    if (data.items) {
      const totals = this.calculateTotals(data.items);
      Object.assign(invoice, totals);
    }
    
    return invoice;
  }
  
  // Eliminar una factura
  deleteInvoice(id: string): boolean {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Generar PDF de factura (simulado)
  generateInvoicePDF(id: string): string {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    
    // En una implementación real, aquí generaríamos un PDF
    // Para esta demo, simplemente devolvemos una URL simulada
    return `https://api.example.com/invoices/${id}/pdf`;
  }
  
  // Enviar factura por email (simulado)
  sendInvoiceByEmail(id: string, email: string): boolean {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    
    // Simular envío de email
    console.log(`Factura ${id} enviada a ${email}`);
    
    return true;
  }
  
  // Convertir una factura a JSON para API
  invoiceToJSON(id: string): object {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error(`Factura con ID ${id} no encontrada`);
    }
    
    return {
      ...invoice,
      items: invoice.items.map(item => ({
        ...item,
        subtotal: item.quantity * item.unitPrice * (1 - ((item.discount || 0) / 100)),
        taxAmount: item.quantity * item.unitPrice * (1 - ((item.discount || 0) / 100)) * ((item.tax || 0) / 100)
      }))
    };
  }
  
  // Función auxiliar para calcular totales
  private calculateTotals(items: InvoiceItem[]) {
    let totalBeforeTax = 0;
    let totalTax = 0;
    
    for (const item of items) {
      const lineTotal = item.quantity * item.unitPrice;
      const discount = item.discount || 0;
      const discountedTotal = lineTotal * (1 - (discount / 100));
      const tax = item.tax || 0;
      
      totalBeforeTax += discountedTotal;
      totalTax += discountedTotal * (tax / 100);
    }
    
    const totalAmount = totalBeforeTax + totalTax;
    
    return {
      totalBeforeTax,
      totalTax,
      totalAmount
    };
  }
}
