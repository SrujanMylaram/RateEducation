import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddCoursePage({ onBack }) {
  const [formData, setFormData] = useState({ name: '', faculty: '', code: '' });
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/courses', formData);
      setMessage(res.data.message || 'Course added successfully!');
      setFormData({ name: '', faculty: '', code: '' });
      fetchCourses();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add course';
      setError(msg);
    }
  };

  return (
    <div className="container mt-5">
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Add New Course</h2>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Faculty Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  placeholder="Enter faculty name"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Course Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter course code"
                  required
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-primary">
                Add Course
              </button>
            </div>
          </form>

          {/* Messages */}
          {message && (
            <div className="alert alert-success mt-3 mb-0">{message}</div>
          )}
          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        </div>
      </div>

      {/* Courses Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3 text-secondary">Available Courses</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Course Name</th>
                  <th>Faculty</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.id}</td>
                      <td>{course.name}</td>
                      <td>{course.faculty}</td>
                      <td>{course.code}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No courses available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCoursePage;
