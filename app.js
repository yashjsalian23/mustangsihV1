let express = require("express"),
    app     = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require ("method-override"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require ("passport-local-mongoose"),
    passport = require("passport"),
    User  = require ("./models/user");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/sih");
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "I",
	resave:false,
	saveUninitialized: false
}));
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

app.get("/", (req,res)=>{
    res.render("landing.ejs");
});

app.get("/landing-page", (req, res)=>{
    res.redirect("/");
});

app.get("/home", (req, res)=>{
    res.render("home.ejs");
})

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.get("/register", (req,res)=>{
    res.render("register.ejs");
});

app.post("/register", (req,res)=>{
    console.log(req.body.username);
    console.log(req.body.password);
    let newUser =new User({
        username: req.body.username,
        basic: req.body.basic,
        description: req.body.description,
        domain: req.body.domain,
        location: req.body.location,
        contact: req.body.contact,
        funding: req.body.funding
    });
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			console.log("ERROR");
			res.redirect("/register");
		}
		else{
			passport.authenticate("local")(req, res, ()=>{
				res.redirect("/");
			});
		}
	});
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect:"/login"
}) ,(req, res)=>{});

app.get("/user/:id", (req,res)=>{
    User.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in user profile");
        }
        res.render("userProfile.ejs", {user:foundUser});
    });
});
var port = process.env.PORT || 3000;
app.listen(port,  ()=> {
  console.log("Server Has Started!");
});