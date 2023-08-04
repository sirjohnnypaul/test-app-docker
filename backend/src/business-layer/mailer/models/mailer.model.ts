export namespace MailerModel {
  export interface EmailOptions {
    from: string;
    cc?: any;
    bcc?: any;
    to: string;
    subject: string;
    html?: string;
    text?: string;
    attachments: EmailAttachment[];
  }

  export interface EmailAttachment {
    filename: string;
    content: string;
    encoding: string;
  }
}
