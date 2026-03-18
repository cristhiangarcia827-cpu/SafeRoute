import { StyleSheet, Dimensions } from 'react-native';
import { MAP_VISIBLE_WIDTH } from '../utils/mapData';

const { width } = Dimensions.get('window');

export const globalColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  danger: '#FF3B30',
  success: '#4CAF50',
  warning: '#FF9500',
  gray: '#8E8E93',
  lightGray: '#f0f0f0',
  white: '#fff',
  black: '#333',
  border: '#ddd',
  background: '#F5F5F5',
  errorBackground: '#FFE5E5',
  errorText: '#FF3B30',
  routeBackground: '#E8F5E9',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.background,
  },
  scrollContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: globalColors.primary,
    marginTop: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: globalColors.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: globalColors.black,
  },
  input: {
    backgroundColor: globalColors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: globalColors.border,
  },
  textArea: {
    height: 100,
  },
  button: {
    marginVertical: 10,
  },
  selectButton: {
    backgroundColor: globalColors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: globalColors.border,
  },
  selectButtonText: {
    fontSize: 16,
    color: globalColors.black,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: globalColors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: globalColors.black,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: globalColors.border,
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: globalColors.black,
  },
  searchInput: {
    backgroundColor: globalColors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: globalColors.border,
  },
  list: {
    maxHeight: 300,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: globalColors.gray,
  },
  errorContainer: {
    backgroundColor: globalColors.errorBackground,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  errorText: {
    color: globalColors.errorText,
    textAlign: 'center',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: globalColors.white,
    padding: 20,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: globalColors.gray,
    textAlign: 'center',
  },
});

export const homeStyles = StyleSheet.create({
  mapViewport: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: globalColors.border,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContent: {
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  cityBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  calleHorizontal: {
    position: 'absolute',
    height: 4,
    left: 0,
  },
  calleVertical: {
    position: 'absolute',
    width: 4,
    top: 0,
  },
  manzana: {
    position: 'absolute',
    borderWidth: 1,
  },
  line: {
    position: 'absolute',
    transformOrigin: 'top left',
    zIndex: 5,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: globalColors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  markerLabel: {
    fontSize: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    color: globalColors.black,
    fontWeight: '600',
  },
  routeInfo: {
    backgroundColor: globalColors.routeBackground,
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: MAP_VISIBLE_WIDTH,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: globalColors.success,
    marginBottom: 5,
  },
  routePath: {
    fontSize: 14,
    color: globalColors.black,
    marginBottom: 10,
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: globalColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export const routeReportStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: globalColors.background,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  graphContainer: {
    backgroundColor: globalColors.white,
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: globalColors.black,
  },
  lugarInfo: {
    marginBottom: 8,
  },
  lugarName: {
    fontSize: 14,
    color: globalColors.primary,
  },
});

export const alertListStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: globalColors.white,
    borderBottomWidth: 1,
    borderBottomColor: globalColors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: globalColors.black,
  },
  deleteAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: globalColors.danger,
  },
  deleteAllText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: globalColors.background,
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: globalColors.black,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: globalColors.gray,
    textAlign: 'center',
  },
});

export const alertItemStyles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lugar: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: globalColors.black,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: globalColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  fecha: {
    color: globalColors.gray,
    fontSize: 12,
  },
  descripcion: {
    fontSize: 14,
    color: '#3A3A3A',
    marginBottom: 10,
    lineHeight: 20,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  deleteText: {
    color: globalColors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
});