import nodemailer from 'nodemailer';
import Notification from '../../models/notification.model.js';
import News from '../../models/news.model.js';

export default class Nodemailer {
    transporter: any

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT as string),
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            }
        });
    }

    async startEmailScheduler(user: { [key: string]: any }) {
        console.log("Email started");
        await this.sendNotification(user);
        setInterval(async () => {
            await this.sendNotification(user);
        }, 86400000);
    }

    async sendNotification(user: { [key: string]: any }) {
        try {
            const notification = await Notification.findOne({ userId: user._id, sentOverMail: false });
            if (!notification) return console.log("No notification found");
            const article = await News.findById(notification.articleId);
            if (!article) return console.log("Article not found");
            const mailOptions = this.getMailOptions(article.title as string, article.imageUrl as string, notification.url, user.email);
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
            if (notification) { notification.sentOverMail = true; }
            await notification.save({ validateBeforeSave: false });
        } catch (error) {
            console.error("Failed to send notification email:", error);
        }
    }

    getMailOptions(headline: string, imageUrl: string, url: string, userEmail: string) {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: headline,
            html: `<h1>${headline}</h1>
                        <br/>
                        <img src="${imageUrl}" alt="News Image" style="max-width: 100%; height: auto;" />
                        <br/>
                        <a href="${url}" style="
                        display: inline-block;
                        padding: 12px 20px;
                        margin-top: 10px;
                        font-size: 16px;
                        color: white;
                        background-color: #007BFF;
                        text-decoration: none;
                        border-radius: 5px;
                        font-family: Arial, sans-serif;
                        ">
                        Read More
                        </a>
                        `
        };
        return mailOptions;
    }
}