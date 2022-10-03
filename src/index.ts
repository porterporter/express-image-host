import express from 'express';

import { get } from './routes/';
import { post } from './routes/';
import { createUser } from './routes/';


const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000;

const app = express();

app.disable('x-powered-by');

app.use(get);
app.use(post);
app.use(createUser);
app.get('/', (_req, res) => res.redirect(301, 'http://porter.moe'));


app.listen(PORT);
console.log(`APP IS NOW LISTENING ON PORT: ${PORT}`);