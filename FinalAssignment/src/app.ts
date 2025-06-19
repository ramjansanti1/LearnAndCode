import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UserRouter from './routes/user.route.js';
import NewsRouter from './routes/news.route.js';
import NotificationRouter from './routes/notification.route.js';
import AdminRouter from './routes/admin.route.js';

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['POST', 'GET', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/user', new UserRouter().router);
app.use('/news', new NewsRouter().router);
app.use('/notification', new NotificationRouter().router);
app.use('/admin', new AdminRouter().router);

export default app;