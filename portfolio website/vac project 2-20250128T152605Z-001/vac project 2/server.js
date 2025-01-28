const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { contentType } = require('express/lib/response');

const port = 3605;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const mongoUri = 'mongodb://localhost:27017/vac202';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    skills: String,
    experience: String,
    education: String,
    projects: String,
    achievements: String,
    
});

const FormData = mongoose.model('FormData', formSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/submit', async (req, res) => {
    try {
        const formData = new FormData(req.body);
        const savedData = await formData.save();
        console.log('Form data saved:', savedData);

        
        res.redirect(`/theme?id=${savedData._id}`);
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).send('An error occurred while saving form data.');
    }   
    });


app.get('/theme', (req, res) => {
    res.sendFile(path.join(__dirname, 'theme.html'));
});


app.get('/prof', (req, res) => {
    res.sendFile(path.join(__dirname, 'final1.html'));
});


app.get('/creative', (req, res) => {
    res.sendFile(path.join(__dirname, 'final2.html'));
});


app.get('/fetch-prof', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await FormData.findById(id); 
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.error('Error fetching professional data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});


app.get('/fetch-creative', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await FormData.findById(id); 
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No data found');
        }
    } catch (error) {
        console.error('Error fetching creative data:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
