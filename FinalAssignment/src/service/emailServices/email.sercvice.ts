import nodemailer from 'nodemailer';
import Notification from '../../models/notification.model.js';
import News from '../../models/news.model.js';

export default class Nodemailer {
    transporter: any

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            secure: false,
            auth: {
                user: 'ayansanti1@gmail.com',
                pass: 'bbf24e1ec01f4f',
            }
        });
    }

    async startEmailScheduler(user: { [key: string]: any }) {
        await this.sendNotification(user);
        setInterval(async () => {
            await this.sendNotification(user);
        }, 86400000);
    }

    async sendNotification(user: { [key: string]: any }) {
        const notification = await Notification.findOne({ userId: user._id });
        const article = await News.findById(notification?.articleId);
        if (notification && article) {
            const mailOptions = this.getMailOptions(article.title as string, notification.url, user.email);
            console.log(mailOptions);
            this.transporter.sendMail(mailOptions, function (error: any, info: any) {
                if (error) {
                    console.log('Error:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        }
    }

    getMailOptions(headline: string, url: string, userEmail: string) {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: headline,
            html: `<a href=${url}>Read More</a>`
        };
        return mailOptions;
    }
}