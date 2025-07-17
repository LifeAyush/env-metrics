import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddMetric from './pages/AddMetric';
import ProtectedRoute from './router/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-metric" element={<AddMetric />} />
        </Route>

        {/* Optional fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
