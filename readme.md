# Blog API & Web Frontend (Netlify Serverless)

A fully serverless Blog application using Express.js, EJS, and Netlify Functions. It consists of two Lambda-backed functions:

- ✨ **API Function** (`api.mjs`): Handles JSON-based CRUD for blog posts.
- 🎨 **Web Function** (`web.mjs`): Renders EJS templates for user-facing pages and communicates with the API via HTTP.

Check-out my Blog web app [here](https://dayblogs.netlify.app/).
---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup & Development](#local-setup--development)
4. [Project Structure](#project-structure)
5. [Netlify Configuration](#netlify-configuration)
6. [API Documentation](#api-documentation)
7. [Future Improvements](#future-improvements)
8. [Troubleshooting & Tips](#troubleshooting--tips)

---

## Project Overview

This project splits a classic CRUD blog into two serverless functions on Netlify:

- 🔌 **API**: Exposes REST endpoints under `/api/*` to create, read, update, and delete posts in memory.
- 🖥️ **Web**: Serves dynamic EJS pages (home, new, edit) and calls the API at runtime.

Benefits:

- 🚀 **Zero server maintenance**: Netlify Lambda auto-scales.
- 📦 **Clear separation** of concerns between data API and presentation.
- 🔁 **Rapid local iteration** with `netlify dev`.

---

## Prerequisites

- 🟢 **Node.js** v14 or newer
- 📦 **npm** (bundled with Node)
- 🧰 **Netlify CLI** (`npm install -g netlify-cli`)

---

## Local Setup & Development

1. 🔄 **Clone the repository**:

   ```bash
   git clone https://github.com/VINAYMADIVAL/Blog-API.git
   cd Blog-API
   ```

2. 📥 **Install dependencies**:

   ```bash
   npm install
   ```

3. 🧪 **Run locally**:

   ```bash
   netlify dev
   ```

   - 🌐 **Web UI**: [http://localhost:8888/](http://localhost:8888/)
   - 📡 **Raw API**: [http://localhost:8888/api/posts](http://localhost:8888/api/posts)

4. 🛠️ **Develop**:

   - ✍️ Edit `netlify/functions/api.mjs` for API logic.
   - 🎨 Edit `netlify/functions/web.mjs` for UI & routes.
   - 🖋️ Modify EJS templates in `netlify/functions/web/views/`.

5. 🚢 **Deploy**:

   - 🔃 Commit & push to your Git provider.
   - 🚀 Netlify will auto-build and deploy from `main` branch.

---

## Project Structure

```
/ (repo root)
├─ netlify.toml             # 📁 Netlify settings & redirects
├─ package.json             # 📜 dependencies & scripts
└─ netlify/
   └─ functions/
      ├─ api.mjs            # 🔌 Express API + serverless wrapper
      ├─ web.mjs            # 🎨 Express/EJS UI + serverless wrapper
      ├─ views/             # 📄 EJS templates for web.mjs
      │   ├─ index.ejs
      │   └─ modify.ejs
      └─ public/            # 🌐 static assets for web.mjs
          └─ styles/
              └─ main.css
```

---

## Netlify Configuration

**netlify.toml**:

```toml
[build]
  functions = "netlify/functions"
  command   = "echo 'nothing to build'"

[functions]
  external_node_modules = [
    "express",
    "ejs",
    "axios",
    "body-parser",
    "serverless-http"
  ]

[functions."web"]
  included_files = [
    "netlify/functions/views/**",
    "netlify/functions/public/**"
  ]
  
[[redirects]]
  # API calls go to the API function
  from = "/api/*"
  to   = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  # Everything else goes to your web server function
  from = "/*"
  to   = "/.netlify/functions/web"
  status = 200

```

- 🛣️ `/api/*` → `api.mjs`, passes only the `:splat` suffix (`/posts`, `/posts/1`).
- 🖥️ All other routes → `web.mjs`, with `req.path` reflecting the original path (e.g. `/new`).
#### If you face `Error fetching posts: Cannot find module 'ejs'` then you can use the solution below otherwise netlify will handle everything
- `external_node_modules` tells Netlify: “Don’t try to bundle these just include them from node_modules in the function ZIP.”

#### If you face `Error: Failed to lookup view "index" in views directory "/var/task/netlify/functions/views" at Function.render` then you can use the solution below otherwise netlify will handle everything
- `included_files` This ensures that Netlify bundles your EJS templates and static assets with your web function during deploy.
---
## API Documentation

Base URL (local): `http://localhost:8888/api`

| Method    | Route            | Body (JSON)                             | Response                                      |
| --------- | ---------------- | --------------------------------------- | --------------------------------------------- |
| 🔍 GET    | `/api/posts`     | —                                       | `[{ id, title, content, author, date }, ...]` |
| 🔍 GET    | `/api/posts/:id` | —                                       | Single post object or 404 error               |
| ✏️ POST   | `/api/posts`     | `{ title, content, author }`            | Created post object (201)                     |
| 🛠️ PATCH | `/api/posts/:id` | Partial `{ title?, content?, author? }` | Updated post object (201)                     |
| ❌ DELETE  | `/api/posts/:id` | —                                       | `{ message: 'Ok' }` (201)                     |

Example:

```bash
curl http://localhost:8888/api/posts
```

---

## Future Improvements

- 🕒 **Sort posts by date**: Allow newest-first listing and query parameters.
- 💾 **Persist data**: Integrate a database (e.g. Fauna, MongoDB Atlas).
- 🔍 **Single post view**: Add a dedicated `/view/:id` page to render one post.
- 🔐 **User auth**: Protect create/update/delete actions behind login.
- 📄 **Pagination**: Load posts in pages for large datasets.

---

## Troubleshooting & Tips 

- ⚠️ **404 on API**: Ensure your `api.mjs` is defined correctly and that your redirect rule uses `:splat` so Express sees clean paths.
- 🔀 **Unexpected ****\`\`**** prefix**: Remember `:splat` alone doesn’t strip the `/api` prefix in Netlify Dev—you must either use `stripBasePath: true` or write routes as `/api/posts` (or use middleware to remove it).
- 📋 **Empty form submission**: Make sure every `<input>` and `<textarea>` includes a `name` attribute (e.g. `name="content"` for textareas) so Express can read `req.body`.
- 🌐 **Incorrect internal API calls**: When your **web** function makes requests to your **API**, call `/api/posts` (public route), not `/.netlify/functions/api/posts`. Use host logic with `process.env.NETLIFY_DEV` to build the correct base URL.
- 🔄 **Stale Netlify Dev cache**: If changes aren’t reflecting, restart with `netlify dev --clear` to purge cached functions.
- 🗂️ **Function naming collisions**: Only one file per function name (e.g. `api.mjs`) in `netlify/functions`—avoid subdirectories or duplicate wrappers, or Netlify may register multiple functions and error.
- 📜 **Deprecated warnings**: Ignore `util._extend` deprecation from Netlify CLI unless it breaks; it’s a downstream warning from `lambda-local`.
- 🔍 **Logging paths**: Use middleware (`console.log(req.path)`) inside `api.mjs` to verify what path Express is seeing and debug routing mismatches.

---


## Notice 📌
### didn't find answers for  your questions ❓well it might be here.
#### #1. Why does `/new` just work, but `/api/posts` requires us to manually prefix routes with `/api` inside `api.mjs`

When you visit `/new`, it’s correctly handled by the `web` function thanks to the redirect rule:  
```toml
from = "/*"
to   = "/.netlify/functions/web"
```
The Promise of `:splat`
When we write this in netlify.toml:
```bash
   [[redirects]]
   from = "/api/*"
   to   = "/.netlify/functions/api/:splat"
   status = 200
```
However, when you send a request to /api/posts, even though you have this rule:

```toml
from = "/api/*"
to   = "/.netlify/functions/api/:splat"
```
…the request that reaches `api.mjs` still includes the `/api` prefix (`/api/posts`) instead of `/posts`, so you have to define routes like `app.get("/api/posts")` instead of `app.get("/posts")`.

Why does this happen? Why isn’t the `/api` prefix stripped like it is for `/new`?

Here's what should happen is:
- Browser requests `/api/posts`
- Netlify captures `posts` as `:splat`
- Rewrites to: `/.netlify/functions/api/posts`
- Your Lambda (`api.mjs`) receives:
      - `req.path === "/posts"`
      - NOT `/api/posts`

✅ This is what the docs say should happen
❌ But in reality, this does not happen in Netlify Dev the way you'd expect

When running locally with `netlify dev`, what actually happens is:
- You request `/api/posts`
- Netlify Dev does rewrite to `/.netlify/functions/api/posts`
- BUT the Express `req.path` is still seen as `/api/posts`, not `/posts`

Even though your function was mounted at /api, it still sees the full original path — prefix and all.
So, despite using :splat, your Express app still sees:
```bash
req.path === "/api/posts"
```
That’s why for all routes in api.mjs you were forced to write:
```bash
app.get("/api/posts", ...)  // not /posts
```
If you really want req.path to be `/posts`, there are two valid and working solutions:
#### Option 1: Use `stripBasePath` in `serverless-http` in `api.mjs`
```js
export const handler = serverless(app, {
  request: {
    stripBasePath: true
  }
});
```
#### Option 2: Manually strip `/api` prefix
You can add a middleware in `api.mjs`:
```js
app.use((req, res, next) => {
  if (req.url.startsWith("/api")) {
    req.url = req.url.replace("/api", "") || "/";
  }
  next();
});
```
So then you can write:
```js
app.get("/posts", ...)  // works now
```
#### Also if you remove `:splat`
```toml
[[redirects]]
from = "/api/*"
to   = "/.netlify/functions/api"
```
Then all requests go to `/.netlify/functions/api`, but Netlify passes `req.path = "/api/posts"` into your function.

Now you must write:
```js
app.get("/api/posts", ...)  

```