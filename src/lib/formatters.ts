/**
 * Formatea un número como precio en pesos argentinos
 * - Agrega separador de miles (punto)
 * - Elimina los decimales
 * - Agrega el símbolo $ al inicio
 */
export const formatPriceARS = (price: number): string => {
  return `$${Math.round(price).toLocaleString('es-AR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
};