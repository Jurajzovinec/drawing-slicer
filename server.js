const express = require('express');
const services = require("./lib/services");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5050;

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.get('/slice', (req, res) => {
    services.sliceService()
    .then(readableStreamDataPf=>{
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=slicedToA4s.pdf',
            'Content-Transfer-Encoding': 'Binary'
        });
        console.log('...sendingReadableStream...');
        readableStreamDataPf.pipe(res);
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Express server running on ${port}.`));



