import { describe, it, expect } from 'bun:test';
import { FinancingTool } from '../src/tools/financing';

describe('FinancingTool', () => {
  const financingTool = new FinancingTool();

  it('should calculate financing correctly', () => {
    const result = financingTool.calculateFinancing({
      price: 25000,
      downPayment: 5000,
      term: 60,
      interestRate: 0.08
    });

    expect(result.totalPrice).toBe(25000);
    expect(result.downPayment).toBe(5000);
    expect(result.termMonths).toBe(60);
    expect(result.interestRate).toBe(8);
    expect(result.monthlyPayment).toBeGreaterThan(0);
  });

  it('should generate multiple financing scenarios', () => {
    const scenarios = financingTool.generateFinancingScenarios(25000);
    
    expect(scenarios.length).toBe(3);
    scenarios.forEach(scenario => {
      expect(scenario.totalPrice).toBe(25000);
      expect(scenario.monthlyPayment).toBeGreaterThan(0);
    });
  });

  it('should handle different down payment percentages', () => {
    const results = [
      financingTool.calculateFinancing({
        price: 25000,
        downPayment: 2500,  // 10%
        term: 36,
        interestRate: 0.08
      }),
      financingTool.calculateFinancing({
        price: 25000,
        downPayment: 5000,  // 20%
        term: 48,
        interestRate: 0.07
      })
    ];

    expect(results[0].downPayment).toBe(2500);
    expect(results[1].downPayment).toBe(5000);
    expect(results[0].monthlyPayment).toBeGreaterThan(results[1].monthlyPayment);
  });
});
