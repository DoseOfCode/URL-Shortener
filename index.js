const config = require('./config');
const express = require('express');
const path = require('path');
const fs = require('fs-extra');

const app = express();

const mongoose = require('mongoose');
const Shortened = require('./models/shortened.model');

mongoose.connect(config.mongoose.address, { dbName: config.mongoose.database })
    .then(() => console.log(`[MongoDB] Connected.`))
    .catch(console.error)

app.use(express.json());

app.use((_req, res, next) =>
{
    res.header("access-control-allow-origin", config.express.frontend_address);
    res.header("access-control-allow-credentials", "true");
    res.header("access-control-allow-methods", "POST, GET, OPTIONS");
    res.header("access-control-allow-headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("x-powered-by", "dose of code :p");

    next();
});

app.post('/create', async (req, res) =>
{
    const { real_url } = req.body;

    if (!real_url)
    {
        return res.json({
            success: false,
            message: "You must provide a real_url string in the request body."
        });
    }

    let { _id } = await Shortened.create({
        created_at: Date.now(),
        real_url
    });

    return res.json({
        success: true,
        _id
    });
});

app.get('/r/:_id', async (req, res) =>
{
    let { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id))
    {
        return res.redirect('/not-found');
    }

    _id = mongoose.Types.ObjectId(_id);

    let shortened = await Shortened.findOne({ _id });

    if (!shortened) 
    {
        return res.redirect('/not-found');
    }

    return res.redirect(shortened.real_url);
});

app.use(
    '/',

    express.Router()
        .use(express.static(path.join(__dirname, './../app/')))
        .get("*", (_req, res) => res.sendFile(path.join(__dirname, './../app/index.html'))
    )
);

app.use((err, req, res, _next) =>
{
    let fileName = "errors/express-" + Date.now() + ".json";

    fs.ensureFileSync(fileName);

    fs.writeFileSync(fileName, JSON.stringify({
        message: err.message,
        stack:   err.stack,
        path:    req.path,
        method:  req.method,
        body:    req.body
    }, null, 4));
    
    console.log(`[Express] Siently wrote an error (${fileName})`);

    return res.status(500).json({ success: false, message: "Internal Server Error. Try Again Later." });
});

app.listen(config.express.listening_port, () => console.log("[Express] Listening on port " + config.express.listening_port.toString()));