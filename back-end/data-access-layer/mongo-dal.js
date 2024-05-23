const { MongoClient } = require('mongodb') //add the package
const uri = "mongodb+srv://dev:dev@mtm282.x4xusmm.mongodb.net/?retryWrites=true&w=majority&appName=MTM282"
const dbName = "data-expressdb" //database to target
const questionCollection = "questions" //multi-choice question collection
const userCollection = "users" //user collection
const client = new MongoClient(uri) //this client allows us to talk to database

exports.DAL = {
    getAllQuestions: async function(){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(questionCollection)

            let questions = await collection.find().toArray()
            return questions

        } catch (err) {
            console.error(err);

        } finally {
            await client.close()
        }

    },
    getUserByUsername: async function(username){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            let query = {}
            if (username) {
                query.username = username
            }
            let user = await collection.find(query).toArray()
            return user

        } catch (err) {
            console.error(err);
        } finally {
            await client.close()
        }
    },
    getAllUsers: async function(amount){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            let allUsers = await collection.find({limit: amount}).toArray()
            return allUsers

        } catch (err) {
            console.log(err)

        } finally {
            await client.close()
        }
    },
    registerNewUser: async function(newUser){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            await collection.insertOne(newUser)

        } catch (err) {
            console.log(err)

        } finally {
            await client.close()
        }
    }
}