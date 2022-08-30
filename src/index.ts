import express from 'express';

import get from './routes/get';
import post from './routes/post';
import createUser from './routes/createUser';


const PORT = process.env.NODE_ENV === 'production' ? 80 : 3000;

const app = express();

app.disable('x-powered-by');

app.use(get);
app.use(post);
app.use(createUser);


app.listen(PORT);
console.log(`APP IS NOW LISTENING ON PORT: ${PORT}`);