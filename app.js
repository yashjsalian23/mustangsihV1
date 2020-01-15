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

    mongoose.connect('mongodb+srv://mustangs:mongodb@cluster0-bhpzo.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        console.log('Connected to DB!');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
app.use(bodyParser.urlencoded({extended:true}));
// mongoose.connect("mongodb://localhost/sih");
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "I",
	resave:false,
	saveUninitialized: false
}));
passport.use('userLocal', new localStrategy(User.authenticate()));
passport.use('mentorLocal', new localStrategy(Mentor.authenticate()));

passport.serializeUser(User.serializeUser(), Mentor.serializeUser());
passport.deserializeUser(User.deserializeUser(), Mentor.deserializeUser());
 app.use(passport.initialize());
 app.use(passport.session());

// passport.serializeUser(Mentor.serializeUser());
// passport.deserializeUser();
// app.use(passport.initialize());
// app.use(passport.session());

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
			passport.authenticate("userLocal")(req, res, ()=>{
				res.redirect("/");
			});
		}
	});
});

app.post("/mentee/login", passport.authenticate("userLocal", {
	successRedirect: "/",
	failureRedirect:"/mentee/login"
}) ,(req, res)=>{});

app.get("/mentee/:id", (req,res)=>{
    User.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in user profile");
        }
        res.render("userProfile.ejs", {user:foundUser});
    });
});

app.get("/mentee/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

app.get("/mentor/login", (req,res)=>{
    res.render("./mentor/login.ejs");
});

app.get("/mentor/register", (req,res)=>{
    res.render("./mentor/register.ejs");
});


 app.post("/mentor/register", (req,res)=>{
         console.log(req.body.username);
         console.log(req.body.password);
         let newMentor = new Mentor({
            username: req.body.username,
            basic: req.body.basic,
            contact: req.body.contact,
            experience: req.body.experience,
            location: req.body.location,
            domain:req.body.domain,
            description: req.body.description
         });
         Mentor.register(newMentor, req.body.password, function(err, user){
             if(err){
                 console.log(err);
                 res.redirect("/mentor/register");
             }
             else{
                     passport.authenticate("mentorLocal")(req, res, function(){
                     res.redirect("/home");
                 });
             }
         });
     });

  app.post("/mentor/login", passport.authenticate("mentorLocal", {
         successRedirect: "/",
         failureRedirect:"/mentor/login"
     }) ,(req, res)=>{});

app.get("/mentor/:id", (req,res)=>{
    Mentor.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in mentor profile");
        }
        res.render("mentorProfile.ejs", {mentor:foundUser});
    });
})


        

var port = process.env.PORT || 3000;
app.listen(port,  ()=> {
  console.log("Server Has Started!");
});