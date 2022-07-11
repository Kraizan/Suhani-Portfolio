//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const flickr = require("flickr-sdk");
const https = require("https");

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=239b279b0c6485345c8c50dd009a1b12&user_id=195927261%40N05&format=json&nojsoncallback=1"
const imgurl = "https://live.staticflickr.com/";
const images = []
https.get(url, async function(response){
  await response.on("data",function(data){
    // console.log(JSON.parse(data));
    const imgData = JSON.parse(data).photos.photo;
    for(var i=0; i<imgData.length; i++){
      images.push(imgurl + imgData[i].server + "/" + imgData[i].id + "_" + imgData[i].secret + "_b.jpg");
    }
  })
});

app.get("/", function(req,res){
  res.render("home", {images: images});
})

app.get("/designs", function(req,res){
  res.render("designs", {images: images});
})

app.get("/wallpaper/:index", function(req,res){
  var index = req.params.index;
  res.render("image",{images: images, index: index});
})

app.get("/save/:index", function(req,res){
  var index = req.params.index;
  res.redirect(images[index]);
})

app.listen(3000, ()=>{
  console.log("Server up and running at Port 3000...")
})
