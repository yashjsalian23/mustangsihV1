let mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");

let mentorSchema = new mongoose.Schema({
    username: String,
    password: String,
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
        visitingCard: String
    },
    experience: {
        type: String,
        company: String,
        position: String,
    },
    location:{
        state: String,
        city: String,
        country: String
    },
    domain:String
}); 
    
mentorSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Mentor", mentorSchema);