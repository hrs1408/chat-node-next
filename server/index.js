const express = require('express')
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const session = require('express-session')

// Configuration
dotenv.config({ path: path.join(__dirname, "config.env") });

// Database
require("./utils/Database")();

app.use(session({
    secret: 'SECRET',
    resave: true,
    saveUninitialized: true
}));
require('./utils/PassportGoogle');
require('./utils/PassportFacebook');

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        methods: "*",
        credentials: true,
    })
);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Socket io
const socket = require("./socket");
const io = new Server(server, {
    cors: { origin: ["http://localhost:3000"] },
});

app.use((req, res, next) => {
    req.io = io;


    next();
})

socket(io);


app.get('/', (req, res) => {
    res.send('Hello World')
})

// Router
const router = require("./routes/index");
router(app);


// Running server
const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
});