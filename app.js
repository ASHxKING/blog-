require('dotenv').config();
const express = require("express");

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
var posts = [];

////// Database connection 
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/posts");

const postschema = new mongoose.Schema({
  postTitle: String,
  body: String,
});

const POST = new mongoose.model("post", postschema);

const homeStartingContent =`Welcome to our premier destination for staying informed about the latest advancements and trends in the world of technology! Our mission is to provide you with timely insights, expert analysis, and engaging content that will empower you to navigate the rapidly evolving tech landscape with confidence.

Our team of dedicated writers and tech enthusiasts is committed to delivering high-quality, up-to-date information on a wide range of topics, including cutting-edge gadgets, emerging technologies, and industry developments. Whether you're a tech-savvy professional or a curious newcomer, you'll find valuable resources and inspiration to fuel your passion for innovation and discovery.

But we're more than just a source of information—we're a vibrant community of like-minded individuals who share a common interest in exploring the possibilities of technology. Join us in discussions, share your experiences, and connect with fellow enthusiasts from around the globe.

So, whether you're here to stay ahead of the curve, expand your knowledge, or simply indulge your curiosity, our platform is your trusted partner on the journey to technological enlightenment.

Welcome aboard, and let's embark on this exciting adventure together!`

const aboutContent =`Welcome to our tech community! Here, we're passionate about all things technology. Whether you're an avid techie, a curious explorer, or a professional seeking insights, you've found the right place.

Our journey began with a simple idea: to create a space where people could come together to learn, share, and connect over their shared love for innovation. What started as a humble blog has now grown into a thriving community of tech enthusiasts from all walks of life.

What sets us apart is our commitment to providing valuable, insightful content that resonates with our audience. From in-depth product reviews and how-to guides to thought-provoking analysis and industry news, we strive to deliver content that informs, educates, and inspires.

But we're more than just a platform—we're a community. A place where individuals with diverse backgrounds and perspectives come together to engage in meaningful discussions, share their experiences, and support each other on their tech journeys.

So whether you're here to stay up-to-date on the latest tech trends, learn new skills, or connect with fellow enthusiasts, we invite you to join us. Together, let's explore the ever-evolving world of technology and embrace the possibilities it holds for the future.

Welcome to our tech community—where technology meets community.`
const contactContent ="Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/post/:posttitle", function (req, res) {
  POST.find({},function(err,results){
    if (!err){
      results.forEach(function (postcategory) {
        const postcategoryTitle = _.lowerCase(postcategory.postTitle);
        const parameterpostTitle = _.lowerCase(req.params.posttitle);
        if (postcategoryTitle === parameterpostTitle) {
          res.render("post", {
            TitlePost: postcategory.postTitle,
            BodyPost: postcategory.body,
          });
        }
      });
    }
  })
  
});

app.get("/", function (req, res) {

  POST.find({},function(err,result){
    if(!err){
      // console.log(result);
      res.render("home", {
        home: homeStartingContent,
        customPost: result,
      });
    }
  })
  
});
app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  const title = req.body.postTitle;
  const body = req.body.userPost;
  // console.log(title);

  const post = new POST({
    postTitle: title,
    body: body,
  });
  post.save();
  res.redirect("/");

  // var post = {
  //   title: req.body.postTitle,
  //   body: req.body.userPost,
  // };
  posts.push(post);

  
});

app.listen(process.env.PORT, function () {
  console.log("Server started on port 3000");
});
