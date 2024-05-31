const express = require('express');
const session= require('express-session')
const bcrypt = require('bcrypt')
const app = express();
const PORT = 3000
const saltRounds = 10

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))


let sessionOptions={
    secret:"ChunckBullDog",
    cookie:{}
}
app.use(session(sessionOptions)) //makes session work
app.get('/', (req, res) => {
    
    // console.log("Register REQUEST",req.session.username);

    res.render('register');
});

app.post('/register', async (req, res) => {
    let url = "http://localhost:4000/register"
    let registeredUser = req.body
    let hashedPassword = ""

    //example of bcrypt
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        hashedPassword = await bcrypt.hash(registeredUser.newPassword2, salt)

    } catch (err){
        console.error(err)
    }

    const answers = [
        { "What is your preferred gaming medium?": registeredUser["What is your preferred gaming medium?"] },
        { "What is your favorite color?": registeredUser["What is your favorite color?"] },
        { "What is your favorite gaming genre?": registeredUser["What is your favorite gaming genre?"] }
    ]

    let userDataToSave = {
        username: registeredUser.newUsername,
        password: hashedPassword,
        email: registeredUser.newEmail,
        age: parseInt(registeredUser.newAge),
        answers: answers,
        userID: 0
    }
    //tests if userDataToSave is correct/functional
    console.log(userDataToSave)
   
    //TODO: make fetch call or whatever to call the api
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToSave),
    })

    });


app.get('/login', (req, res) => {
    // console.log("LOGIN REQUEST",req.session.username);
    res.render('login');
});


app.post('/login', async (req, res) => {
    const loginData = req.body
    console.log("LOGIN POSTED", loginData);
    let url = "http://localhost:4000/login"
    let username = loginData.username
    let password = loginData.password

    const body = {
        username: username
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (response.ok) {
        const data = await response.json();
        let user = await data["results"][0]
        console.log(data)
        const hashedPassword = user.password;


        if (data && bcrypt.compare(password, hashedPassword)) {
            req.session.username = username;
            let model = {
                username: user.username,
                email: user.email,
                age: user.age,
                answers: user.answers,
                userID: user.userID
            }
            res.render("profile", model);
        } else {
            console.log("Invalid login");
            res.render('login');
        }
    }
});
app.get('/profile', (req, res) => {
    
    // console.log("Profile REQUEST",req.session.username);
  if (!req.session.username) {
        return res.redirect('/login');
    }
    let model = {
        username: registeredUser.newUsername,
        password: hashedPassword,
        email: registeredUser.newEmail,
        age: parseInt(registeredUser.newAge),
        answers: answers,
        userID: 0
    }
    res.render('profile',model);
});

app.get('/profile/:userId/edit', (req, res) => {
    res.render('profileEdit');
});

app.post('/profile/:userId/edit', async (req, res) => {
    let registeredUser = req.body
    let hashedPassword = ""



    //example of bcrypt
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        hashedPassword = await bcrypt.hash(registeredUser.newPassword2, salt)

    } catch (err){
        console.error(err)
    }

    const answers = [
        { "What is your preferred gaming medium?": registeredUser["What is your preferred gaming medium?"] },
        { "What is your favorite color?": registeredUser["What is your favorite color?"] },
        { "What is your favorite gaming genre?": registeredUser["What is your favorite gaming genre?"] }
    ]

    let userDataToSave = {
        username: registeredUser.newUsername,
        password: hashedPassword,
        email: registeredUser.newEmail,
        age: parseInt(registeredUser.newAge),
        answers: answers,
        userID: 0
    }


    let url = "http://localhost:4000/updateUser"
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToSave),
    });
    res.render('profileEdit');
});
app.get('/search', (req, res) => {
   
    res.render('search', { searchResults: [], query: '' })
});

app.post("/search",async (req,res)=> {
    const query = req.body.query
    let body = {
        username: query
    }
    let url = 'http://localhost:4000/login'
    const response = await fetch(url,{
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(body)
    })
    const data = await response.json()

    res.json(data)
})

app.get('/logout', (req, res) => {
    console.log("LOGOUT REQUEST");
     req.session.destroy()
    res.redirect('/login');
});

app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`);
})