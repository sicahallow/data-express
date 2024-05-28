const express = require('express');
const session= require('express-session')
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded());

// let sessionOptions={
//     secret:"ChunckBullDog",
//     cookie:{}
// }
// app.use(session(sessionOptions)) //makes session work
app.get('/register', (req, res) => {
    
    // console.log("Register REQUEST",req.session.username);

    res.render('register');
});


app.get('/login', (req, res) => {
    // console.log("LOGIN REQUEST",req.session.username);
    
    // let model = {
    //     username: '',
    //     password: ''
    // }

    res.render('login');
});


app.post('/login', (req, res) => {
    // console.log("LOGIN POSTED", req.body);
    // let username = req.body.username
    // let password = req.body.password

    // if ((username == "test"&& password == "test")||(username == "sue" && password == "sue")){
    //     console.log("Login successful")
    //     req.session.username = username;
    //     res.redirect("/profile")
    // }else{
    //     console.log("Invalid login")
    res.render('login');
// }
});
app.get('/profile', (req, res) => {
    
    // console.log("Profile REQUEST",req.session.username);
    // let model = {
    //     username: req.session.username
    
    // }

    res.render('profile');
});

app.get('/logout', (req, res) => {
    console.log("LOGOUT REQUEST");

    res.redirect('/');
});

app.listen(PORT, (req, res) => {
    console.log(`Express listening on http://localhost:${PORT}`);
});