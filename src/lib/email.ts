import { sendMail } from '@/lib/email/resend-client';
import {
	emailTemplates,
	renderAdminCustomEmail,
	type EmailData,
	type EmailTemplateName,
} from '@/lib/email/templates';

export { emailTemplates, type EmailData };

export async function sendRawEmail(
	to: string,
	subject: string,
	htmlBody: string,
	recipientName = 'Client',
) {
	const html = renderAdminCustomEmail(subject, recipientName, htmlBody);
	return sendMail({ to, subject, html });
}

export const sendEmail = async <T extends EmailTemplateName>(
	to: string,
	template: T,
	data: EmailData[T],
) => {
	try {
		const builder = emailTemplates[template] as (
			data: EmailData[T],
		) => { subject: string; html: string };

		let result: { subject: string; html: string };

		switch (template) {
			case 'welcome': {
				const d = data as EmailData['welcome'];
				result = emailTemplates.welcome(d.name, d.email, d.token);
				break;
			}
			case 'resetPassword':
				result = emailTemplates.resetPassword(
					data as EmailData['resetPassword'],
				);
				break;
			case 'deposit':
				result = emailTemplates.deposit(data as EmailData['deposit']);
				break;
			case 'confirmDeposit':
				result = emailTemplates.confirmDeposit(
					data as EmailData['confirmDeposit'],
				);
				break;
			case 'withdraw':
				result = emailTemplates.withdraw(data as EmailData['withdraw']);
				break;
			case 'confirmWithdraw':
				result = emailTemplates.confirmWithdraw(
					data as EmailData['confirmWithdraw'],
				);
				break;
			case 'trade':
				result = emailTemplates.trade(data as EmailData['trade']);
				break;
			case 'AdminNotification':
				result = emailTemplates.AdminNotification(
					data as EmailData['AdminNotification'],
				);
				break;
			case 'referralBonus':
				result = emailTemplates.referralBonus(
					data as EmailData['referralBonus'],
				);
				break;
			case 'resendToken': {
				const d = data as EmailData['resendToken'];
				result = emailTemplates.resendToken({
					token: d.token,
					email: d.email,
				});
				break;
			}
			default:
				throw new Error(`Unsupported email template: ${template}`);
		}

		const sent = await sendMail({
			to,
			subject: result.subject,
			html: result.html,
		});
		if (!sent.success) {
			return {
				success: false,
				error: sent.error,
				details: sent.error,
			};
		}
		return { success: true, id: sent.id };
	} catch (error) {
		console.error('Detailed error sending email:', error);
		return {
			success: false,
			error: 'Failed to send email',
			details: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};
