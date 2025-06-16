import { Inject, Injectable } from '@nestjs/common';
import { AbstractSender } from './sender.abstract';
import { OnEvent } from '@nestjs/event-emitter';
import { envConfig } from 'src/config/env.config';
import { Email } from 'src/common/type/Email';

@Injectable()
export class SmtpSender extends AbstractSender {
  constructor(@Inject('CONFIG') private readonly env: typeof envConfig) {
    super({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  @OnEvent('notification.welcome-onboarding.created')
  async sendWelcomeOnboardingCreated(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys('welcome-onboarding', email);
      await this.senderMailer(
        template,
        email.email,
        `Bienvenido al equipo colega (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }

  @OnEvent('notification.welcome-onboarding.deleted')
  async sendWelcomeOnboardingDeleted(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys(
        'cancel-welcome-onboarding',
        email,
      );
      await this.senderMailer(
        template,
        email.email,
        `Te informamos cancelamos el onboarding (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }

  @OnEvent('notification.welcome-onboarding.updated')
  async sendWelcomeOnboardingUpdated(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys(
        'update-welcome-onboarding',
        email,
      );
      await this.senderMailer(
        template,
        email.email,
        `Se actualizo el onboarding (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }

  @OnEvent('notification.technical-onboarding.created')
  async sendTechnicalOnboardingCreated(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys('technical-onboarding', email);
      await this.senderMailer(
        template,
        email.email,
        `Bienvenido al equipo colega (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }

  @OnEvent('notification.technical-onboarding.deleted')
  async sendTechnicalOnboardingDeleted(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys(
        'cancel-technical-onboarding',
        email,
      );
      await this.senderMailer(
        template,
        email.email,
        `Te informamos cancelamos el onboarding (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }

  @OnEvent('notification.technical-onboarding.updated')
  async sendTechnicalOnboardingUpdated(event: Email[]) {
    for (const email of event) {
      const template = this.replaceTemplateKeys(
        'update-technical-onboarding',
        email,
      );
      await this.senderMailer(
        template,
        email.email,
        `Se actualizo el onboarding (${email.name})`,
        'Banco de Bogotá',
      );
    }
  }
}
