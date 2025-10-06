// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  // Número de WhatsApp de Argentina
  // Formato: código de país + número (sin espacios, guiones o símbolos)
  // Argentina: +54 9 3794 4065 09 = 5493794406509
  phoneNumber: '5493795040807',
  
  // Mensaje de bienvenida personalizable
  welcomeMessage: '¡Hola! Me interesa consultar sobre estos productos:',
  
  // Mensaje de cierre personalizable
  closingMessage: 'Me gustaría obtener más información sobre estos productos y conocer la disponibilidad. ¡Gracias!'
};

export const formatWhatsAppMessage = (items: any[], total: number) => {
  let message = `${WHATSAPP_CONFIG.welcomeMessage}\n\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   - Cantidad: ${item.quantity}\n`;
    message += `   - Precio unitario: $${item.product.price.toFixed(2)}\n`;
    message += `   - Subtotal: $${(item.product.price * item.quantity).toFixed(2)}\n`;
    if (item.product.category) {
      message += `   - Categoría: ${item.product.category}\n`;
    }
    message += '\n';
  });
  
  message += `*TOTAL: $${total.toFixed(2)}*\n\n`;
  message += WHATSAPP_CONFIG.closingMessage;
  
  return message;
};

export const openWhatsApp = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};