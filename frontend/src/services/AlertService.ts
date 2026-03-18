import { LinkedList } from '../dataStructures/LinkedList';
import { Report } from '../models/Report';

class AlertService {
  private static instance: AlertService;
  private reportsList: LinkedList;

  private constructor() {
    this.reportsList = new LinkedList();
    this.initMockData();
  }

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  private initMockData(): void {
    const mockReports: Report[] = [
    ];
    mockReports.forEach(report => this.reportsList.append(report));
  }

  addReport(report: Report): void {
    this.reportsList.append(report);
  }

  getAllReports(): Report[] {
    return this.reportsList.getAll();
  }

  getReportById(id: string): Report | null {
    return this.reportsList.getById(id);
  }

  deleteReport(id: string): boolean {
    return this.reportsList.delete(id);
  }

  getReportsCount(): number {
    return this.reportsList.getSize();
  }
}

export default AlertService.getInstance();