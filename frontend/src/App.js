import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthenticatedRoute from "./components/routing/AuthenticatedRoute";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/pages/Home";
import ProductForm from "./components/ProductForm";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route element={<AuthenticatedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
