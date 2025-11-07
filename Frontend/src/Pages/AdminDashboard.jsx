import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StarRating } from './RatingPage';

export function AdminDashboard({ user, onLogout, onAddCourse }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ course: '', faculty: '' });
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
    calculateAnalytics();
  }, [feedbacks, filters]);

  // ✅ Fetch feedbacks from backend
  const loadFeedbacks = async () => {
  try {
    const token = localStorage.getItem('token'); // or sessionStorage
    const res = await axios.get('http://localhost:5000/api/feedback', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFeedbacks(res.data);
  } catch (error) {
    console.error('❌ Failed to load feedback:', error);
  } finally {
    setLoading(false);
  }
};


  // ✅ Filter by course/faculty
  const filterFeedbacks = () => {
    let filtered = feedbacks;
    if (filters.course) {
      filtered = filtered.filter(f =>
        f.course_name?.toLowerCase().includes(filters.course.toLowerCase())
      );
    }
    if (filters.faculty) {
      filtered = filtered.filter(f =>
        f.faculty_name?.toLowerCase().includes(filters.faculty.toLowerCase())
      );
    }
    setFilteredFeedbacks(filtered);
  };

  // ✅ Calculate analytics (average ratings, etc.)
  const calculateAnalytics = () => {
    const facultyStats = {};
    const courseStats = {};

    feedbacks.forEach(fb => {
      const faculty = fb.faculty_name ;
      const course = fb.course_name ;

      // Faculty
      if (!facultyStats[faculty]) facultyStats[faculty] = { sum: 0, count: 0 };
      facultyStats[faculty].sum += fb.overall_rating;
      facultyStats[faculty].count++;

      // Course
      if (!courseStats[course]) courseStats[course] = { sum: 0, count: 0 };
      courseStats[course].sum += fb.overall_rating;
      courseStats[course].count++;
    });

    Object.keys(facultyStats).forEach(f => {
      facultyStats[f].avg = facultyStats[f].sum / facultyStats[f].count;
    });
    Object.keys(courseStats).forEach(c => {
      courseStats[c].avg = courseStats[c].sum / courseStats[c].count;
    });

    setAnalytics({ facultyStats, courseStats });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">Admin Portal</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user?.name}</span>
            <button className="btn btn-light me-2" onClick={onAddCourse}>Add Course</button>
            <button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Feedback Dashboard</h2>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white text-center">
              <div className="card-body">
                <h3>{feedbacks.length}</h3>
                <p>Total Feedback</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white text-center">
              <div className="card-body">
                <h3>{Object.keys(analytics.facultyStats || {}).length}</h3>
                <p>Faculty Members</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white text-center">
              <div className="card-body">
                <h3>{Object.keys(analytics.courseStats || {}).length}</h3>
                <p>Courses</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white text-center">
              <div className="card-body">
                <h3>
                  {feedbacks.length > 0
                    ? (feedbacks.reduce((sum, f) => sum + f.overall_rating, 0) / feedbacks.length).toFixed(1)
                    : '0'}
                </h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>Filters</h5>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by course..."
                  value={filters.course}
                  onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by faculty..."
                  value={filters.faculty}
                  onChange={(e) => setFilters({ ...filters, faculty: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Faculty Performance */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>Faculty Performance</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Faculty</th>
                    <th>Average Rating</th>
                    <th>Total Feedback</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.facultyStats || {}).map(([faculty, stats]) => (
                    <tr key={faculty}>
                      <td>{faculty}</td>
                      <td>{stats.avg.toFixed(2)}</td>
                      <td>{stats.count}</td>
                      <td><StarRating rating={Math.round(stats.avg)} readonly /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="card">
          <div className="card-body">
            <h5>All Feedback ({filteredFeedbacks.length})</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Faculty</th>
                    <th>Teaching</th>
                    <th>Punctuality</th>
                    <th>Clarity</th>
                    <th>Communication</th>
                    <th>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedbacks.map(fb => (
                    <tr key={fb.id}>
                      <td>{new Date(fb.created_at).toLocaleDateString()}</td>
                      <td>{fb.student_name}</td>
                      <td>{fb.course_name}</td>
                      <td>{fb.faculty_name}</td>
                      <td><StarRating rating={fb.teaching_skills} readonly /></td>
                      <td><StarRating rating={fb.punctuality} readonly /></td>
                      <td><StarRating rating={fb.clarity} readonly /></td>
                      <td><StarRating rating={fb.communication} readonly /></td>
                      <td><span className="badge bg-primary">{fb.overall_rating.toFixed(1)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
