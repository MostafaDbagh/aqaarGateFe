/**
 * WhatsApp number for "Add Property" CTA when user is guest or regular user (non-agent).
 * Agents use the add-property page; guests/users open this number on WhatsApp.
 */
export const ADD_PROPERTY_WHATSAPP_NUMBER = '00971586057772';

export function getAddPropertyWhatsAppUrl() {
  const digits = ADD_PROPERTY_WHATSAPP_NUMBER.replace(/[^0-9]/g, '').replace(/^0+/, '') || ADD_PROPERTY_WHATSAPP_NUMBER.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}`;
}
