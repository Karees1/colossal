import { fmtKES } from './format';

// Placeholder until the real shop WhatsApp number is confirmed — set
// REACT_APP_WHATSAPP_NUMBER in .env.local to override. Digits only, with
// country code, no leading +.
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '254700000000';

export function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// lines: [{ product: {name}, size, colour, qty, price }]
export function buildOrderMessage(lines, customer, ref) {
  const itemLines = lines
    .map((l, i) => {
      const name = l.product?.name || 'Item';
      const colourPart = l.colour ? ` (${l.colour})` : '';
      const sizePart = l.size ? ` — Size ${l.size}` : '';
      const lineTotal = fmtKES((l.product?.price || 0) * l.qty);
      return `${i + 1}. ${name}${colourPart}${sizePart} × ${l.qty} — ${lineTotal}`;
    })
    .join('\n');

  const total = fmtKES(lines.reduce((sum, l) => sum + (l.product?.price || 0) * l.qty, 0));

  return [
    'Hello GENTLEMAN, I\'d like to order:',
    '',
    itemLines,
    '',
    `Total: ${total}`,
    `Name: ${customer.name}`,
    `Delivery area: ${customer.area}`,
    'Payment: Pay on delivery',
    `Order ref: ${ref}`,
  ].join('\n');
}

export function buildGeneralQuestionMessage() {
  return 'Hello GENTLEMAN, I have a question.';
}

export function buildProductInquiryMessage(product, url) {
  const price = fmtKES(product.price);
  return `Hello GENTLEMAN, I'm interested in the ${product.name} (${price}). Is it available?\n${url}`;
}

export function buildFittingMessage() {
  return 'Hello GENTLEMAN, I\'d like to book a fitting at the shop.';
}

export function buildSizeHelpMessage() {
  return 'Hello GENTLEMAN, I need help with sizing. My measurements: chest __ cm, waist __ cm.';
}

export function buildSavedListMessage(products) {
  const lines = products.map((p, i) => `${i + 1}. ${p.name} — ${fmtKES(p.price)}`).join('\n');
  return `Hello GENTLEMAN, I'd like to ask about these saved pieces:\n\n${lines}`;
}
