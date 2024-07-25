import { Routes, Route } from "react-router-dom";

import Welcome from "./components/Welcome";
import Home from "./components/Home";
import SignUp from "./components/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact={true} element={<Welcome />} />
        <Route path="/home" exact={true} element={<Home />} />
        <Route path="/signup" exact={true} element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
