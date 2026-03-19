import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { Report } from '../models/Report';

const REPORTS_COLLECTION = 'reports';

class ReportService {
  async addReport(report: Omit<Report, 'id'>): Promise<Report> {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...report,
      fecha: Timestamp.fromDate(new Date(report.fecha)),
    });
    return { ...report, id: docRef.id } as Report;
  }

  async getAllReports(): Promise<Report[]> {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        lugar: data.lugar,
        tipoIncidente: data.tipoIncidente,
        descripcion: data.descripcion,
        fecha: data.fecha?.toDate().toLocaleDateString() || '',
        latitude: data.latitude,
        longitude: data.longitude,
      } as Report;
    });
  }

  async deleteReport(id: string): Promise<void> {
    await deleteDoc(doc(db, REPORTS_COLLECTION, id));
  }
}

export default new ReportService();