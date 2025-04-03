import { FinancingRequest, FinancingResult } from '../types';

export class FinancingTool {
  calculateFinancing(
    request: FinancingRequest
  ): FinancingResult {
    const { 
      price, 
      downPayment, 
      term, 
      interestRate 
    } = request;

    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 12;
    
    const monthlyPayment = (loanAmount * (monthlyRate)) / 
      (1 - Math.pow(1 + monthlyRate, -term));

    return {
      totalPrice: price,
      downPayment,
      termMonths: term,
      interestRate: interestRate * 100,
      monthlyPayment: Number(monthlyPayment.toFixed(2))
    };
  }

  generateFinancingScenarios(
    price: number
  ): FinancingResult[] {
    const scenarios = [
      { downPaymentRatio: 0.1, term: 36, interestRate: 0.08 },
      { downPaymentRatio: 0.2, term: 48, interestRate: 0.07 },
      { downPaymentRatio: 0.3, term: 60, interestRate: 0.06 }
    ];

    return scenarios.map(scenario => 
      this.calculateFinancing({
        price,
        downPayment: price * scenario.downPaymentRatio,
        term: scenario.term,
        interestRate: scenario.interestRate
      })
    );
  }
}
