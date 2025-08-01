const{ faker } =require("@faker-js/faker");
const mysql=require('mysql2');
const express=require("express");
const app=express();
app.port=8080;

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: '',
});
let getRandomUser=()=>{
    return[
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.number.int(),
    ];
};

// try {
//   connection.query(q, [data] ,(err,res)=>{
//   if(err) throw err;
//   console.table(res);

// });

// } catch(err) {
//   console.log(err);
// }
// connection.end();

app.get("/",(req,res)=>{
  let q="SELECT count(*) from user";
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count=result[0]["count(*)"];
      res.render("home.ejs",{count});
    })
  }catch(err){
    console.log(err);
    res.send("some error is DB");
  }
})

app.get("/user",(req,res)=>{
  let q=`SELECT * FROM USER`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      res.render("showuser.ejs",{result});
    })
  }catch(err){
    console.log(err);
    res.send("some error is DB");
  }
})

app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * from USER WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    })
  }catch(err){
    console.log(err);
    res.send("some error is DB");
  }
})


// app.patch(("/user/:id"),(req,res)=>{
//   let {id}=req.params;
//   let {email:Formemail,username:newUsername}=req.body;
//   let q=`SELECT * from USER WHERE id='${id}'`;
//   try{
//     connection.query(q,(err,result)=>{
//       if(err) throw err;
//       let user=result[0];
//       if(Formemail != user.email){
//         res.send("Incorrect MAIL");
//       }else{
//         let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
//         connection.query(q2,(err, result)=>{
//           if(err) throw err;
//         });
//         res.redirect("/user");
//       }
//     })
//   }
//   catch(err){
//     console.log(err);
//     res.send("some error is DB");
//   }
// });

app.patch("/user/:id",(req,res)=>{
  let {id} =req.params;
  let{email:formemail, username:newUsername}=req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user = result[0];
      if(formemail != user.email){
        res.send("Wrong Password");
      }else{
        let q2=`UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
          if(err) throw err;
          res.redirect("/user");
        });
      }
    })
  }catch(err){
    console.log(err);
    res.send("error is DB");
  }
});

app.listen("8080",()=>{
  console.log("Port is Listening");
});
