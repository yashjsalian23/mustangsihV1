let mongoose=require("mongoose");

let apprenticeSchema = new mongoose.Schema({
    name:String,
    dob: String,
    telephone: Number,
    email: String,
    linkedin: String,
    abstract: String,
    idea: String
});

module.exports=mongoose.model("Apprentice", apprenticeSchema);