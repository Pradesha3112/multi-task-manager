const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require login
router.use(authenticate);

// Get all tasks
router.get('/', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        let result;
        
        if (req.user.role === 'admin') {
            result = await pool.query(
                `SELECT t.*, u.email as creator_email 
                 FROM tasks t 
                 JOIN users u ON t.creator_id = u.id 
                 WHERE t.org_id = $1 
                 ORDER BY t.created_at DESC`,
                [req.user.org_id]
            );
        } else {
            result = await pool.query(
                `SELECT t.*, u.email as creator_email 
                 FROM tasks t 
                 JOIN users u ON t.creator_id = u.id 
                 WHERE t.org_id = $1 AND t.creator_id = $2 
                 ORDER BY t.created_at DESC`,
                [req.user.org_id, req.user.id]
            );
        }

        res.json(result.rows);
        
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get single task
router.get('/:id', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND org_id = $2',
            [req.params.id, req.user.org_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = result.rows[0];
        
        if (req.user.role !== 'admin' && task.creator_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(task);
        
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Create task
router.post('/', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description, creator_id, org_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, req.user.id, req.user.org_id]
        );

        // Log activity
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, task_id, details) 
             VALUES ($1, 'created', $2, $3)`,
            [req.user.id, result.rows[0].id, `Created task: ${title}`]
        );

        res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task
router.put('/:id', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const taskCheck = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND org_id = $2',
            [req.params.id, req.user.org_id]
        );

        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const task = taskCheck.rows[0];
        
        if (req.user.role !== 'admin' && task.creator_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { title, description, status } = req.body;
        
        const result = await pool.query(
            `UPDATE tasks 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 status = COALESCE($3, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 RETURNING *`,
            [title, description, status, req.params.id]
        );

        // Log activity
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, task_id, details) 
             VALUES ($1, 'updated', $2, $3)`,
            [req.user.id, req.params.id, 'Task updated']
        );

        res.json(result.rows[0]);
        
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task
router.delete('/:id', isAdmin, async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND org_id = $2 RETURNING *',
            [req.params.id, req.user.org_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Log activity
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, task_id, details) 
             VALUES ($1, 'deleted', $2, $3)`,
            [req.user.id, req.params.id, `Deleted task: ${result.rows[0].title}`]
        );

        res.json({ message: 'Task deleted successfully' });
        
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Get audit logs
router.get('/audit-logs/all', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const result = await pool.query(
            `SELECT al.*, u.email as user_email 
             FROM audit_logs al 
             JOIN users u ON al.user_id = u.id 
             WHERE u.org_id = $1 
             ORDER BY al.created_at DESC 
             LIMIT 100`,
            [req.user.org_id]
        );

        res.json(result.rows);
        
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

module.exports = router;