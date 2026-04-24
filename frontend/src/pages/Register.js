import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgId, setOrgId] = useState('1');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post('/api/auth/register', {
                email,
                password,
                org_id: parseInt(orgId)
            });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>🚀 Create Account</h2>
                <p className="subtitle">Join your organization's workspace</p>
                
                {error && <div className="alert-error">⚠️ {error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📧 Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>🔒 Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>🏢 Organization</label>
                        <select 
                            value={orgId} 
                            onChange={(e) => setOrgId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontFamily: "'Poppins', sans-serif",
                                outline: 'none',
                                cursor: 'pointer',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="1">🏢 Tech Corp</option>
                            <option value="2">🎨 Design Studio</option>
                        </select>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? '⏳ Creating Account...' : '✨ Create Account'}
                    </button>
                </form>
                
                <p className="auth-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
