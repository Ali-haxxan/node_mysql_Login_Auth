const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const app = express()
app.use(express.json())
const path = require('path')
dotenv.config({ path: './.env'});


app.set('view engine', 'hbs');
const db = mysql.createConnection({
    host: process.env.DATABASE_host,
    user: process.env.DATABASE_user,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE
})
const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("MySQL is connected!")
    }
})
const res = require('express/lib/response')
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use('/post',require('./routes/pages'))
app.use('/',require('./routes/pages'))
app.use('/auth',require('./routes/auth'))
app.get('/posts',(req,res)=>{

    res.send('Hello posts')
})
const post=[{

}]
app.post('/loginto',(req,res)=>{

    const username=req.body.username
    const user={name: username}
    const accessToken = jwt.sign(user,process.env.SECERATE_ACCESS_TOKEN)
    res.json({accessToken: accessToken} )
})

app.listen(5000,()=>{
    console.log("this app is rining on http://localhost:5000/")
})