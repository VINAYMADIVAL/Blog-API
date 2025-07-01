import serverless from "serverless-http";
import express from "express";
import bodyParser from "body-parser";

const app = express();

let posts =[
  {
    "id": 1,
    "title": "Autumn Leaves Photography",
    "content": "Golden foliage creates stunning natural landscapes during fall seasons.",
    "author": "River",
    "date": "2019-11-08"
  },
  {
    "id": 2,
    "title": "Beginner's Guide to Stargazing",
    "content": "Identifying constellations requires minimal equipment but offers cosmic wonders.",
    "author": "Skye",
    "date": "2022-03-17"
  },
  {
    "id": 3,
    "title": "Urban Gardening Techniques",
    "content": "Small-space container gardening can yield fresh herbs even in apartments.",
    "author": "Brook",
    "date": "2020-06-24"
  }
];

let lastId = posts.length+1;

app.use((req, res, next) => {
  console.log("API request path:", req.path);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/api/posts",(req, res)=>{
   res.json(posts); 
});
app.get("/api/posts/:id",(req, res)=>{
  var postId = parseInt(req.params.id);
  var post = posts.find(post=> post.id === postId);
  if(!post){
    return res.status(404).json({ error: "Not found" }); 
  }
   res.json(post);
});
app.post("/api/posts",(req, res)=>{
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date().toISOString().split('T')[0] //UTC date
  }
  posts.push(newPost);
   res.status(201).json(newPost);
});
app.patch("/api/posts/:id",(req, res)=>{
    var Content = req.body.content;
    var Title = req.body.title;
    var Author = req.body.author;
    var id = parseInt(req.params.id);

    const index = posts.findIndex((post) => post.id === id);
    
    if(Title) posts[index].title = Title;
    if(Content) posts[index].content = Content;
    if(Author) posts[index].author = Author;
    posts[index].date = new Date().toISOString().split('T')[0] //UTC date
    res.status(201).json(posts[index]);
  });
app.delete("/api/posts/:id",(req, res)=>{
  var id = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  posts.splice(index,1);
   res.status(201).json({message: `Ok`});
});

export const handler = serverless(app,);
