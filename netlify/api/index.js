import express from "express";
import bodyParser from "body-parser";

const app = express();

let lastId = 0;
let posts =[];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/posts",(req, res)=>{
  res.json(posts); 
});
app.get("/posts/:id",(req, res)=>{
  var postId = parseInt(req.params.id);
  var post = posts.find(post=> post.id === postId);
  if(!post){
    return res.status(404);  
  }
  res.json(post);
});
app.post("/posts",(req, res)=>{
  const newPost = {
    id: ++lastId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  }
  posts.push(newPost);
  res.status(201).json(newPost);
});
app.patch("/posts/:id",(req, res)=>{
    var Content = req.body.content;
    var Title = req.body.title;
    var Author = req.body.author;
    var id = parseInt(req.params.id);

    const index = posts.findIndex((post) => post.id === id);
    
    if(Title) posts[index].title = Title;
    if(Content) posts[index].content = Content;
    if(Author) posts[index].author = Author;
    posts[index].date = new Date();
    res.status(201).json(posts[index]);
  });
app.delete("/posts/:id",(req, res)=>{
  var id = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === id);
  posts.splice(index,1);
  res.status(201).json({message: `Ok`});
});

export {app};