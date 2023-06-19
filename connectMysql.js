const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database:'testerdb'
})

connection.connect((err) => {
    if(err){
        console.log("error")
    }
    else{
        console.log('successful!')
    }
})

module.exports = connection;
