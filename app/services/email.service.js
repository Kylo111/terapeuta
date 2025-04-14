/**
 * Serwis e-mail
 * @module services/email
 */

const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * Klasa serwisu e-mail
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicjalizuje transporter e-mail
   */
  initializeTransporter() {
    // Konfiguracja transportera e-mail
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  /**
   * Wysyła e-mail
   * @param {Object} emailData - Dane e-maila
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendEmail(emailData) {
    try {
      if (!this.transporter) {
        this.initializeTransporter();
      }

      const mailOptions = {
        from: config.email.from,
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html
      };

      // Dodanie załączników, jeśli istnieją
      if (emailData.attachments) {
        mailOptions.attachments = emailData.attachments;
      }

      // Wysłanie e-maila
      const info = await this.transporter.sendMail(mailOptions);
      console.log('E-mail wysłany:', info.messageId);
      return info;
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila:', error);
      throw error;
    }
  }

  /**
   * Wysyła e-mail powitalny
   * @param {string} email - Adres e-mail odbiorcy
   * @param {string} name - Imię odbiorcy
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendWelcomeEmail(email, name) {
    try {
      const emailData = {
        to: email,
        subject: 'Witaj w aplikacji terapeutycznej',
        text: `Witaj ${name}!\n\nDziękujemy za rejestrację w naszej aplikacji terapeutycznej. Cieszymy się, że jesteś z nami.\n\nPozdrawiamy,\nZespół aplikacji terapeutycznej`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Witaj ${name}!</h2>
            <p style="color: #666; font-size: 16px;">Dziękujemy za rejestrację w naszej aplikacji terapeutycznej. Cieszymy się, że jesteś z nami.</p>
            <a href="${config.appUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Przejdź do aplikacji</a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Pozdrawiamy,<br>Zespół aplikacji terapeutycznej</p>
          </div>
        `
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila powitalnego:', error);
      throw error;
    }
  }

  /**
   * Wysyła e-mail z resetem hasła
   * @param {string} email - Adres e-mail odbiorcy
   * @param {string} resetToken - Token resetowania hasła
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendPasswordResetEmail(email, resetToken) {
    try {
      const resetUrl = `${config.appUrl}/reset-password?token=${resetToken}`;

      const emailData = {
        to: email,
        subject: 'Reset hasła',
        text: `Otrzymaliśmy prośbę o reset hasła do Twojego konta. Aby zresetować hasło, kliknij w poniższy link:\n\n${resetUrl}\n\nJeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.\n\nPozdrawiamy,\nZespół aplikacji terapeutycznej`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset hasła</h2>
            <p style="color: #666; font-size: 16px;">Otrzymaliśmy prośbę o reset hasła do Twojego konta. Aby zresetować hasło, kliknij w poniższy link:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Zresetuj hasło</a>
            <p style="color: #666; font-size: 16px; margin-top: 20px;">Jeśli to nie Ty prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Pozdrawiamy,<br>Zespół aplikacji terapeutycznej</p>
          </div>
        `
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila z resetem hasła:', error);
      throw error;
    }
  }

  /**
   * Wysyła e-mail z potwierdzeniem sesji
   * @param {string} email - Adres e-mail odbiorcy
   * @param {Object} session - Sesja
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendSessionConfirmationEmail(email, session) {
    try {
      const sessionUrl = `${config.appUrl}/sessions/${session._id}`;
      const sessionDate = new Date(session.startTime).toLocaleString('pl-PL');

      const emailData = {
        to: email,
        subject: 'Potwierdzenie sesji terapeutycznej',
        text: `Twoja sesja terapeutyczna ${session.therapyMethod || ''} została zaplanowana na ${sessionDate}.\n\nAby zobaczyć szczegóły sesji, kliknij w poniższy link:\n\n${sessionUrl}\n\nPozdrawiamy,\nZespół aplikacji terapeutycznej`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Potwierdzenie sesji terapeutycznej</h2>
            <p style="color: #666; font-size: 16px;">Twoja sesja terapeutyczna ${session.therapyMethod || ''} została zaplanowana na ${sessionDate}.</p>
            <a href="${sessionUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Zobacz szczegóły sesji</a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Pozdrawiamy,<br>Zespół aplikacji terapeutycznej</p>
          </div>
        `
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila z potwierdzeniem sesji:', error);
      throw error;
    }
  }

  /**
   * Wysyła e-mail z przypomnieniem o sesji
   * @param {string} email - Adres e-mail odbiorcy
   * @param {Object} session - Sesja
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendSessionReminderEmail(email, session) {
    try {
      const sessionUrl = `${config.appUrl}/sessions/${session._id}`;
      const sessionDate = new Date(session.startTime).toLocaleString('pl-PL');

      const emailData = {
        to: email,
        subject: 'Przypomnienie o sesji terapeutycznej',
        text: `Przypominamy o nadchodzącej sesji terapeutycznej ${session.therapyMethod || ''}, która rozpocznie się ${sessionDate}.\n\nAby zobaczyć szczegóły sesji, kliknij w poniższy link:\n\n${sessionUrl}\n\nPozdrawiamy,\nZespół aplikacji terapeutycznej`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Przypomnienie o sesji terapeutycznej</h2>
            <p style="color: #666; font-size: 16px;">Przypominamy o nadchodzącej sesji terapeutycznej ${session.therapyMethod || ''}, która rozpocznie się ${sessionDate}.</p>
            <a href="${sessionUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Zobacz szczegóły sesji</a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Pozdrawiamy,<br>Zespół aplikacji terapeutycznej</p>
          </div>
        `
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila z przypomnieniem o sesji:', error);
      throw error;
    }
  }

  /**
   * Wysyła e-mail z przypomnieniem o zadaniu
   * @param {string} email - Adres e-mail odbiorcy
   * @param {Object} task - Zadanie
   * @returns {Promise<Object>} - Informacje o wysłanym e-mailu
   */
  async sendTaskReminderEmail(email, task) {
    try {
      const taskUrl = `${config.appUrl}/tasks/${task._id}`;
      const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleString('pl-PL') : 'wkrótce';

      const emailData = {
        to: email,
        subject: 'Przypomnienie o zadaniu',
        text: `Przypominamy o zadaniu "${task.title}", które ma termin wykonania ${dueDate}.\n\nAby zobaczyć szczegóły zadania, kliknij w poniższy link:\n\n${taskUrl}\n\nPozdrawiamy,\nZespół aplikacji terapeutycznej`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Przypomnienie o zadaniu</h2>
            <p style="color: #666; font-size: 16px;">Przypominamy o zadaniu "${task.title}", które ma termin wykonania ${dueDate}.</p>
            <a href="${taskUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Zobacz szczegóły zadania</a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Pozdrawiamy,<br>Zespół aplikacji terapeutycznej</p>
          </div>
        `
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila z przypomnieniem o zadaniu:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
