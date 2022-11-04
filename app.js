const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Admin:%40Adambo75@cluster0.iisata1.mongodb.net/bookDb");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    category: String,
    description: String
});

const Book = mongoose.model("book", bookSchema);

app.get("/", (req,res) => {
    res.render("index");
});
app.get("/bookstore", (req,res) =>{
    
    Book.find({}, (err, results) => {
        if(!err){
            if(!res){
                console.log("No Item");
            }else{
                res.render("bookstore", {bookItems: results});
            }
        }
    })
});
app.get("/addnew", (req, res) => {
    res.render("add");
});

app.post("/addnew", (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const category = req.body.category;
    const description = req.body.description;

    const book = new Book({
        title: title,
        author: author,
        category: category,
        description: description
    });
    
    book.save();
    res.redirect("/bookstore");
});
app.post("/search", (req, res) => {
    const searchItem = req.body.search;
    Book.findOne({title: searchItem}, (err, results) => {
        if(!err){
            if(!results){
                res.render("failure");
            }else{
                res.render("search", {bookItems: results});
            }
        }
    });
});
// app.post("/delete", (req, res) => {
//     const bookId = req.body.delete;

//     Book.findByIdAndDelete(bookId, err => {
//         if(!err){
//             console.log("succesfully deleted the book");
//             res.redirect("/bookstore");
//         }
//     });
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
    console.log("App started succesfully");
})