let express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require ("method-override"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require ("passport-local-mongoose"),
    passport                = require("passport"),
    expressSanitizer        = require("express-sanitizer"),
    flash                   = require("connect-flash"),
    Mentor                  = require ("./models/mentor"),
    User                    = require ("./models/user"),
    Blog                    = require ("./models/blog"),
    Forum                   = require ("./models/forum"),
    Apprentice              = require ("./models/apprentice");
    Comment                 = require ("./models/comment");

    mongoose.connect("mongodb://localhost/sih");
    // useNewUrlParser: true,
    //     useCreateIndex: true
    // }).then(() => {
    //     console.log('Connected to DB!');
    // }).catch(err => {
    //     console.log('ERROR:', err.message);
    // });
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(require("express-session")({
	secret: "I",
	resave:false,
	saveUninitialized: false
}));
app.use(flash());

passport.use('userLocal', new localStrategy(User.authenticate()));

// app.use(require("express-session")({
// 	secret: "Ia",
// 	resave:false,
// 	saveUninitialized: false
// }));
passport.use('mentorLocal', new localStrategy(Mentor.authenticate()));

passport.serializeUser(User.serializeUser(), Mentor.serializeUser());
passport.deserializeUser(User.deserializeUser(), Mentor.deserializeUser());
 app.use(passport.initialize());
 app.use(passport.session());

app.use(expressSanitizer());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    // console.log(req.user);
    next();
 });
//  app.use(function(req, res, next){
//     res.locals.currentUser = req.mentor;
//     next();
//  });

app.get("/", (req,res)=>{
    res.render("landing.ejs");
});

app.get("/landing-page", (req, res)=>{
    res.redirect("/");
});

app.get("/home", (req, res)=>{
    res.render("home.ejs");
});

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.get("/register", (req, res)=>{
    res.render("register.ejs");
});

app.get("/mentee/login", (req, res)=>{
    res.render("./mentee/login.ejs");
});

app.get("/mentee/register", (req,res)=>{
    res.render("./mentee/register.ejs");
});

app.get("/feature/getMentor", (req, res)=>{
    res.render("getMentor.ejs");
})

app.post("/mentee/register", (req,res)=>{
    console.log(req.body.username);
    console.log(req.body.password);
    let newUser =new User({
        username: req.body.username,
        basic: req.body.basic,
        type: "mentee",
        description: req.body.description,
        domain: req.body.domain,
        location: req.body.location,
        contact: req.body.contact,
        funding: req.body.funding
    });
	User.register(newUser, req.body.password, (err)=>{
		if(err){
			console.log("ERROR");
			res.redirect("/mentee/register");
		}
		else{
			passport.authenticate("userLocal")(req, res, ()=>{
				res.redirect("/home");
			});
		}
	});
});

app.post("/mentee/login", passport.authenticate("userLocal", {
	successRedirect: "/home",
	failureRedirect:"/mentee/login"
}) ,(req, res)=>{});

app.get("/mentee/profile/:id", (req,res)=>{
    User.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in user profile");
        }
        res.render("userProfile.ejs", {user:foundUser});
    });
});

app.get("/mentee/profile/edit/:id", (req,res)=>{
    User.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in edit mentee");
        }
        else{
            res.render("./mentee/edit.ejs", {user:foundUser});
        }
    })
});

app.put("/mentee/profile/edit/:id", (req, res)=>{
     req.body.body = req.sanitize(req.body.body);
     req.body.abstract = req.sanitize(req.body.abstract);
   User.findByIdAndUpdate(req.params.id, req.body, (err, updatedBlog)=>{
      if(err){
          res.redirect("/mentee/profile/edit/"+req.params.id);
      }  else {
          res.redirect("/home");
      }
   });
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
            description: req.body.description,
            type: "mentor"
         });
         Mentor.register(newMentor, req.body.password, (err, user)=>{
             if(err){
                 console.log(err);
                 res.redirect("/mentor/register");
             }
             else{
                     passport.authenticate("mentorLocal")(req, res, ()=>{
                     res.redirect("/home");
                 });
             }
         });
     });

  app.post("/mentor/login", passport.authenticate("mentorLocal", {
         successRedirect: "/home",
         failureRedirect:"/mentor/login"
     }) ,(req, res)=>{});

app.get("/mentor/profile/:id", (req,res)=>{
    Mentor.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in mentor profile");
        }
        res.render("mentorProfile.ejs", {mentor:foundUser});
    });
});

app.get("/mentor/profile/edit/:id", isLoggedIn, (req,res)=>{
    Mentor.findById(req.params.id, (err, foundUser)=>{
        if(err){
            console.log("error in edit mentee");
        }
        else{
            res.render("./mentor/edit.ejs", {mentor:foundUser});
        }
    });
});

app.put("/mentor/profile/edit/:id", isLoggedIn, (req, res)=>{
    // req.body.blog.body = req.sanitize(req.body.blog.body);
   Mentor.findByIdAndUpdate(req.params.id, req.body, (err, updatedBlog)=>{
      if(err){
          res.redirect("/mentor/profile/edit/"+req.params.id);
      }  else {
          res.redirect("/home");
      }
   });
});

app.get("/feature/blog/home", (req, res)=>{
    Blog.find({}, function(err, blogs){
		if(err)
			console.log("ERROR!!");
		else{
			res.render("./blog/home.ejs", {blogs:blogs});
		}
	});
    
});

app.get("/feature/blog/new", isLoggedIn,(req, res)=>{
    res.render("./blog/new.ejs");
});

app.post("/feature/blog/new", isLoggedIn, (req, res)=>{
    Blog.create(req.body, (err, newData)=>{
		if(err)
			console.log("ERROR");
		else{
            // Blog.author.id = req.user._id;
            // Blog.author.username = req.user._id;
            // newData.author = {
            //     id: req.user._id,
            //     username: req.user.username
            // }
            // newData.push(newData.author);
			res.redirect("/feature/blog/home");
		}
	});
});

app.get("/feature/blog/show/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            console.log("error in show blog");
        }
        else{
            res.render("./blog/show.ejs", {blog:foundBlog});
        }
    })
});

app.get("/feature/blog/edit/:id", isLoggedIn, (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("./blog/edit.ejs",{blog:foundBlog} );
        }
    })
});

app.put("/feature/blog/edit/:id", isLoggedIn, (req, res)=>{
    // req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body, (err, updatedBlog)=>{
      if(err){
          res.redirect("/feature/blog/edit/"+req.params.id);
      }  else {
          res.redirect("/feature/blog/home");
      }
   });
});

app.delete("/feature/blog/delete/:id", isLoggedIn, (req, res)=>{
	Blog.findByIdAndRemove(req.params.id, (err)=>{
		if(err)
			res.redirect("/feature/blog/home");
		else
			res.redirect("/feature/blog/home");
			
	});
});

app.get("/profile/logout", (req, res)=>{
    req.logout();
    res.redirect("/home");
});

app.get("/feature/forum/home", (req, res)=>{
    Forum.find({}, (err, foundData)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("./forum/home.ejs", {forums:foundData});
        }
    })

});

app.get("/feature/forum/new", isLoggedIn, (req, res)=>{
    res.render("./forum/new.ejs");
});

app.post("/feature/forum/new", (req, res)=>{
    let forumThread = {
        title: req.body.title,
        body: req.body.body,
        author: {
            id: req.user._id,
            username: req.user.username
        },
        domain: req.body.domain
    };
    Forum.create(forumThread, function(err, newThread){
		if(err)
			console.log("ERROR");
		else{
            // Blog.author.id = req.user._id;
			res.redirect("/feature/forum/home");
		}
	});
});

app.get("/feature/forum/show/:id", isLoggedIn, (req,res)=>{
    Forum.findById(req.params.id).populate("comments").exec(function(err, foundForum){
        if(err){
            console.log(err);
        }
        else{
            
            res.render("./forum/show.ejs", {forum: foundForum});
        }
    });
});

app.delete("/feature/forum/delete/:id", isLoggedIn, (req, res)=>{
	Forum.findByIdAndRemove(req.params.id, (err)=>{
		if(err)
			res.redirect("back");
		else
			res.redirect("/feature/forum/home");
			
	});
});

app.get("/feature/forum/show/:id/comment/new", isLoggedIn, (req, res)=>{
    Forum.findById(req.params.id, (err, foundData)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("./forum/newComment.ejs", {forum: foundData});
        }
    })
});

app.post("/feature/forum/show/:id/comment/new", isLoggedIn, (req, res)=>{
    Forum.findById(req.params.id, function(err, forum){
        if(err){
            console.log(err);
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                console.log(req.user.username);
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                forum.comments.push(comment);
                forum.save();
                res.redirect('/feature/forum/show/' + forum._id);
            }
         });
        }
    });
});

app.get("/feature/forum/show/:fid/comment/:id/edit", isLoggedIn, (req,res)=>{
    Comment.findById(req.params.id, (err, foundComment)=>{
        if(err){
            res.redirect("back");
        } else {
          res.render("./forum/editComment.ejs", {forumId: req.params.fid, comment: foundComment});
        }
     });
})

app.put("/feature/forum/show/:fid/comment/:id/edit", isLoggedIn, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, updatedComment){
       if(err){
        //    res.redirect("/feature/forum/show/"+req.params.fid);
        console.log(err);
       } else {
           res.redirect("/feature/forum/show/" + req.params.fid );
       }
    });
 });

 app.delete("/feature/forum/show/:fid/comment/delete/:id", isLoggedIn, (req, res)=>{
	Comment.findByIdAndRemove(req.params.id, (err)=>{
		if(err)
			res.redirect("back");
		else
			res.redirect("/feature/forum/show/"+req.params.fid);
			
	});
});

app.get("/feature/apprentice/idea", (req, res)=>{
    res.render("ideaForm.ejs");
});

app.post("/feature/apprentice/idea", (req, res)=>{
    Apprentice.create(req.body, (err, newData)=>{
		if(err)
			console.log("ERROR");
		else{
			res.redirect("/home");
		}
	});
});

app.get("/feature/analysis", (req, res)=>{
    res.render("analysis.ejs");
})


 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/mentee/login");
 };

var port = process.env.PORT || 3000;
app.listen(port,  ()=> {
  console.log("Server Has Started!");
});