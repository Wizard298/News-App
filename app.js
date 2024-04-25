const express = require('express')
const path = require('path');
// const bodyParser = require('body-parser');
const { default: axios } = require('axios');
// Connection to mongodb
require('./mongodb');
const loginList = require('./mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))

// Styling is working because of this line of code
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    // res.sendFile(__dirname + '/' + 'news.html');
    res.sendFile('news.html', { root: path.join(__dirname, 'public') });
})

app.get('/signup', (req, res)=>{
    res.sendFile('signup.html', { root: path.join(__dirname, 'public') });
})

app.get('/login', (req, res)=>{
    res.sendFile('login.html', { root: path.join(__dirname, 'public') });
})

app.post('/signup', async (req, res)=>{
    // const data = {
    //     name: req.body.username,
    //     email: req.body.email,
    //     password: req.body.password,
    // }
    const { username, email, password } = req.body;
    
    const newUser = await loginList.create({ name: username, email, password });
    console.log('New user registered:', newUser);
    // const userData = await loginList.insertMany([data]);
    // console.log(userData);

    res.redirect('/login');
})

app.post('/login', async (req, res)=>{
    const check = await loginList.findOne({email: req.body.email})
    if(!check){
        res.send("Username or password is incorrect");
    }
    else{
        const checkPassword = await loginList.findOne({password: req.body.password})
        if(checkPassword){
            // res.send("password is correct");
            res.redirect('/?q=all&pageno=1');
        }
        else{
            res.send("Password is incorrect");
        }
    }
})

// let api = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=9e85be7579134a338446ee5db78c2f6f`

app.get(`/api`, async (req, res)=>{
    console.log(req._parsedUrl.query);
    // let key = `9e85be7579134a338446ee5db78c2f6f`;
    // let url = `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${key}`;
    let url = `https://newsapi.org/v2/everything?` + req._parsedUrl.query;
    let link = await axios(url);
    let a = link.data;
    res.json(a);
})

app.get('/news', (req, res)=>{
    res.send("Using /news we reached news app Application");
})

const port = process.env.PORT || 2400;
app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}/?q=all&pageno=1`);
})