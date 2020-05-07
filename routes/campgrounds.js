var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req,res) {
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});	
});

//CREATE ROUTE - ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function(req,res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author}
	//Create a new Campground and save it to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds");
		}
	});
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res) {
	res.render("campgrounds/new");
});

//SHOWS MORE INFO ABOUT A CAMPGROUND
router.get("/:id", function(req,res) {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			console.log(foundCampground);
			res.render("campgrounds/show.ejs", {campground:foundCampground});
		}
	});
});

//Edit campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit",{campground: foundCampground});
	});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			//redirect somewhere
			res.redirect("/campgrounds/" + updatedCampground._id);
		}
	});	
});

//Destroy Campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;