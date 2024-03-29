import express from 'express';
import { createServer } from 'http';
import enforce from 'express-sslify';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import fileUpload from 'express-fileupload';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV != 'development') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 2 * 1024 * 1024 //2kB max file(s) size
  }
}));

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

routes(app);

app.get('/index.html', (_, res) => {
  res.redirect('/');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

httpServer.listen(PORT, () => {
  console.info(`Application started at ${PORT}`)
});