const express=require('express');
const app =express();
const bodyParser=require('body-parser');
const authRoute=require('./routes/auth')
const dotenv=require('dotenv')
dotenv.config();


app.use(express.json());
app.use('/',authRoute);
app.listen(3000,()=>console.log("server connected!"));