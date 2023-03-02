import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { GMAIL_PASSWORD, GMAIL_USER } from '@/config';
import { forgotPasswordTemplate } from '@/templates/forgotPassword';
class NodemailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASSWORD,
    },
  });

  public sendMail(mailOptions: SendMailOptions) {
    return new Promise<SentMessageInfo>((resolve, reject) => {
      this.transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

  public async sendResetPasswordMail(email: string, resetPasswordUrl: string) {
    const mailOptions: SendMailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Reset password - 7FF',
      html: forgotPasswordTemplate(resetPasswordUrl),
    };
    return await this.sendMail(mailOptions);
  }
}
export default NodemailerService;
