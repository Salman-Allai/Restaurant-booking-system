import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookTable from './pages/BookTable';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<ProtectedRoute><BookTable /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;