import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import LearnMore from './pages/LearnMore';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<SignUp />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ResetPassword />} />

        {/* Informational routes */}
        <Route path="/learn-more" element={<LearnMore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
