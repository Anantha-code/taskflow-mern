# TaskFlow | MERN Task Manager

A beginner-friendly full-stack task management app built with **MongoDB, Express.js, React, and Node.js**.

Users can create, view, update, complete, and delete tasks. This project demonstrates CRUD operations and frontend-to-backend communication through a REST API.

## Features

- Create tasks with a title and optional description
- View all saved tasks
- Mark tasks as completed or pending
- Edit task details
- Delete tasks
- Filter by all, pending, or completed tasks
- Responsive, simple interface
- Basic server-side validation and error handling

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **ODM:** Mongoose
- **Styling:** CSS

## Project Structure

```text
taskflow-mern/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── server/
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   └── tasks.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Requirements

Install:
- Node.js (LTS recommended)
- npm
- A MongoDB database, either local MongoDB or MongoDB Atlas

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/taskflow-mern.git
cd taskflow-mern
```

Replace `YOUR-USERNAME` with your GitHub username after creating the repository.

### 2. Configure the backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set your MongoDB connection string:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
```

For MongoDB Atlas, use your own connection string. Never commit your real `.env` file or database credentials.

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

Health check: `http://localhost:5000/api/health`

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
```

Create `client/.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start React:

```bash
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/toggle` | Toggle completion |
| DELETE | `/tasks/:id` | Delete a task |
| GET | `/health` | Check API status |

### Example task

```json
{
  "title": "Prepare for interview",
  "description": "Revise MERN fundamentals",
  "completed": false
}
```

## How It Works

1. React collects input from the user.
2. React sends an HTTP request to the Express REST API.
3. Express validates the request and calls the Mongoose model.
4. Mongoose reads or writes the task in MongoDB.
5. The API returns JSON.
6. React refreshes the displayed task list.


| Project    | Website                      | Backend API                   |
| ---------- | ---------------------------- | ----------------------------- |
| TaskFlow   | `taskflow-mern.vercel.app`   | `taskflow-api.onrender.com`   |
