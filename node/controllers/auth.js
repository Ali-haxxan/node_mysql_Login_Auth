const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {check} = require('express-validator')

const db = mysql.createConnection({
    host: process.env.DATABASE_host,
    user: process.env.DATABASE_user,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE
})

exports.register = (req,res)=>{
   
    const {name,email,password,passwordConfirm} = req.body
    let sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql,[email], async (error,results)=>{
        if(error){
            console.log(error)
        }
        else{
            if(results.length > 0){
                return res.render('register',{
                    message: 'Sorry, Email already taken!'
                });
            }
            
            if(password !== passwordConfirm){
                    return res.render('register',{
                        message: 'Password does not match!'
                    });
                }
                else{
                    let hashpassword = await bcrypt.hash(password, 8)
                    console.log(hashpassword)
                    db.query('INSERT INTO users SET ?', {name: name ,email: email, password: hashpassword},(error,results)=>{
                        if(error){
                            console.log(error)
                        }
                        else{
                            console.log(results)
                            res.render('register',{
                                message: 'User Created Successfully'
                            })
                        }
                    })
                }
        }
        
    })
}

exports.login = (req,res)=>{
   
    const {email,password} = req.body
    let sql1 = 'SELECT * FROM users WHERE email = ?';
    db.query(sql1,[email], async (error,results)=>{
        if(error){
            console.log(error)
        }
        else{
            // console.log(results)
            if(results.length < 1){
                return res.render('login',{
                    message: 'Email not Registered!'
                });
            }
            let sql2 = 'SELECT password FROM users WHERE email = ?';
            db.query(sql2,[email], (error,results)=>{
                if(error){
                    console.log(error)
                } 
                    // console.log(results[0]["password"])
                    var password_hash=results[0]["password"];
                    const verified = bcrypt.compareSync(req.body.password, password_hash);
                // console.log(hashpassword)
            if(verified){
                res.send('You are Login!')
                }
                else{
                    return res.render('login',{
                        message: 'Wrong Password!'
                    });
                    
                }
            })
            
        }
    })
}


