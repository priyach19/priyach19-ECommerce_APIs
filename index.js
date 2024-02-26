const express=require('express')
const app=express();
const port=3000;
const bodyParser = require('body-parser');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.use("/", require("./src/routes"));



app.listen(port,()=>{
    console.log(`server listening on port ${port} `)
})
