import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { Report, NewReport } from '../models/Report';
import ReportCache from './ReportCache';

const REPORTS_COLLECTION = 'reports';

class ReportService {
  async addReport(report: NewReport): Promise<Report> {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      lugar: report.lugar,
      tipoIncidente: report.tipoIncidente,
      descripcion: report.descripcion,
      fecha: Timestamp.fromDate(report.fecha),
      latitude: report.latitude,
      longitude: report.longitude,
    });
    const newReport: Report = {
      id: docRef.id,
      lugar: report.lugar,
      tipoIncidente: report.tipoIncidente,
      descripcion: report.descripcion,
      fecha: report.fecha.toLocaleDateString(),
      latitude: report.latitude,
      longitude: report.longitude,
    };
    ReportCache.addReport(newReport);
    return newReport;
  }

  async getAllReports(): Promise<Report[]> {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    const reports = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        lugar: data.lugar,
        tipoIncidente: data.tipoIncidente,
        descripcion: data.descripcion,
        fecha: data.fecha?.toDate?.().toLocaleDateString() || '',
        latitude: data.latitude,
        longitude: data.longitude,
      } as Report;
    });
    ReportCache.loadReports(reports);
    return reports;
  }

  async deleteReport(id: string): Promise<void> {
    await deleteDoc(doc(db, REPORTS_COLLECTION, id));
    ReportCache.removeReport(id);
  }
}

export default new ReportService();