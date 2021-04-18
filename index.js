const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lhtxa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("shotsStudio").collection("services");
  const reviewCollection = client.db("shotsStudio").collection("reviews");
  const BuyerServiceCollection = client.db("shotsStudio").collection("customerService");
  const adminCollection = client.db("shotsStudio").collection("admin");
  
  
  app.post('/addReview', (req, res) => {
    const newReview = req.body
    reviewCollection.insertOne(newReview)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.get('/reviews', (req, res) => {
    reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })

})

app.post('/addService', (req, res) => {
    const newService = req.body
    servicesCollection.insertOne(newService)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.get('/services', (req, res) => {
    servicesCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })

})

app.post('/addToCart', (req, res) => {
    const newAddToCart = req.body
    BuyerServiceCollection.insertOne(newAddToCart)
        .then(result => {
            res.send(result.insertedCount > 0)
        })

})

app.get('/cart', (req, res) => {
    BuyerServiceCollection.find({ email: req.query.email })
        .toArray((err, documents) => {
            res.send(documents)
        })

})


app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body
    console.log('adding admin', newAdmin)
    adminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

app.get('/admin', (req, res) => {
    adminCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })

})

app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
})

app.get('/allOrder', (req, res) => {
    BuyerServiceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })

})

app.delete('/delete/:id', (req, res) => {
    servicesCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            res.send(result.deletedCount > 0)

        })
})


app.patch('/update/:id', (req, res) => {
    BuyerServiceCollection.updateOne({ _id: ObjectId(req.params.id) },
        {
            $set: { status: req.body.status }
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
})


});


app.get('/',(req, res) => {
    res.send("It's Working !!!")
})


app.listen(process.env.PORT || port)