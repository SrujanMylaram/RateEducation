import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage({ onRegister, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registered user:', response.data.user);
      onRegister(response.data.user);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong!';
      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">Create Account</h2>
            <p className="text-muted">Join our feedback system</p>
          </div>
          
          {errors.general && (
            <div className="alert alert-danger py-2" role="alert">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Enter your password"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-semibold">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <span className="text-muted">Already have an account? </span>
            <button className="btn btn-link p-0" onClick={switchToLogin}>
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
