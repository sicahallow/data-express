const { MongoClient } = require('mongodb') //add the package
const uri = "mongodb+srv://dev:dev@mtm282.x4xusmm.mongodb.net/?retryWrites=true&w=majority&appName=MTM282"
const dbName = "data-expressdb" //database to target
const questionCollection = "questions" //multi-choice question collection
const userCollection = "users" //user collection
const client = new MongoClient(uri) //this client allows us to talk to database

exports.DAL = {
    getAllQuestions: async function(){
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(questionCollection)

        return await collection.find().toArray()
    },
    getUserByUsername: async function(username){
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(userCollection)

        let query = {}
        if (username) {
            query.username = username
        }

        return await collection.find(query).toArray()
    }
}