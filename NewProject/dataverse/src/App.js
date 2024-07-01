import React from 'react';
import ChartPage from './components/ChartPage';
import SavedCharts from './components/SavedCharts';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">Chart Page</Link>
            </li>
            <li>
              <Link to="/saved-charts" className="nav-link">Saved Charts</Link>
            </li>
          </ul>
        </nav>*
        <Routes>
          <Route path="/" element={<ChartPage />} />
          <Route path="/saved-charts" element={<SavedCharts />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;







