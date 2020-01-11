let express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    methodOverride = require ("method-override");

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.get("/", (req,res)=>{
    res.render("landing.ejs");
});

app.get("/landing-page", (req, res)=>{
    res.redirect("/");
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});