import nodemailer from 'nodemailer';

const alertEmailFrom = process.env.ALERT_EMAIL_FROM;
const alertEmailTo = process.env.ALERT_EMAIL_TO;
const alertEmailAppPassword = process.env.ALERT_EMAIL_APP_PASSWORD;

function createTransporter() {
  if (!alertEmailFrom || !alertEmailAppPassword) {
    throw new Error('Email service is not configured correctly');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: alertEmailFrom,
      pass: alertEmailAppPassword,
    },
  });
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
  if (!alertEmailFrom || !alertEmailTo || !alertEmailAppPassword) {
    console.warn('Login alert email skipped: missing email environment variables');
    return;
  }

  const transporter = createTransporter();

  const loginTime = loginTimeIso ?? new Date().toISOString();

  const subject = `IK Pulse Login Alert: ${userEmail}`;

  const text = [
    'A user has logged into IK Pulse.',
    '',
    `Email: ${userEmail}`,
    `Role: ${userRole}`,
    `Time: ${loginTime}`,
    `IP Address: ${ipAddress ?? 'Unknown'}`,
    `User Agent: ${userAgent ?? 'Unknown'}`,
  ].join('\n');

  await transporter.sendMail({
    from: alertEmailFrom,
    to: alertEmailTo,
    subject,
    text,
  });
}