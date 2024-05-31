const express = require("express")
const { DAL } = require("./data-access-layer/mongo-dal")
const cors = require('cors')

const PORT = 4000
const app = express()
const defaultUserAmount = 10

//express config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({'origin': '*'}));

//routes
app.post('/login', async (req, res) => {

    try {
        let username = req.body.username
        let user = await DAL.getUserByUsername(username)

        let response = {
            count: user.length,
            results: user
        }
        res.json(response)

    } catch (err) {
        console.log(err)
    }

})

app.get('/getUserByUserID', async (req, res) => {
    const { userID } = req.params
    try {
        const user = await DAL.getUserByUserID(userID)

        let response = {
            results: user
        }
        res.json(response)

    } catch (err){
        console.log(err)
    }

})

app.get('/getUsers', async (req, res) => {
    try {
        const amountToReturn = parseInt(req.query.amount) || defaultUserAmount

        let users = await DAL.getAllUsers(amountToReturn)
        if (amountToReturn > defaultUserAmount) {
            users = users.slice(0, defaultUserAmount)
        }

        let response = {
            count: users.length,
            results: users
        }
        res.json(response)

    } catch (err) {
        console.log(err)
    }
})

app.post('/updateUser', async (req, res) => {
    const { userID, dataToUpdate } = req.body
    try {
        await DAL.updateUser(userID, dataToUpdate)

    } catch (err) {
        console.log(err)
    }
})

app.get('/stats', async (req, res) => {

})

app.post('/register', async (req, res) => {
    // let newUser = {
    //     username: "XXXsupakillaXXX",
    //     password: "supersecret-PASS",
    //     email: "thealmightyone21@yahoo.com",
    //     age: 19,
    //     answers: {
    //         "this is question 1": "answer to question 1",
    //         "this is question 4": "answer to question 4",
    //         "this is question 5": "answer to question 5"
    //     },
    //     userID: 0
    // }
    let newUser = req.body
    console.log(newUser)

    try {
        if (newUser.userID === 0) {
            let allUsers = await DAL.getAllUsers()
            let response = {
                count: allUsers.length,
                results: allUsers,
            }
            newUser.userID = (response["count"] + 1)

        }
        await DAL.registerNewUser(newUser)
        res.send("User registered!")

    } catch (err) {
        console.error(err)
    }
})

//start express
app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`)
})