const express = require('express');

const app = express();

const mongoose = require('mongoose');
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://JeanClenche:20080503@clusters.fjxyf.mongodb.net/Clusters?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à votre MongoDB = success'))
.catch(() => console.log('Connexion echouée'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;