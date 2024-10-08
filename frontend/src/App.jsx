import { Routes, Route } from "react-router-dom";

import Welcome from "./components/Welcome";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import History from "./components/History";
import About from "./components/About";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact={true} element={<Welcome />} />
        <Route path="/home" exact={true} element={<Home />} />
        <Route path="/signup" exact={true} element={<SignUp />} />
        <Route path="/signin" exact={true} element={<SignIn />} />
        <Route path="/history" exact={true} element={<History />} />
        <Route path="/about" exact={true} element={<About />} />
      </Routes>
    </>
  );
}

export default App;
