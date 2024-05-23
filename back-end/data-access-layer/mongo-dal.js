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

        let questions = await collection.find().toArray()
        await client.close()
        return questions
    },
    getUserByUsername: async function(username){
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(userCollection)

        let query = {}
        if (username) {
            query.username = username
        }

        let user = await collection.find().toArray()
        await client.close()

        return user

    },
    getAllUsers: async function(amount){
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(userCollection)

        let allUsers = await collection.find({limit: amount}).toArray()
        await client.close()

        return allUsers
    },
    registerNewUser: async function(newUser){
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(userCollection)

        await collection.insertOne(newUser)
        await client.close()
    }
}