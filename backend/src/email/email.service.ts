
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly brevo: BrevoClient;
  private readonly senderName: string;
  private readonly senderEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');

    if (!apiKey) {
      throw new Error('A variável BREVO_API_KEY não foi definida no .env.');
    }

    const emailFrom =
      this.configService.get<string>('EMAIL_FROM') ??
      'Wesley Developer <ley.desenvolvedor@gmail.com>';

    const match = emailFrom.match(/^(.*?)\s*<([^<>]+)>$/);

    this.senderName = match ? match[1].trim() : 'Wesley Developer';
    this.senderEmail = match ? match[2].trim() : emailFrom.trim();

    this.brevo = new BrevoClient({ apiKey });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ??
      'http://localhost:3001';

    const verificationUrl =
      `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const safeName = this.escapeHtml(name);

    try {
      await this.brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: this.senderName,
          email: this.senderEmail,
        },
        to: [{ email, name }],
        subject: 'Confirma o teu e-mail — AuthFlow',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #202124;">
            <h1>Bem-vindo ao AuthFlow, ${safeName}!</h1>
            <p>Recebemos o teu pedido de registo.</p>
            <p>Para confirmar que este endereço de e-mail te pertence, clica no botão abaixo:</p>
            <p style="margin: 28px 0;">
              <a href="${verificationUrl}" style="background: #635bff; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none;">
                Confirmar e-mail
              </a>
            </p>
            <p>Se não criaste uma conta no AuthFlow, podes ignorar esta mensagem.</p>
            <p style="font-size: 12px; color: #666;">Por segurança, não partilhes este link com ninguém.</p>
          </div>
        `,
        textContent: [
          `Bem-vindo ao AuthFlow, ${name}!`,
          '',
          'Recebemos o teu pedido de registo.',
          'Para confirmar o teu e-mail, abre este link:',
          verificationUrl,
          '',
          'Se não criaste uma conta, podes ignorar esta mensagem.',
        ].join('\n'),
      });
    } catch (error: unknown) {
      const details =
        error instanceof Error ? error.message : 'Erro desconhecido';

      this.logger.error(
        `Falha ao enviar e-mail pelo Brevo: ${details}`,
      );

      throw new InternalServerErrorException(
        'Não foi possível enviar o e-mail de confirmação. Tenta novamente.',
      );
    }
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };

      return entities[character];
    });
  }
}
