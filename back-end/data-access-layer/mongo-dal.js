const { MongoClient, ObjectId } = require('mongodb') //add the package


const uri = "mongodb+srv://dev:dev@mtm282.x4xusmm.mongodb.net/?retryWrites=true&w=majority&appName=MTM282"
const dbName = "data-expressdb" //database to target
const userCollection = "users" //user collection

const client = new MongoClient(uri) //this client allows us to talk to database

const testUsers = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {}
]

exports.DAL = {
    getUserByUsername: async function(username){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            let query = {}
            if (username) {
                query.username = username
            }
            return await collection.find(query).toArray()

        } catch (err) {
            console.error(err);
        } finally {
            await client.close()
        }
    },
    getUserByUserID: async function(userID){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            let query = {}
            if (userID) {
                query.userID = userID
            }
            return await collection.find(query).toArray()

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

            let query = {}

            const users = await collection.find(query,{limit: amount}).toArray()
            return users

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
    },
    updateUser: async function(userID, updatedData){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            await collection.updateOne(
                {userID: userID},
                {
                    $set: updatedData
                }
            )

        } catch (err) {
            console.log(err)

        } finally {
            await client.close()
        }
    },
    getUserQuestionStats: async function(){
        try {
            await client.connect()
            const database = client.db(dbName)
            const collection = database.collection(userCollection)

            const pipeline = [
                {
                    $unwind: "$answers"
                },
                {
                    $facet: {
                        "GamingMedium": [
                            { $match: { "answers.What is your preferred gaming medium?": { $exists: true } } },
                            { $group: { _id: "$answers.What is your preferred gaming medium?", count: { $sum: 1 } } }
                        ],
                        "FavoriteColor": [
                            { $match: { "answers.What is your favorite color?": { $exists: true } } },
                            { $group: { _id: "$answers.What is your favorite color?", count: { $sum: 1 } } }
                        ],
                        "FavoriteGenre": [
                            { $match: { "answers.What is your favorite gaming genre?": { $exists: true } } },
                            { $group: { _id: "$answers.What is your favorite gaming genre?", count: { $sum: 1 } } }
                        ]
                    }
                }
            ];

            return await collection.aggregate(pipeline).toArray()

        } catch (err) {
            console.log(err)

        } finally {
            await client.close()
        }
    }
}