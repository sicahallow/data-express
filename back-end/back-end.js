const express = require("express")
const { DAL } = require("./data-access-layer/mongo-dal")

const PORT = 4000
const app = express()
// const defaultJokeAmount = 10

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

app.get('/users', async (req, res) => {
    let username = "username1"
    let user = await DAL.getUserByUsername(username)
    let questions = await DAL.getAllQuestions()

    // console.log("user: " + JSON.stringify(user[0].answers))
    // console.log("questions: " + JSON.stringify(questions[0].questions))

    let jsonResponse = [
        {
            results: ""
        }
    ]


    let response = {
        results: user
    }
    res.json(response)

})

app.post('/register', async (req, res) => {
    let newUser = {
        username: "username1",
        password: "password1",
        email: "theuser@user.com",
        age: 21,
        answers: {
            "this is question 2": "answer to question 2",
            "this is question 3": "answer to question 3",
            "this is question 6": "answer to question 6"
        }

}
    try {
        if (newJoke.id === 0) {
            let jokes = await DAL.getJokes()
            let response = {
                count: jokes.length,
                results: jokes,
            }
            newJoke.id = (response["count"] + 1)

        }
        await DAL.create(newJoke)
    } catch (error) {
        console.error(error);
    }
})

//start express
app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`);
});