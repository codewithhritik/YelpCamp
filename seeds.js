var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{name: "Kasaipuram",
	 image: "https://images.unsplash.com/photo-1531881503977-91282087e0c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&						auto=format&fit=crop&w=1350&q=80",
	 description: "Beautiful Campsite"
	},
	{name: "Hathabrul Campsite",
	 image: "https://images.unsplash.com/photo-1510277861473-16b27b39c47a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&						auto=format&fit=crop&w=500&q=60",
	 description: "Blahblahblah"
	},
	{name: "Hi-Techpoint Campsite",
	 image: "https://images.unsplash.com/photo-1541363452546-84aa064f4806?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&						auto=format&fit=crop&w=500&q=60",
	 description: "Beautiful Campsite"
	}
]

function seedDB(){
		//Remove all Campgrounds
		Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed Campgrounds!");
		//add a few Campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if(err){
					console.log(err);
				} else{
					console.log("Added a Campground!");
					//Create Comment
					Comment.create(
						{
							text: "This place is great, But I wish there was internet!",
							author: "Hritik"
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created New Comment!")
							}
						});
				}
			});
		});
	});
	
	//add a few Comments
}

module.exports = seedDB;
