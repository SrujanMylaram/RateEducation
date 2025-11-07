import React, { useState } from 'react';
import axios from 'axios';

function LoginPage({ onLogin, switchToRegister }) {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      // Ensure backend returned user and token
      if (!response.data.user || !response.data.token) {
        throw new Error('Invalid login response from server.');
      }

      // Combine user data and token
      const loggedInUser = { ...response.data.user, token: response.data.token };
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      // Pass user data to parent
      onLogin(loggedInUser);

      // Optional: Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    } catch (err) {
      // Handle expired or invalid token
      if (
        err.response?.status === 401 &&
        err.response.data?.message?.toLowerCase().includes('expired')
      ) {
        localStorage.removeItem('user');
        window.location.href = '/login'; // redirect to login
      }

      const errorMsg =
        err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="text-primary fw-bold">Welcome Back</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Don't have an account? </span>
            <button className="btn btn-link p-0" onClick={switchToRegister}>
              Sign up here
            </button>
          </div>

          {/* <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Demo Credentials:</strong><br />
              Student: student@example.com / password<br />
              Admin: admin@example.com / admin
            </small>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
