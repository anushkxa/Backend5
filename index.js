const{ faker } =require("@faker-js/faker");
const mysql=require('mysql2');
const express=require("express");
const app=express();
app.port=8080;

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

app.listen("8080",()=>{
  console.log("Port is Listening");
});

