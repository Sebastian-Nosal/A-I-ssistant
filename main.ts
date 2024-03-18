import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import languageRouter from './routes/language.js';
import bodyParser from 'body-parser';
import https from 'https';
import session from 'express-session';
import accountRouter from './routes/account.js';
import faRouter from './routes/FA.js';
import botRouter from './routes/bot.js';
import WebAuthn from 'webauthn';
import dotenv from 'dotenv';
import {serverStart} from './utils/log.js'

dotenv.config();  

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: process.env.secret, cookie: {secure:true,max: 365*24*3600}}));

app.use('/language/', languageRouter);
app.use('/account/', accountRouter);
app.use('/2fa/', faRouter);
app.use('/bot/', botRouter);

const APP_ID = process.env.AppId;
const HTTPS_PORT = process.env.HTTPS_PORT || "3000" ;
const HTTP_PORT = process.env.HTTP_PORT  || "3000" ;

const options = {
    key: process.env.sslKey,
    cert: process.env.sslCert
};

const serverhttps = https.createServer(options, app).listen(HTTPS_PORT,() => {
    serverStart(parseInt(HTTPS_PORT));
});

/*
app.listen(HTTP_PORT,() => {
    log.serverStart(HTTP_PORT);
});
*/
