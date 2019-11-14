const router=require('express').Router();
const connection =require('/Users/kumarswamypatha/Desktop/project/config')
const validation=require('/Users/kumarswamypatha/Desktop/project/validation')
const verify=require('/Users/kumarswamypatha/Desktop/project/routes/privateRoutes')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');
const bodyParser=require('body-parser');

//****************************** CUSTOMER **********************************

router.post('/customer/register',async (req,res)=>{
    const {error}=validation.register(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt)
    var person = {
        name: req.body.name,
        email: req.body.email,
        longitude:req.body.longitude,
        latitude:req.body.latitude,
        password:hashPassword
    };
    
    await connection.query('INSERT INTO customers SET ?', person, function(err, result) {
      if (err) res.status(400).send(err);
      res.send(result);
    });  
})


router.post('/customer/login',async (req,res)=>{
    var email_ID=req.body.email;
    const {error}=validation.login(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
        connection.query('SELECT * FROM customers WHERE email = ?',[email_ID],async function (err, results, fields) {
            if (err||results.length==0)
              res.send("username or password is invalid").status(400);
            else{
                var validPass=await bcrypt.compare(req.body.password,results[0].password)
                if(!validPass)
                res.send("username or password is invalid").status(400);
                //res.send("logged in")
                const token=jwt.sign({email:email_ID},process.env.TOKEN_SECRET);
                res.header('auth_token',token).send(token)
            }
})
});


router.post('/customer/nearby',verify,(req,res)=>{
connection.query('select * FROM ( SELECT  name,3956 * ACOS(COS(RADIANS(32.867073)) * COS(RADIANS(`latitude`)) * COS(RADIANS(-96.769410) - RADIANS(`longitude`)) + SIN(RADIANS(32.867073)) * SIN(RADIANS(`latitude`))) AS `distance`FROM sps WHERE latitude  BETWEEN 32.867073 - (5 / 69)  AND 32.867073 + (5 / 69) AND `longitude`  BETWEEN -96.769410 - (5 / (69 * COS(RADIANS(32.867073))))   AND -96.769410 + (5 / (69* COS(RADIANS(32.867073))))) sps WHERE `distance` < 5;',(err,results)=>{
    res.send(results);
})
})


router.put('/customer/update',verify,(req,res)=>{
    let sql = `UPDATE customers
           SET latitude = ?,longitude =? 
           WHERE email= ?`;
    let data=[req.body['latitude'],req.body['longitude'],req.user.email]
    connection.query(sql,data,function(err,results){
        res.send("done")
    })
})


router.post('/customer/logout',async (req,res)=>{
    jwt.destroy(req.user);
})


//********************************SERVICE PROVIDER************************************


router.post('/sp/login',async (req,res)=>{
    var email_ID=req.body.email;
    const {error}=validation.login(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
        connection.query('SELECT * FROM sps WHERE email = ?',[email_ID],async function (err, results, fields) {
            if (err||results.length==0)
              res.send("username or password is invalid").status(400);
            else{
                var validPass=await bcrypt.compare(req.body.password,results[0].password)
                if(!validPass)
                res.send("username or password is invalid").status(400);
                const token=jwt.sign({email:email_ID},process.env.TOKEN_SECRET);

                res.header('auth_token',token).send(token)
            }
    })
});


router.put('/sp/update',verify,(req,res)=>{
    let sql = `UPDATE customers
           SET latitude = ?,longitude =? 
           WHERE email= ?`;
    let data=[req.body['latitude'],req.body['longitude'],req.user.email]
    connection.query(sql,data,function(err,results){
        res.send("done")
    })
})


router.post('/sp/logout',async (req,res)=>{
    jwt.destroy(req.user);
})


router.post('/admin/login',async (req,res)=>{
    var email_ID=req.body.email;
    const {error}=validation.login(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
        connection.query('SELECT * FROM admin WHERE email = ?',[email_ID],async function (err, results, fields) {
            if (err||results.length==0)
              res.send("username or password is invalid").status(400);
            else{
                var validPass=await bcrypt.compare(req.body.password,results[0].password)
                if(!validPass)
                res.send("username or password is invalid").status(400); 
                const token=jwt.sign({email:email_ID},process.env.TOKEN_SECRET);
                res.header('auth_token',token).send(token)
            }
})
});


//********************************ADMIN***********************************


router.get('/admin/customers',verify,async (req,res)=>{
    await connection.query('select * from customers',(err,results)=>{
        res.send(results);
    })
})


router.get('/admin/sps',verify,async (req,res)=>{
    await connection.query('select * from sps',(err,results)=>{
        res.send(results);
    })
})


router.post('/admin/logout',async (req,res)=>{
    jwt.destroy(req.user);
})


module.exports=router;
