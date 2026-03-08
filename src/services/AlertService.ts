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
    //Reportes de ejemplo
    const mockReports: Report[] = [
      {
        id: '1',
        lugar: 'Parque Central',
        tipoIncidente: 'Robo',
        descripcion: 'Robo a transeúntes en horas de la noche',
        fecha: new Date().toLocaleDateString()
      },
      {
        id: '2',
        lugar: 'Calle 50',
        tipoIncidente: 'Zona Oscura',
        descripcion: 'Falta de iluminación en toda la calle',
        fecha: new Date().toLocaleDateString()
      },
      {
        id: '3',
        lugar: 'Universidad',
        tipoIncidente: 'Acoso',
        descripcion: 'Reportes de acoso en paraderos cercanos',
        fecha: new Date().toLocaleDateString()
      }
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