import { Vehicle } from '../types';

export class InventoryTool {
  private inventory: Vehicle[] = [
    {
      vin: 'VIN123',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2023,
      price: 25000,
      color: 'White',
      available: true,
      features: [
        'Air Conditioning',
        'Touchscreen',
        'Backup Camera'
      ],
      images: [
        'toyota-corolla-1.jpg',
        'toyota-corolla-2.jpg'
      ]
    },
    {
      vin: 'VIN456',
      brand: 'Honda',
      model: 'Civic',
      year: 2023,
      price: 27000,
      color: 'Blue',
      available: true,
      features: [
        'Leather Seats',
        'Sunroof',
        'Advanced Safety Package'
      ],
      images: [
        'honda-civic-1.jpg',
        'honda-civic-2.jpg'
      ]
    }
  ];

  searchInventory(filters: Partial<Vehicle>): Vehicle[] {
    return this.inventory.filter(vehicle => 
      Object.entries(filters).every(([key, value]) => 
        vehicle[key as keyof Vehicle] === value
      )
    );
  }

  getVehicleDetails(vin: string): Vehicle | undefined {
    return this.inventory.find(vehicle => vehicle.vin === vin);
  }

  addVehicle(vehicle: Vehicle): void {
    this.inventory.push(vehicle);
  }

  updateAvailability(vin: string, available: boolean): boolean {
    const vehicle = this.inventory.find(v => v.vin === vin);
    if (vehicle) {
      vehicle.available = available;
      return true;
    }
    return false;
  }
}
