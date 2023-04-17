import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { GMAIL_PASSWORD, GMAIL_USER } from '@/config';
import { forgotPasswordTemplate, orderConfirmationTemplate } from '@/templates';
import { IOrder } from '@/models/Order';
import { bookingConfirmationTemplate } from '@/templates/bookingConfirmation';
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

  public async sendResetPasswordMail(email: string, href: string) {
    const mailOptions: SendMailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Reset password - 7FF',
      html: forgotPasswordTemplate(href),
    };
    return await this.sendMail(mailOptions);
  }

  public async sendOrderConfirmationEmail(email: string, order: IOrder, href: string) {
    const mailOptions: SendMailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Order confirmation - 7FF',
      html: orderConfirmationTemplate(order, href),
    };
    return await this.sendMail(mailOptions);
  }

  public async sendBookingConfirmationEmail(email: string, underName: string, bookingTime: number | string) {
    const mailOptions: SendMailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Booking confirmation - 7FF',
      html: bookingConfirmationTemplate(underName, bookingTime),
    };
    return await this.sendMail(mailOptions);
  }
}
export default NodemailerService;
