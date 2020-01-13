let express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require ("method-override"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require ("passport-local-mongoose"),
    passport                = require("passport"),
    User                    = require ("./models/user"),
    Mentor                  = require ("./models/mentor");

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost/sih");
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "I",
	resave:false,
	saveUninitialized: false
}));
passport.use(new localStrategy(User.authenticate()));
passport.use(new localStrategy(Mentor.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//  app.use(passport.initialize());
//  app.use(passport.session());

passport.serializeUser(Mentor.serializeUser());
passport.deserializeUser(Mentor.deserializeUser());
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

app.get("/mentee/login", (req, res)=>{
    res.render("./mentee/login.ejs");
});

app.get("/mentee/register", (req,res)=>{
    res.render("./mentee/register.ejs");
});

app.post("/mentee/register", (req,res)=>{
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
			res.redirect("/mentee/register");
		}
		else{
			passport.authenticate("local")(req, res, ()=>{
				res.redirect("/");
			});
		}
	});
});

app.post("/mentee/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect:"/mentor/login"
}) ,(req, res)=>{});

app.get("/mentee/:id", (req,res)=>{
    User.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in user profile");
        }
        res.render("userProfile.ejs", {user:foundUser});
    });
});

app.get("/mentor/login", (req,res)=>{
    res.render("./mentor/login.ejs");
});

app.get("/mentor/register", (req,res)=>{
    res.render("./mentor/register.ejs");
});
app.get("/mentee/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

app.post("/mentor/register", (req,res)=>{
        console.log(req.body.username);
        console.log(req.body.password);
        Mentor.register(new Mentor({username:req.body.username}), req.body.password, function(err, user){
            if(err){
                console.log(err);
                res.redirect("/mentor/register");
            }
            else{
                    passport.authenticate("local")(req, res, function(){
                    res.redirect("/home");
                });
            }
        });
    });

 app.post("/mentor/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect:"/mentor/login"
    }) ,(req, res)=>{});
        

var port = process.env.PORT || 3000;
app.listen(port,  ()=> {
  console.log("Server Has Started!");
});