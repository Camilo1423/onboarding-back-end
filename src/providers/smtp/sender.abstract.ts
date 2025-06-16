import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

type configEmail = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export abstract class AbstractSender {
  constructor(private readonly config: configEmail) {}

  public readHtmlTemplate(template_name: string): string {
    const pathBase = path.resolve(
      __dirname,
      `./templates/${template_name}.html`,
    );
    if (!fs.existsSync(pathBase)) {
      throw new Error(`El archivo de plantilla ${template_name} no existe`);
    }
    return fs.readFileSync(pathBase, 'utf8');
  }

  /**
   * Reemplaza las llaves {{key}} en la plantilla con los valores del objeto genérico
   * @param templateContent Contenido de la plantilla
   * @param data Objeto genérico con claves y valores a reemplazar
   * @returns Plantilla con los valores reemplazados
   */
  replaceTemplateKeys<T extends Record<string, unknown>>(
    template_name: string,
    data: T,
  ): string {
    let templateContent = this.readHtmlTemplate(template_name);

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      templateContent = templateContent.replace(
        new RegExp(placeholder, 'g'),
        String(value),
      );
    }

    return templateContent;
  }

  protected async senderMailer(
    body: string,
    email: string,
    subject: string,
    fromCount: string,
    attachments: {
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }[] = [],
  ): Promise<void> {
    const credsAuth = {
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    };
    const transporter = nodemailer.createTransport(credsAuth);
    await transporter.sendMail({
      from: `"${fromCount}" <${this.config.auth.user}>`,
      to: email,
      subject,
      text: '',
      html: body,
      attachments,
    });
  }
}
