import { WHATSAPP_NUMBER } from '@/lib/site-config'

/** Digits-only phone accepted by the WhatsApp click-to-chat endpoint. */
function phone(): string {
  return WHATSAPP_NUMBER.replace(/\D/g, '')
}

/** Builds a click-to-chat link, optionally pre-filled with `text`. */
export function buildWhatsAppLink(text?: string): string {
  const base = `https://api.whatsapp.com/send/?phone=${phone()}&type=phone_number&app_absent=0`
  return text ? `${base}&text=${encodeURIComponent(text)}` : `${base}&text`
}
