let mongoose=require("mongoose");

let forumSchema = new mongoose.Schema({
    title: String,
    domain :String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    body: String,
    comments : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]

});

module.exports=mongoose.model("Forum", forumSchema);