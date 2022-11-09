const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('hellow')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vljpuop.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        const serviceCollection = client.db('photography').collection('services')
        const reviewCollection = client.db('photography').collection('reviews')
        const addServiceCollection = client.db('photography').collection('newservice')
        app.get('/services', async (req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.findOne(query)
            res.send(result)
          
        })



        app.get('/reviews', async(req, res)=>{
            // console.log(req.query)
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
       })



    //    email


     

        app.post('/reviews', async(req, res)=>{
            const review = req.body
            const result = await  reviewCollection.insertOne(review)
            res.send(result)

        })


        
        app.get('/reviews/:id', async(req, res)=>{
            const id = req.params.id 
            const query = {service_id: id }
            const cursor =  reviewCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })






        app.patch('/reviews/:id', async(req, res)=>{
            const id = req.params.id
            const message = req.body.message
            const query = {_id: ObjectId(id)}
            const updateDoc = {
                $set:{
                    message: message
                }
            }

            const result = await reviewCollection.updateOne(query, updateDoc)
            res.send(result)
            console.log(result)
        })




        





        app.delete('/reviews/:id', async (req, res)=>{
            const id = req.params.id 
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })

        

        // addNewService


        app.get('/newservice', async(req, res)=>{
            const query = {}
            const cursor = addServiceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })
        
        app.post('/newservice', async(req, res)=>{
            const review = req.body
            const result = await  addServiceCollection.insertOne(review)
            res.send(result)

        })


        


    }
    finally{

    }
}

run().catch(e => console.error(e))








app.listen(port, ()=>{
    console.log(`server is running ${port}`)
})









