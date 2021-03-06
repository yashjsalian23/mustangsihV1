let mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");

let mentorSchema = new mongoose.Schema({
    username: String,
    password: String,
    type: String,
    basic: {
        name: String,
        dob: Date,
        gender: String
    },
    contact: {
        telephone: Number,
        linkedin: String,
        email: String,
        skype: String,
        visitingCard: String,
        github: String
    },
    description : {
        short: String,
        bio: String
    },
    experience: {
        company: String,
        position: String
    },
    location:{
        country: String,
        state: String,
        city: String
    },
    domain:String
}); 
    
mentorSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Mentor", mentorSchema);