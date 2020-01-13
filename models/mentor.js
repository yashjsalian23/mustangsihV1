let mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");

let mentorSchema = new mongoose.Schema({
    username: String,
    password: String
}); 
    
mentorSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Mentor", mentorSchema);