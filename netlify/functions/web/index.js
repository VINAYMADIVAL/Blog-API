import express from "express";
import bodyParser from "body-parser";
import path from "path";
import axios from "axios";

const app = express();
const API_URL = "/.netlify/functions/api"; 

// --- Configure EJS views & static assets ---

app.set("view engine", "ejs");
app.set("views",path.join(process.cwd(), "netlify", "functions", "web", "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "netlify", "functions", "web", "public")));
app.use(bodyParser.json());

// --- Routes ---
// Home: list all posts
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
     const { data: posts } = response;  // destructuring 
    res.render("index", { posts });
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Show single post by id
app.get("/api/posts/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    const { data: post } = response;  // destructuring 
    if(response.data == 404) return res.json({message: `Post with ID: ${req.params.id} could not be found :(`}) //error handling pending
    res.render("index", { posts: [post] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// New post form
app.get("/api/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post",post: null });
});

// Edit post form
app.get("/api/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    const { data: post } = response;  // destructuring 
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create new post
app.post("/api/posts", async (req, res) => {
  try {
    await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: "Error creating the post" });
  }
});

// Update a post
app.post("/api/posts/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

export {app};