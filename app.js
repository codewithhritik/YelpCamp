var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	mongoose       = require("mongoose"),
	Campground     = require("./models/campground"),
	methodOverride = require("method-override"),
	Comment        = require("./models/comment"),
	seedDB         = require("./seeds"),
	flash          = require("connect-flash"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	User           = require("./models/user")   

//Requiring Routes
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes       = require("./routes/auth")

//seedDB(); //seed the database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"

mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://hritikbagane:hritik1999@yelpcamp-3qtsa.mongodb.net/test?retryWrites=true&w=majority", { 
// 	useNewUrlParser: true,
// 	useCreateIndex: true
// }).then(() => {
// 	console.log("Connected to DB");
// }).catch(err => {
// 	console.log("ERROR:", err.message);
// });

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I'm the cutest person",
	resave: false,
	saveUninitialized: false
}));
	
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Using Routes
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("YelpCamp Server has Started!!");
});
	