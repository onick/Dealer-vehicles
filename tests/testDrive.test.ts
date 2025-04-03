import { describe, it, expect } from 'bun:test';
import { TestDriveTool } from '../src/tools/testDrive';

describe('TestDriveTool', () => {
  let testDriveTool: TestDriveTool;

  beforeEach(() => {
    testDriveTool = new TestDriveTool();
  });

  it('should schedule a test drive', () => {
    const testDrive = testDriveTool.scheduleTestDrive({
      customer: 'María López',
      vehicle: 'Toyota Corolla',
      date: '2024-05-20',
      time: '16:00'
    });

    expect(testDrive.customer).toBe('María López');
    expect(testDrive.status).toBe('Pending');
  });

  it('should not allow scheduling test drives at the same time', () => {
    testDriveTool.scheduleTestDrive({
      customer: 'Carlos Ruiz',
      vehicle: 'Honda Civic',
      date: '2024-05-25',
      time: '15:00'
    });

    expect(() => {
      testDriveTool.scheduleTestDrive({
        customer: 'Ana Gómez',
        vehicle: 'Ford Focus',
        date: '2024-05-25',
        time: '15:00'
      });
    }).toThrow('A test drive is already scheduled at this time');
  });

  it('should list test drives', () => {
    testDriveTool.scheduleTestDrive({
      customer: 'Pedro Sánchez',
      vehicle: 'Nissan Versa',
      date: '2024-06-01',
      time: '10:00'
    });

    const testDrives = testDriveTool.listTestDrives();
    expect(testDrives.length).toBeGreaterThan(0);
  });

  it('should update test drive status', () => {
    testDriveTool.scheduleTestDrive({
      customer: 'Laura Martínez',
      vehicle: 'Volkswagen Jetta',
      date: '2024-05-30',
      time: '14:00'
    });

    const result = testDriveTool.updateTestDriveStatus(
      'Laura Martínez', 
      'Volkswagen Jetta', 
      'Confirmed'
    );

    expect(result).toBe(true);
    
    const testDrives = testDriveTool.listTestDrives({
      customer: 'Laura Martínez',
      vehicle: 'Volkswagen Jetta'
    });

    expect(testDrives[0].status).toBe('Confirmed');
  });
});
