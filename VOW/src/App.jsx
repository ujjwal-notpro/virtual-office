import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Additional routes can be added here */}
        <Route path="/sign-up" element={<Home />} />
        <Route path="/about-us" element={<Home />} />
        <Route path="/learn-more" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
