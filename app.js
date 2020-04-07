var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/yelp_camp", { 'useNewUrlParser': true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// {
// 			name: "Matjiesvlei Guest Farm",
// 			image: "http://www.nature-reserve.co.za/images/camping-spots-590.jpg",
// 			description: "This is a nice camping area, no bathrooms, no water. Beautiful area!"
// 		}, function(err, campground){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				console.log("NEWLY CREATED CAMPGROUND");
// 				console.log(campground);
// 			}
// 		});



app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
	
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("index", {campgrounds: allcampgrounds});
		}
	})
	
});

//CREATE- add new campgrounds
app.post("/campgrounds", function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {
		name: name, image: image, description: desc
	};
	
	//Create a new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgroundspage
			res.redirect("/campgrounds");
		}
	});
	

});

//NEW- show form for new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//SHOW- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show template
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
	console.log("YelpCamp Server");
});