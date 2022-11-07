var express=require('express');
const bodyParser=require("body-parser");
var mysql=require("mysql");
const sessions = require('express-session');
var app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    resave: false
}));


var db = mysql.createConnection({
    host: "localhost",
    user: "root", // my username
    password: "", // my password
    database: "mydata"
});
db.connect(function(error)
{
    if(error)
    {
        console.log(error);;
    }
    else
    console.log("my sql connected");
})
app.get("/",function(req,res)
{
    res.sendFile(__dirname + '/signup.html');
})
app.post("/",function(req,res)
{
    console.log(req.body);
    var Lname=req.body.Fname;
    var email=req.body.email;
    var password=req.body.password;

    // db.query('SELECT email from myda WHERE userName=?')
    var sql = `INSERT INTO user (name,email,password) VALUES ( '${Lname}','${email}', '${password}')`;
    db.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }else{
            // using userPage function for creating user page
            res.sendFile(__dirname+"/Sucess.html");
        };
    });

})
app.get("/login",function(req,res)
{
    res.sendFile(__dirname+"/login.html")
})
app.post("/dashboard",  function(req, res){
    var userName = req.body.email;
    var password = req.body.password;

    db.connect(function(err) {
        if(err){
            console.log(err);
        };
//get user data from MySQL database
  db.query(`SELECT * FROM user WHERE email = '${userName}' AND password = '${password}'`, function (err, result) {
          if(err){
            console.log(err);
          };
// creating userPage function to create user page
function userPage(){
  // We create a session for the dashboard (user page) page and save the user data to this session:
  req.session.user = {
      name: result[0].name, // get MySQL row data
      // get MySQL row dataa
      // email: email,
      // password: password
  };

  res.send(`
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
      <style>
         body {
           text-align: center;
           padding: 40px 0;
           background: #EBF0F5;
         }
           h1 {
             color: #88B04B;
             font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
             font-weight: 900;
             font-size: 40px;
             margin-bottom: 10px;
           }
           p {
             color: #404F5E;
             font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
             font-size:20px;
             margin: 0;
           }
         i {
           color: #9ABC66;
           font-size: 100px;
           line-height: 200px;
           margin-left:-15px;
         }
         .card {
           background: white;
           padding: 60px;
           border-radius: 4px;
           box-shadow: 0 2px 3px #C8D0D8;
           display: inline-block;
           margin: 0 auto;
         }
       </style>
    </head>
    <body>
      <nav class="navbar navbar-expand-lg navbar navbar-dark bg-dark">
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
            <a class="nav-item nav-link" href="signup.html">Signup</a>
            <a class="nav-item nav-link" href="login.html">Login</a>
              <a class="nav-item nav-link" href="#">Admin</a>
          </div>
        </div>
      </nav>

      <div class="card">
            <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">

              <i  class="fas fa-user-tie"></i>
            </div>
              <h1>Hi!  ${req.session.user.name}</h1>
              <p>Welcome!<br/> You have successfully logged in. </p>
            </div>

    </body>
  </html>
  `);

}

      if(Object.keys(result).length > 0)
      {
         userPage();
        }
        else{
            // res.sendFile(__dirname + '/failLog.html');
            // res.send(<a href ="/"></a>)
            res.redirect("/");
        }

        });
    });
});
app.get("/admin",function(req,res)
{
   var query ='SELECT * FROM user ORDER BY id DESC';
   db.query(query,function(error,data)
   {
    if(error)
    console.log(error);
    else
    {
        res.render('admi', {title:'Node.js MySQL CRUD Application', action:'list', sampleData:data});
    }
   })
})
app.listen(3000,function()
{
    console.log("port 3000");
})
