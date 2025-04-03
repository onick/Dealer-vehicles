import { describe, it, expect } from 'bun:test';
import { InventoryTool } from '../src/tools/inventory';

describe('InventoryTool', () => {
  const inventoryTool = new InventoryTool();

  it('should search vehicles by brand', () => {
    const results = inventoryTool.searchInventory({ brand: 'Toyota' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe('Toyota');
  });

  it('should get vehicle details by VIN', () => {
    const vehicle = inventoryTool.getVehicleDetails('VIN123');
    expect(vehicle).toBeDefined();
    expect(vehicle?.model).toBe('Corolla');
  });

  it('should add a new vehicle', () => {
    const newVehicle = {
      vin: 'VIN789',
      brand: 'Ford',
      model: 'Mustang',
      year: 2024,
      price: 45000,
      color: 'Red',
      available: true
    };

    inventoryTool.addVehicle(newVehicle);
    const addedVehicle = inventoryTool.getVehicleDetails('VIN789');
    expect(addedVehicle).toBeDefined();
    expect(addedVehicle?.brand).toBe('Ford');
  });

  it('should update vehicle availability', () => {
    const result = inventoryTool.updateAvailability('VIN123', false);
    expect(result).toBe(true);
    
    const vehicle = inventoryTool.getVehicleDetails('VIN123');
    expect(vehicle?.available).toBe(false);
  });
});
