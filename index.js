const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const db = require('./connectMysql')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const secretKey = '123abc'


app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())
//api login
app.post('/api/login',(req,res) => {
    const {username,password} = req.body;
    console.log({username,password})
    const query = 'select * from users where username = ? and password = ?'

    db.query(query,[username,password],(err,result)=> {
        if(err){
            res.status(500).json({error:"Lỗi thao tác CSDL!",err})
        }
        else if(result.length == 0){
            res.status(401).json({err:"Sai tên tài khoản hoặc mật khẩu!"})
        }
        else{
            const role = result[0].role;
            token = jwt.sign({user:"username",role:role},secretKey)
            res.status(200).json({message:"Đăng nhập thành công!",token})
        }
    })
})

//api create users

app.post('/api/users',(req,res)=> {
    const token = req.headers.authorization;
    console.log(token);
    const user = jwt.verify(token,secretKey,(err,decodedToken)=>{
        if(err){
            res.status(401).json({error:"Bạn chưa đăng nhập!"})
        }
        else{
            const {username,role} = decodedToken;
            console.log(decodedToken)
            if(role != 1){
                res.status(403).json({error:"Bạn không có quyền tạo người dùng mới!"});
            }
            else{
                const {username} = req.body;
                const query = 'select * from users where username = ?'

                db.query(query,[username],(err,result)=>{
                    if(err){
                        res.status(500).json({error:err})
                    }
                    else if(result.length == 1){
                        res.status(409).json({error:"Người dùng đã tồn tại!"});
                        console.log(result.length);
                    }
                    else{
                        const {username,password,email,phone,role} = req.body;
                        console.log(typeof role)
                        const query1 = 'Insert into users values (?,?,?,?,?)';
                        db.query(query1,[username,password,email,phone,role],(err,result)=>{
                            if(err){
                                res.status(500).json({message:"Lỗi thao tác CSDL!",err:err})
                            }
                            else{
                                res.status(200).json({message:"Tạo người dùng thành công!"});
                            }
                        })
                    }
                })
            }
        }
    })
})

//Logout
app.get('/api/logout',(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:"Đăng xuất thành công!"});
})


app.listen(3000,() => {
    console.log("Server is listening in port 3000!")
})