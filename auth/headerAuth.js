const express = require("express");
const app = express();

const headerAuth=(req,resp,next)=>{
 let token = req.header('Authorization')

    if(!token)
    {
        resp.send("Header missing")
    }
    
    next();
}

module.exports = {headerAuth:headerAuth}

