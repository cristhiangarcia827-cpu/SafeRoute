import { LinkedList } from '../dataStructures/LinkedList';
import { Report } from '../models/Report';

class ReportCache {
  private static instance: ReportCache;
  private list: LinkedList;

  private constructor() {
    this.list = new LinkedList();
  }

  static getInstance(): ReportCache {
    if (!ReportCache.instance) {
      ReportCache.instance = new ReportCache();
    }
    return ReportCache.instance;
  }

  loadReports(reports: Report[]): void {
    this.list = new LinkedList();
    reports.forEach(report => this.list.append(report));
  }

  addReport(report: Report): void {
    this.list.append(report);
  }

  removeReport(id: string): boolean {
    return this.list.delete(id);
  }

  getAllReports(): Report[] {
    return this.list.getAll();
  }

  getReport(id: string): Report | null {
    return this.list.getById(id);
  }
}

export default ReportCache.getInstance();