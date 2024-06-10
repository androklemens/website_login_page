const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;  // Gunakan port 4000

const mongoAPIURL = 'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-qzbkgwv/endpoint/data/v1';
const apiKey = '9aUHvowb69eEShVhLgDOM8CX4qQSGr7yQ4JBLt2fbb3CXJ57yMYKMHVQmB9xR24L';  // Gunakan API key Anda

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));  // Menyajikan file statis dari direktori 'public'

// Sign up endpoint
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, email, password: hashedPassword };

        const response = await axios.post(`${mongoAPIURL}/action/insertOne`, {
            collection: 'users',
            database: 'my-auth-db',
            dataSource: 'Cluster0',
            document: newUser
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            }
        });

        if (response.status === 200 || response.status === 201) {
            res.status(201).send({ message: 'User registered successfully' });
        } else {
            res.status(500).send({ message: 'Error registering user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error registering user' });
    }
});

// Sign in endpoint
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const response = await axios.post(`${mongoAPIURL}/action/findOne`, {
            collection: 'users',
            database: 'my-auth-db',
            dataSource: 'Cluster0',
            filter: { username: username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            }
        });

        const user = response.data.document;
        if (!user) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error logging in' });
    }
});

// Menyajikan file index.html saat mengakses root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
