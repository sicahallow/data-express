const express = require('express');
const session= require('express-session')
const bcrypt = require('bcrypt')
const app = express();
const PORT = 3000;
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
app.get('/register', (req, res) => {
    
    // console.log("Register REQUEST",req.session.username);

    res.render('register');
});

app.post('/register', async (req, res) => {
    const fetch = (await import('node-fetch')).default
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
        age: registeredUser.newAge,
        answers: answers
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
    console.log("LOGIN POSTED", req.body);
    let url = "http://localhost:4000"
    let username = req.body.username
    let password = req.body.password

const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
});
if (response.ok) {
    const user = await response.json();
    const hashedPassword = user.password;

    if (bcrypt.compareSync(password, hashedPassword)) {
        req.session.username = username;
        res.redirect("/profile");
    } else {
        console.log("Invalid login");
        res.render('login');
    }}
});
app.get('/profile', (req, res) => {
    
    // console.log("Profile REQUEST",req.session.username);
  if (!req.session.username) {
        return res.redirect('/login');
    }
   
    res.render('profile');
});

app.get('/logout', (req, res) => {
    console.log("LOGOUT REQUEST");

    res.redirect('/');
});

app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`);
})