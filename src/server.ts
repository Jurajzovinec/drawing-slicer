import express from 'express';
import cors from 'cors';
import services from './lib/services';
import { fstat } from 'fs';

const app = express();

const port: number = parseInt(<string>process.env.PORT, 10) || 5050

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.get('/slice', (req, res) => {
    services.services();
    res.send('...working on it...')
});

app.get('/sliceservice', (req, res) => {
    services.sliceService()
        .then(resultedReadStream => {
            res.contentType("application/pdf");
            res.send(resultedReadStream);
        });
});

app.listen(port, () => console.log(`Express server running on ${port}.`));

