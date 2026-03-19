import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Report } from '../models/Report';

const REPORTS_COLLECTION = 'reports';

class ReportService {
  // Agregar un reporte
  async addReport(report: Omit<Report, 'id' | 'fecha'>): Promise<Report> {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
      ...report,
      fecha: Timestamp.now(), // Guardar como timestamp para orden correcto
    });
    return { 
      ...report, 
      id: docRef.id, 
      fecha: new Date().toLocaleDateString()
    } as Report;
  }

  // Obtener todos los reportes
  async getAllReports(): Promise<Report[]> {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir el timestamp a string legible
      const fecha = data.fecha?.toDate ? data.fecha.toDate().toLocaleDateString() : '';
      return {
        id: doc.id,
        lugar: data.lugar,
        tipoIncidente: data.tipoIncidente,
        descripcion: data.descripcion,
        fecha: fecha,
      } as Report;
    });
  }

  // Eliminar un reporte por ID
  async deleteReport(id: string): Promise<void> {
    await deleteDoc(doc(db, REPORTS_COLLECTION, id));
  }
}

export default new ReportService();