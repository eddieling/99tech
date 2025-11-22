import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Problem1 from "./pages/Problem1";
import Problem2 from "./pages/Problem2";
import Problem3 from "./pages/Problem3";
import "./App.css";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo"></Link>
        <div className="nav-links">
          <Link
            to="/problem1"
            className={
              location.pathname === "/problem1" ? "nav-link active" : "nav-link"
            }
          >
            Problem 1
          </Link>
          <Link
            to="/problem2"
            className={
              location.pathname === "/problem2" ? "nav-link active" : "nav-link"
            }
          >
            Problem 2
          </Link>
          <Link
            to="/problem3"
            className={
              location.pathname === "/problem3" ? "nav-link active" : "nav-link"
            }
          >
            Problem 3
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="home-container">
      <div className="problem-cards">
        <Link to="/problem1" className="problem-card">
          <h3>Problem 1</h3>
        </Link>
        <Link to="/problem2" className="problem-card">
          <h3>Problem 2</h3>
        </Link>
        <Link to="/problem3" className="problem-card">
          <h3>Problem 3</h3>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem1" element={<Problem1 />} />
            <Route path="/problem2" element={<Problem2 />} />
            <Route path="/problem3" element={<Problem3 />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
