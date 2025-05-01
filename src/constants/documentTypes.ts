/**
 * Constantes para los tipos de documento aceptados en la aplicación
 * Valores que coinciden exactamente con el enum del backend:
 * com.pandemy.backend.enums.DocumentType
 */
export const DOCUMENT_TYPES = {
  CITIZENSHIP_CARD: 'CITIZENSHIP_CARD',          // Cédula de Ciudadanía
  FOREIGNERS_ID_CARD: 'FOREIGNERS_ID_CARD',      // Cédula de Extranjería
  PASSPORT: 'PASSPORT',                          // Pasaporte
  IDENTITY_CARD: 'IDENTITY_CARD'                 // Tarjeta de Identidad
};

/**
 * Función de utilidad para obtener el texto legible de un tipo de documento
 * @param documentType Tipo de documento (debe ser uno de los valores de DOCUMENT_TYPES)
 * @returns Texto legible del tipo de documento
 */
export const getDocumentTypeText = (documentType: string): string => {
  switch(documentType) {
    case DOCUMENT_TYPES.CITIZENSHIP_CARD:
      return 'Cédula de Ciudadanía';
    case DOCUMENT_TYPES.FOREIGNERS_ID_CARD:
      return 'Cédula de Extranjería';
    case DOCUMENT_TYPES.PASSPORT:
      return 'Pasaporte';
    case DOCUMENT_TYPES.IDENTITY_CARD:
      return 'Tarjeta de Identidad';
    default:
      return 'Tipo de documento no válido';
  }
};

export default DOCUMENT_TYPES; 