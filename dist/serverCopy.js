"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const servicesCopy_js_1 = __importDefault(require("./lib/servicesCopy.js"));
const app = express_1.default();
const port = parseInt(process.env.PORT, 10) || 5050;
if (process.env.NODE_ENV === 'production') {
    app.use(cors_1.default());
}
else {
    app.use(cors_1.default({ origin: "http://localhost:3000" }));
}
app.get('/slice', (req, res) => {
    servicesCopy_js_1.default.services();
    res.send('...working on it...');
});
app.listen(port, () => console.log(`Express server running on ${port}.`));
