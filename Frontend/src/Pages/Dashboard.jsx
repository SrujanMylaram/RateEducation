import React, { useState, useEffect } from "react";
import { StarRating } from "./RatingPage";
import axios from "axios";

function StudentDashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facultyRatings, setFacultyRatings] = useState({});

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    teachingSkills: 0,
    punctuality: 0,
    clarity: 0,
    communication: 0,
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submittedFeedback, setSubmittedFeedback] = useState(new Set());

  useEffect(() => {
    loadCourses();
    fetchFacultyRatings();
  }, []);

  const fetchFacultyRatings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/feedback/faculty/ratings",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // Convert array to object for quick lookup
      const ratingsMap = {};
      response.data.forEach((f) => {
        ratingsMap[f.faculty_name] = parseFloat(f.average_rating).toFixed(2);
      });
      setFacultyRatings(ratingsMap);
    } catch (error) {
      console.error("Failed to fetch faculty ratings:", error);
    }
  };

  // Fetch courses from backend with auth header
  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/courses", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      setAlert({
        type: "danger",
        message: error.response?.data?.message || "Failed to load courses",
      });
    } finally {
      setLoading(false);
    }
  };

  const openFeedbackModal = (course) => {
    setSelectedCourse(course);
    setFeedbackData({
      teachingSkills: 0,
      punctuality: 0,
      clarity: 0,
      communication: 0,
      comments: "",
    });
    setShowFeedbackModal(true);
  };

  // Submit feedback to backend
  const submitFeedback = async () => {
  // Check if feedback for this course has already been submitted
  if (submittedFeedback.has(selectedCourse.id)) {
    setAlert({
      type: "warning",
      message: "You have already submitted feedback for this course!",
    });
    return; // Stop the function
  }

  const { teachingSkills, punctuality, clarity, communication, comments } =
    feedbackData;

  if (!teachingSkills || !punctuality || !clarity || !communication) {
    setAlert({ type: "warning", message: "Please rate all criteria" });
    return;
  }

  setSubmitting(true);

  try {
    await axios.post(
      "http://localhost:5000/api/feedback",
      {
        course_id: selectedCourse.id,
        teachingSkills: feedbackData.teachingSkills,
        punctuality: feedbackData.punctuality,
        clarity: feedbackData.clarity,
        communication: feedbackData.communication,
        comment: feedbackData.comments,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Mark course as submitted
    setSubmittedFeedback((prev) => new Set([...prev, selectedCourse.id]));
    setShowFeedbackModal(false);
    setAlert({
      type: "success",
      message: "Feedback submitted successfully!",
    });

    // Refresh faculty ratings
    fetchFacultyRatings();
  } catch (error) {
    setAlert({
      type: "danger",
      message: error.response?.data?.message || "Failed to submit feedback",
    });
  } finally {
    setSubmitting(false);
  }
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">Student Portal</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, {user.name}</span>
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show mb-4`}
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-12">
            <h2 className="fw-bold mb-3">Available Courses</h2>
            <div className="row">
              {courses.map((course) => (
                <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{course.name}</h5>
                      <p className="card-text">
                        <strong>Code:</strong> {course.code}
                        <br />
                        <strong>Faculty:</strong> {course.faculty}
                        <br />
                        <strong>Average Rating:</strong>{" "}
                        {facultyRatings[course.faculty] || "N/A"} / 5
                      </p>

                      {submittedFeedback.has(course.id) ? (
                        <button className="btn btn-success" disabled>
                          <span className="me-2">✓</span>
                          Feedback Submitted
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => openFeedbackModal(course)}
                        >
                          Give Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Feedback for {selectedCourse?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFeedbackModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <p>
                    <strong>Faculty:</strong> {selectedCourse?.faculty}
                  </p>
                  <p>
                    <strong>Course Code:</strong> {selectedCourse?.code}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Teaching Skills
                  </label>
                  <StarRating
                    rating={feedbackData.teachingSkills}
                    onRatingChange={(rating) =>
                      setFeedbackData({
                        ...feedbackData,
                        teachingSkills: rating,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Punctuality</label>
                  <StarRating
                    rating={feedbackData.punctuality}
                    onRatingChange={(rating) =>
                      setFeedbackData({ ...feedbackData, punctuality: rating })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Clarity of Explanation
                  </label>
                  <StarRating
                    rating={feedbackData.clarity}
                    onRatingChange={(rating) =>
                      setFeedbackData({ ...feedbackData, clarity: rating })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Communication
                  </label>
                  <StarRating
                    rating={feedbackData.communication}
                    onRatingChange={(rating) =>
                      setFeedbackData({
                        ...feedbackData,
                        communication: rating,
                      })
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Additional Comments
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={feedbackData.comments}
                    onChange={(e) =>
                      setFeedbackData({
                        ...feedbackData,
                        comments: e.target.value,
                      })
                    }
                    placeholder="Any additional feedback..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={submitFeedback}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
