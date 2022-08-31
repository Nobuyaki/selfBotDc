const express = require('express')
const server = express();

server.all('/', (req, res)=>{
    res.send("SERVER IS READY")
})

function keepAlive(){
    server.listen(3000, ()=>{console.log("SERVER IS READY")});
}
module.exports = keepAlive