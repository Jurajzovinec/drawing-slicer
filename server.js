const express = require('express');
const services = require("./lib/services");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5050;

if(process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.get('/slice', (req, res) => {
    services.sliceService();
}); 
 
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Express server running on ${port}.`));



