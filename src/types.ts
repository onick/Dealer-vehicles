// Tipos para el inventario de vehículos
export interface Vehicle {
  vin: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  color: string;
  available: boolean;
  features?: string[];
  images?: string[];
}

// Tipo para solicitudes de financiamiento
export interface FinancingRequest {
  price: number;
  downPayment: number;
  term: number;
  interestRate: number;
}

// Resultado de cálculo de financiamiento
export interface FinancingResult {
  totalPrice: number;
  downPayment: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
}

// Tipo para prueba de manejo
export interface TestDrive {
  customer: string;
  vehicle: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

// Tipos para cotizaciones
export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface Quotation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  expirationDate: string;
  items: QuotationItem[];
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;
}

// Tipos para facturas
export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  paymentDate?: string;
  totalBeforeTax: number;
  totalTax: number;
  totalAmount: number;
}
