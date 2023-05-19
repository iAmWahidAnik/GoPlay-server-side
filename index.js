const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// middleWare 
app.use(cors());
app.use(express.json());

//-------------------------- mongo DB ----------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rjh1tl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // my DB & collections 
        const GoPlay = client.db("GoPlay");
        const toyCars = GoPlay.collection("toyCars");

        // creating indexes 
        const indexKeys = { productName: 1 };
        const indexOptions = { name: 'productName_1' };
        const result = await toyCars.createIndex(indexKeys, indexOptions)

        //my operations

        //get operations
        app.get('/alltoys', async (req, res) => {
            const query = req.query.searchText;
            // console.log(query);
            if (query) {
                const toy = await toyCars.find({ productName: { $regex: query, $options: 'i'} }).toArray();
                res.send(toy);
            }
            else {
                const toys = await toyCars.find().toArray();
                res.send(toys)
            }

        })
        app.get('/cars', async (req, res) => {
            const query = { subCategory: "car" };
            const toys = await toyCars.find(query).toArray();
            res.send(toys)
        })
        app.get('/trucks', async (req, res) => {
            const query = { subCategory: "truck" };
            const toys = await toyCars.find(query).toArray();
            res.send(toys)
        })
        app.get('/busses', async (req, res) => {
            const query = { subCategory: "bus" };
            const toys = await toyCars.find(query).toArray();
            res.send(toys)
        })
        app.get('/alltoys/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const toy = await toyCars.findOne(query);
            res.send(toy);
        })
        // app.get('/alltoys', async(req, res) => {
        //     const query = req.query;
        //     console.log(query);
        // })
        //post operations
        app.post('/addatoy', async (req, res) => {
            const toy = req.body;
            const result = await toyCars.insertOne(toy);
            res.send(result)
        })
        //update operations
        //delete operations

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//-------------------------- mongo DB ---------------------------- 

app.get('/', (req, res) => {
    res.send('GoPlay server is running');
});

app.listen(port, () => {
    console.log(`GoPlay server is running on port ${port}`);
})