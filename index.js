const express = require('express');
const {mongoConnect} = require('./utils/database');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin.js');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    })
);

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {
    const errorMessage = error.message || "Something went wrong";
    const errorStatus = error.statusCode || 500;
    return res.status(errorStatus).json({
        error: errorMessage,
        status: errorStatus,
        stack: error.stack,
        success: false,
    })
})

mongoConnect(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log('Server is running!');
    })
})