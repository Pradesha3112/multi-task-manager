import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import AuditLog from './pages/AuditLog';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
                <Route path="/tasks/new" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
                <Route path="/tasks/:id/edit" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
                <Route path="/audit-log" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
