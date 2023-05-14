const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.port || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cwbwt8c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run() {
    try {
        const flightCollection = client.db('flightPrice').collection('flightPrice');

        app.get('/flights', async (req, res) => {
            const query = [
                { 'source': req.query.source },
                { 'destination': req.query.destination },
                { 'date': req.query.date }];
            console.log(query);
            const result = await flightCollection.findOne({
                $and: query
            });
            if (result !== null) {
                res.send({ data: result, status: true });
            } else {
                res.send({ data: {}, status: false })
            }

        })
        app.post('/flights', async (req, res) => {
            const flight = req.body;
            console.log(flight);
            const query = [
                { 'source': req.body.source },
                { 'destination': req.body.destination },
                { 'date': req.body.date }];
            console.log(query);
            const result = await flightCollection.findOne({
                $and: query
            });
            if (result) {
                res.send({acknowledged: false});
            }
            else {
                const result = await flightCollection.insertOne(flight);
                res.send(result);
            }

        })
    }
    finally {

    }
}

run().catch(error => console.log(error));

app.get('/', async (req, res) => {
    res.send('server is running');
})

app.listen(port, () => console.log(`Server running on ${port}`))