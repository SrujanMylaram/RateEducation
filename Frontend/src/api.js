//  const api = {
//   login: async (email, password, role) => {
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     if (email === 'student@example.com' && password === 'password') {
//       return { success: true, user: { id: 1, name: 'John Doe', email, role: 'student' } };
//     } else if (email === 'admin@example.com' && password === 'admin') {
//       return { success: true, user: { id: 2, name: 'Admin User', email, role: 'admin' } };
//     }
//     throw new Error('Invalid credentials');
//   },
  
//   register: async (userData) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { success: true, user: { ...userData, id: Math.random() } };
//   },
  
//   getCourses: async () => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return [
//       { id: 1, name: 'Computer Science 101', faculty: 'Dr.Madhu', code: 'CS101' },
//       { id: 2, name: 'Data Structures', faculty: 'Prof. Asha', code: 'DS201' },
//       { id: 3, name: 'Web Development', faculty: 'Dr. Gopi', code: 'WD301' },
//       { id: 4, name: 'Database Systems', faculty: 'Prof. Latha', code: 'DB401' }
//     ];
//   },
  
//   submitFeedback: async (feedbackData) => {
//     await new Promise(resolve => setTimeout(resolve, 800));
//     return { success: true, id: Math.random() };
//   },
  
//   getFeedback: async () => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return [
//       { id: 1, course: 'Computer Science 101', faculty: 'Dr. Smith', teachingSkills: 4, punctuality: 5, clarity: 4, communication: 4, overall: 4.2, date: '2024-03-15', studentName: 'John Doe' },
//       { id: 2, course: 'Data Structures', faculty: 'Prof. Johnson', teachingSkills: 5, punctuality: 4, clarity: 5, communication: 5, overall: 4.8, date: '2024-03-14', studentName: 'Jane Smith' },
//       { id: 3, course: 'Web Development', faculty: 'Dr. Wilson', teachingSkills: 3, punctuality: 4, clarity: 3, communication: 4, overall: 3.5, date: '2024-03-13', studentName: 'Mike Johnson' }
//     ];
//   }
// };

// export default api;