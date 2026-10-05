import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SignOut from './pages/SignOut';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<SignUp />} />

        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/logout" element={<SignOut />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

