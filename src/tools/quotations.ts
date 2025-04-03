import { Quotation, QuotationItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class QuotationTool {
  private quotations: Quotation[] = [];

  // Crear una nueva cotización
  createQuotation(
    data: Omit<Quotation, 'id' | 'totalBeforeTax' | 'totalTax' | 'totalAmount'>
  ): Quotation {
    // Calcular totales
    const totals = this.calculateTotals(data.items);
    
    // Crear nueva cotización
    const newQuotation: Quotation = {
      id: uuidv4(),
      ...data,
      ...totals
    };
    
    this.quotations.push(newQuotation);
    return newQuotation;
  }
  
  // Obtener una cotización por ID
  getQuotation(id: string): Quotation | undefined {
    return this.quotations.find(q => q.id === id);
  }
  
  // Listar todas las cotizaciones, opcionalmente filtradas
  listQuotations(filters?: Partial<Quotation>): Quotation[] {
    if (!filters) return this.quotations;
    
    return this.quotations.filter(quotation => 
      Object.entries(filters).every(
        ([key, value]) => quotation[key as keyof Quotation] === value
      )
    );
  }
  
  // Actualizar el estado de una cotización
  updateQuotationStatus(id: string, status: Quotation['status']): boolean {
    const quotation = this.quotations.find(q => q.id === id);
    if (quotation) {
      quotation.status = status;
      return true;
    }
    return false;
  }
  
  // Actualizar una cotización existente
  updateQuotation(
    id: string,
    data: Partial<Omit<Quotation, 'id' | 'totalBeforeTax' | 'totalTax' | 'totalAmount'>>
  ): Quotation | undefined {
    const quotation = this.quotations.find(q => q.id === id);
    if (!quotation) return undefined;
    
    // Actualizar campos
    Object.assign(quotation, data);
    
    // Si se actualizaron los items, recalcular totales
    if (data.items) {
      const totals = this.calculateTotals(data.items);
      Object.assign(quotation, totals);
    }
    
    return quotation;
  }
  
  // Eliminar una cotización
  deleteQuotation(id: string): boolean {
    const index = this.quotations.findIndex(q => q.id === id);
    if (index !== -1) {
      this.quotations.splice(index, 1);
      return true;
    }
    return false;
  }
  
  // Generar PDF de cotización (simulado)
  generateQuotationPDF(id: string): string {
    const quotation = this.quotations.find(q => q.id === id);
    if (!quotation) {
      throw new Error(`Cotización con ID ${id} no encontrada`);
    }
    
    // En una implementación real, aquí generaríamos un PDF
    // Para esta demo, simplemente devolvemos una URL simulada
    return `https://api.example.com/quotations/${id}/pdf`;
  }
  
  // Enviar cotización por email (simulado)
  sendQuotationByEmail(id: string, email: string): boolean {
    const quotation = this.quotations.find(q => q.id === id);
    if (!quotation) {
      throw new Error(`Cotización con ID ${id} no encontrada`);
    }
    
    // Simular envío de email
    console.log(`Cotización ${id} enviada a ${email}`);
    
    // Actualizar estado
    quotation.status = 'sent';
    
    return true;
  }
  
  // Función auxiliar para calcular totales
  private calculateTotals(items: QuotationItem[]) {
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
