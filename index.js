const express=require('express')
const app=express();
const port=3000;
const bodyParser = require('body-parser');

//Import module for swagger documentation
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", require("./src/routes"));



app.listen(port,()=>{
    console.log(`server listening on port ${port} `)
})
