import React, { useState } from 'react';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import Dashboard from './Pages/Dashboard';
import { AdminDashboard } from './Pages/AdminDashboard';
import AddCoursePage from './Pages/AddCoursePage';
// import CoursesPage from './Pages/CoursesPage';
import './App.css';


function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('Registered user data:', userData);
    setCurrentView(userData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setCurrentView(userData.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {currentView === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          switchToRegister={() => setCurrentView('register')}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onRegister={handleRegister}
          switchToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'student-dashboard' && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onViewCourses={() => setCurrentView('courses')}
        />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminDashboard
          user={user}
          onLogout={handleLogout}
          onAddCourse={() => setCurrentView('add-course')}
        />
      )}

      {currentView === 'add-course' && (
        <AddCoursePage onBack={() => setCurrentView('admin-dashboard')} />
      )}

      {/* {currentView === 'courses' && (
        <CoursesPage onBack={() => setCurrentView('student-dashboard')} />
      )} */}
    </div>
  );
}

export default App;
