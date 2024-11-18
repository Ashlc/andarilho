const express = require("express");
const cors = require("cors");
// Certifique-se de que o caminho para o arquivo está correto

const app = express();

app.use(cors());

// app.use(cors({
//     origin: ['https://example.com', 'https://another-example.com']
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const userRouter = require("./api/routes/userRouter");
const locationRouter = require("./api/routes/locationRouter");
const reportRouter = require("./api/routes/reportRouter");
const authRouter = require("./api/routes/authRouter");

app.use("/user", userRouter);
app.use("/location", locationRouter);
app.use("/report", reportRouter);
app.use("/auth", authRouter);
app.use("/", (req, res) => res.send("Welcome to the API"));

module.exports = app;
