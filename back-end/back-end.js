const express = require("express")
const { DAL } = require("./data-access-layer/mongo-dal")

const PORT = 4000
const app = express()
const defaultUserAmount = 10

//express config
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes
app.get('/questions', async (req, res) => {

    //defining queries, where left of || is the value of the query and right of || is the default if it is undefined
    // const limit = parseInt(req.query.limit) || defaultJokeAmount  // default to 15 if not provided
    // const category = req.query.category || false // default to false if not provided

    try {
        let questions = await DAL.getAllQuestions()

        // //handles category query, and filters out the jokes that don't equal the specified category
        // if (category) {
        //     jokes.filter(joke => joke.category === category)
        // }

        // //if the limit query is bigger than the default amount (defaultJokeAmount), jokes will be sliced and return only
        // //defaultJokeAmount amount of jokes
        // if (limit > defaultJokeAmount) {
        //     jokes = jokes.slice(0, limit)
        // }

        let response = {
            results: questions
        }
        res.json(response)

    } catch (error) {
        console.log(error)
    }
})

app.get('/getOneUser', async (req, res) => {
    let username = "username1"
    let user = await DAL.getUserByUsername(username)

    // console.log("user: " + JSON.stringify(user[0].answers))
    // console.log("questions: " + JSON.stringify(questions[0].questions))

    let response = {
        results: user
    }
    res.json(response)

})

app.get('/getUsers', async (req, res) => {
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
})

app.post('/register', async (req, res) => {
    let newUser = {
        username: "XXXsupakillaXXX",
        password: "supersecret-PASS",
        email: "thealmightyone21@yahoo.com",
        age: 19,
        answers: {
            "this is question 1": "answer to question 1",
            "this is question 4": "answer to question 4",
            "this is question 5": "answer to question 5"
        },
        userID: 0
    }//replace with req.body

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
    } catch (error) {
        console.error(error);
    }
})

//start express
app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`);
});