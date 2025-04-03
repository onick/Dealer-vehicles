import { TestDrive } from '../types';

export class TestDriveTool {
  private testDrives: TestDrive[] = [];

  scheduleTestDrive(
    testDrive: Omit<TestDrive, 'status'>
  ): TestDrive {
    const newTestDrive: TestDrive = {
      ...testDrive,
      status: 'Pending'
    };

    // Validar disponibilidad
    const existingTestDrive = this.testDrives.find(
      td => 
        td.date === testDrive.date && 
        td.time === testDrive.time
    );

    if (existingTestDrive) {
      throw new Error('A test drive is already scheduled at this time');
    }

    this.testDrives.push(newTestDrive);
    return newTestDrive;
  }

  listTestDrives(
    filters?: Partial<TestDrive>
  ): TestDrive[] {
    if (!filters) return this.testDrives;

    return this.testDrives.filter(testDrive => 
      Object.entries(filters).every(
        ([key, value]) => testDrive[key as keyof TestDrive] === value
      )
    );
  }

  updateTestDriveStatus(
    customer: string, 
    vehicle: string, 
    newStatus: TestDrive['status']
  ): boolean {
    const testDrive = this.testDrives.find(
      td => td.customer === customer && td.vehicle === vehicle
    );

    if (testDrive) {
      testDrive.status = newStatus;
      return true;
    }

    return false;
  }
}
