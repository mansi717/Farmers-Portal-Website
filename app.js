//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/fertiliserDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const fertiliserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"please add name"]

  },
  crop: String
});

const Fertiliser = mongoose.model("Fertiliser", fertiliserSchema);

const fertiliser = new Fertiliser({
  name: "  Potassium Sulphate",
  crop: "Millet"
});

fertiliser.save();

const homeStartingContent = "Welcome to our Farmers' help portal!! In this portal, a farmer will be able to get all relevant information on specific type of crop around his village/block /district or state. The information related to the best fertlizer for his crop specified will be delivered to the user. The farmers will be able to shoot any problems faced by them or compose any artical related to their crop on the blog page. Farmers will also be able to ask specific queries as well as give valuable feedback through the Feedback module specially developed for the purpose.";
const aboutContent = "'Agriculture is the backbone of the Indian Economy'- said Mahatma Gandhi six decades ago. Even today, the situation is still the same, with almost the entire economy being sustained by agriculture, which is the mainstay of the villages. It contributes 16% of the overall GDP and accounts for employment of approximately 52% of the Indian population. Rapid growth in agriculture is essential not only for self-reliance but also to earn valuable foreign exchange. Indian farmers are second to none in production and productivity despite of the fact that millions are marginal and small farmers. They adopt improved agriculture technology as efficiently as farmers in developed countries. It is felt that with provision of timely and adequate inputs such as fertilizers, seeds, pesticides and by making available affordable agricultural credit /crop insurance, Indian farmers are going to ensure food and nutritional security to the Nation.";
const contactContent = "Contact Us";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts=[];
var crop="";
var ans="";

app.get("/",function(req,res){
  res.render("home",{
    startingContent:homeStartingContent,
  });
});

app.get("/blogs", function(req,res){
  res.render("blogs",{
    posts: posts
  });
});

app.get("/about",function(req,res){
  res.render("about",{
    aboutContent:aboutContent
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
    contactContent:contactContent
  });
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
    const post = {
      title: req.body.postTitle,
      content : req.body.postBody
    };

    posts.push(post);

    res.redirect("/blogs");
});


app.get("/predictor",function(req,res){
  res.render("predictor");

});


app.post("/predictor",function(req,res){
    crop = req.body.cropName;
      res.redirect("/answer");
});


app.get("/answer",function(req,res){


  Fertiliser.find(function(err, fertilisers) {
    if (err) {
      console.log(err);
    } else {
    mongoose.connection.close();
      fertilisers.forEach(function(fertiliser) {
        if(crop==fertiliser.crop){
            ans=fertiliser.name;
            res.render("answer",{
              ans:ans
            });
        }
      });
    }
  });

});

app.get("/posts/:postName", function(req,res){
  const requestedTitle = _.lowerCase(req.params.postName);
posts.forEach(function(post){
  const storedTitle = _.lowerCase(post.title);
  if(storedTitle===requestedTitle){
    res.render("post",{
      title: post.title,
      content : post.content
    });
  }
});

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
