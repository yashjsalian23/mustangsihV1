let mongoose=require("mongoose");

let blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
    created: { type: Date, default:Date.now},
    abstract: String,
    domain: String,
    author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor"
		},
		username:String
	}
});

module.exports=mongoose.model("Blog", blogSchema);