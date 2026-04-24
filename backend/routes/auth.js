const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const { email, password, org_id } = req.body;

        if (!email || !password || !org_id) {
            return res.status(400).json({ error: 'Email, password, and org_id required' });
        }

        // Check if email exists
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if organization exists
        const orgCheck = await pool.query('SELECT id FROM organizations WHERE id = $1', [org_id]);
        if (orgCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, org_id) VALUES ($1, $2, $3) RETURNING id, email, role, org_id',
            [email, password_hash, org_id]
        );

        const user = result.rows[0];

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, org_id: user.org_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ message: 'Registration successful', user, token });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const pool = req.app.get('db');
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, org_id: user.org_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Login successful',
            user: { id: user.id, email: user.email, role: user.role, org_id: user.org_id },
            token 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;