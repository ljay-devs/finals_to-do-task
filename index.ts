import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';

const app = express();
const PORT = 6969;

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${req.protocol}://${req.get('host')}${req.originalUrl} : ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
  );
  next();
};

app.use(logger)
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todoapp',
});


// for sign up 
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err) => {
    if (err) return res.status(500).json({ error: 'User exists or error' });
    res.json({ 
      success: true,
      message: 'Signup successful'
    });
  });
});


// for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;  // Get credentials from the body
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(sql, [username, password], (err, results: any) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Invalid login' });
    }

    // Send success response with user ID
    res.json({
      success: true,
      message: 'Login successful',
      userId: results[0].id
    });
  });
});


// Add task
app.post('/add-task', (req, res) => {
  const { title, userId } = req.body;
  const sql = 'INSERT INTO tasks (title, user_id) VALUES (?, ?)';
  db.query(sql, [title, userId], (err) => {
    if (err) return res.status(500).json({ error: 'Task error' });
    res.json({ message: 'Task added' });
  });
});

// Mark task as Completed
app.put('/task/:id/complete', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE tasks SET status = 'Completed' WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error marking task as completed' });
    res.json({ message: 'Task marked as completed' });
  });
});


// Get tasks filtered by status
app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  const sql = "SELECT * FROM tasks WHERE user_id = ? AND status = ?";
  db.query(sql, [userId, status], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error loading tasks' });
    res.json(results);
  });
});



// Get tasks
app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM tasks WHERE user_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error loading tasks' });
    res.json(results);
  });
});

// Delete task
app.delete('/task-delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.json({ message: 'Task deleted' });
  });
});

app.post('/logout', (req, res) => { 
    
    res.json({ success: true, 
        message: 'Logged out successfully' 
    })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
