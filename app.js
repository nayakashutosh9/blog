require("dotenv").config();
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});

const itemSchema=new mongoose.Schema({
  title:String,
  body:String
});

const Item=mongoose.model("Item",itemSchema);

const defaultItem=new Item({
  title:"Home",
  body:"Welcome to my blog website"
});

app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }
    else{
      if(foundItems.length===0){
        defaultItem.save();
        res.redirect("/");
      }
      else{
        res.render("list",{items:foundItems});
      }
    }
  });
});

app.get("/new",function(req,res){
  res.render("new");
});

app.post("/new",function(req,res){
  const newTitle=_.capitalize(req.body.title);
  const newBody=req.body.body;
  const curItem=new Item({
    title:newTitle,
    body:newBody
  });
  curItem.save();
  res.redirect("/");
});

app.get("/:customName",function(req,res){
  const curTitle=_.capitalize(req.params.customName);
  Item.findOne({title:curTitle},function(err,foundItem){
    if(err){
      console.log(err);
    }
    else{
      if(!foundItem){
        res.redirect("/");
      }
      else{
        res.render("single",{item:foundItem});
      }
    }
  });
});

const port=process.env.PORT || 3000;
app.listen(port,function(){
  console.log("server is running on "+port);
});
