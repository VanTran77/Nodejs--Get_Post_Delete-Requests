const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const Blog = require('./models/blog');

const dbURI = 'mongodb+srv://nodejsblog2:password@nodejsmongo.a4lyw.mongodb.net/nodejs-cc?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(2022))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');

// allow access file in Public folder
app.use(express.static('public'));

//  submitting a form with post method
app.use(express.urlencoded({extended:true}));

// redirect Homepage to /Blogs
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

// open /about page
app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

//redirect to create page
app.get('/blogs/create', (req,res) => {
    res.render('create', {title: 'create a new blog'});
})

// get data from submit and save input messages to db server
app.post('/blogs', (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body); // get input from submit
    blog.save() // save data to db server
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => console.log(err));
});

// load Blog from server and display to screen
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch((err) => { console.log(err);});
});

// load single blog from db server
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', {blogDetails: result, title:'Blog details'})
        })
        .catch((err) => {console.log(err)});
});

// Delete blog and redirect to /blogs
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirectDel: '/blogs'})
        })
        .catch(err => console.log(err));
});

app.use((req,res) => {
    res.status(404).render('404', {title: '404'});
})




