import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;
const alertEmailTo = process.env.ALERT_EMAIL_TO;

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY');
  }

  if (!resend) {
    resend = new Resend(resendApiKey);
  }

  return resend;
}

type SendLoginAlertParams = {
  userEmail: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  loginTimeIso?: string;
};

export async function sendLoginAlertEmail({
  userEmail,
  userRole,
  ipAddress,
  userAgent,
  loginTimeIso,
}: SendLoginAlertParams): Promise<void> {
  if (!resendApiKey || !resendFromEmail || !alertEmailTo) {
    console.warn('Login alert email skipped: missing Resend environment variables');
    return;
  }

  const client = getResendClient();
  const loginTime = loginTimeIso ?? new Date().toISOString();

  const subject = `IK Pulse Login Alert: ${userEmail}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>IK Pulse Login Alert</h2>
      <p>A user has logged into IK Pulse.</p>
      <ul>
        <li><strong>Email:</strong> ${escapeHtml(userEmail)}</li>
        <li><strong>Role:</strong> ${escapeHtml(userRole)}</li>
        <li><strong>Time:</strong> ${escapeHtml(loginTime)}</li>
        <li><strong>IP Address:</strong> ${escapeHtml(ipAddress ?? 'Unknown')}</li>
        <li><strong>User Agent:</strong> ${escapeHtml(userAgent ?? 'Unknown')}</li>
      </ul>
    </div>
  `;

  const { error } = await client.emails.send(
    {
      from: `IK Pulse Alerts <${resendFromEmail}>`,
      to: [alertEmailTo],
      subject,
      html,
    },
    {
      idempotencyKey: `login-alert:${userEmail}:${loginTime}`,
    }
  );

  if (error) {
    throw new Error(
      typeof error.message === 'string' ? error.message : 'Failed to send login alert email'
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}