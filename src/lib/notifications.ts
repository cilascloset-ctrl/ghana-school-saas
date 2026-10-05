import { normalizeGhanaPhone } from './phone';

type SendResult = { ok: boolean; provider: string; id?: string; error?: string };

export async function sendSMS(to: string, body: string, senderId?: string): Promise<SendResult> {
  const provider = process.env.SMS_PROVIDER || 'mock';
  const phone = normalizeGhanaPhone(to);

  if (provider === 'arkesel') {
    const response = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.ARKESEL_API_KEY || ''
      },
      body: JSON.stringify({
        sender: senderId || process.env.ARKESEL_SENDER_ID || 'SCHOOL',
        message: body,
        recipients: [phone]
      })
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, provider, id: data?.data?.id || data?.id, error: response.ok ? undefined : JSON.stringify(data) };
  }

  // Hubtel endpoint/credentials should be configured from the active Hubtel developer account.
  // The adapter is intentionally isolated here so each school can choose its provider.
  if (provider === 'hubtel') {
    return { ok: false, provider, error: 'Configure Hubtel SMS endpoint/credentials in this adapter.' };
  }

  console.log('[MOCK SMS]', { to: phone, body });
  return { ok: true, provider: 'mock', id: `mock-${Date.now()}` };
}

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = 'en',
  bodyParams: string[] = []
): Promise<SendResult> {
  if (process.env.WHATSAPP_ENABLED !== 'true') {
    console.log('[MOCK WHATSAPP]', { to, templateName, bodyParams });
    return { ok: true, provider: 'mock-whatsapp', id: `mock-wa-${Date.now()}` };
  }

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const version = process.env.WHATSAPP_API_VERSION || 'v23.0';
  if (!phoneNumberId || !token) return { ok: false, provider: 'whatsapp', error: 'WhatsApp credentials missing' };

  const components = bodyParams.length
    ? [{ type: 'body', parameters: bodyParams.map(text => ({ type: 'text', text })) }]
    : undefined;

  const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizeGhanaPhone(to),
      type: 'template',
      template: { name: templateName, language: { code: languageCode }, components }
    })
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, provider: 'whatsapp', id: data?.messages?.[0]?.id, error: response.ok ? undefined : JSON.stringify(data) };
}
