var mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

var userSchema= new mongoose.Schema({
	username:String,
    password:String,
    basic: {
        companyName: String,
        ceoName: String,
        totalNumberOfEmployees: Number,
        foundingDate: Date,
        logo: String
    },
    description : {
        short: String,
        bio: String
    },
    domain:String,
    location: {
        city: String,
        state: String,
        country: String
    },
    contact: {
        email: String,
        website: String,
        telephone: Number,
        linkedin: String,
        github: String
    },
    funding: {
        totalRaised: Number,
        totalRounds: Number,
        latestRound: String
    }
    
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User", userSchema);