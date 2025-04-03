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
