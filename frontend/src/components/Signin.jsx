import { useEffect, useState } from "react";
import robot from "../assets/chat-bot.gif";
import { Link, useNavigate } from "react-router-dom";
 

export default function SignIn() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log(userEmail  + " " + password);
    navigate("/home");
  }

  useEffect(() => {
    const errors = {};
    if (!userEmail) errors.email = "Please enter your email";
    if (!userEmail.includes("@")) errors.email = "Please enter a valid email";
    if (!password) errors.password = "Please enter your password";

    setError(errors);
    setIsButtonActive(Object.values(errors).length === 0);
    
  }, [userEmail, password]);
  

  return (
    <>
      <div className="bg-[#F5FBF9] flex justify-center items-center w-screen h-screen relative">
        <div className="animate__animated animate__fadeInUp w-[45%] flex flex-col gap-4 justify-center items-center">
          <div className=" flex flex-col sm:flex sm:flex-row justify-center gap-8 relative">
            <img
              src={robot}
              alt="chat bot"
              className="w-[100px] sm:absolute -top-8 -left-[130px]"
            />

            <h1 className="text-5xl text-secondary font-bold mb-6">Sign In</h1>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="User email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="text-center text-sm sm:text-xl p-2 rounded-full bg-secondary placeholder-white outline-none text-white font-semibold"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-sm sm:text-xl p-2 rounded-full bg-secondary placeholder-white outline-none text-white font-semibold"
              />
            </div>

            <button
              disabled={Object.values(error).length > 0}
              className={`bg-secondary w-fit mx-auto py-1 px-2 rounded-full text-white text-sm sm:text-lg font-bold disabled:bg-slate-300 disabled:text-white ${
                isButtonActive ? "animate__animated animate__rotateIn" : ""
              }`}
            >
              Sign In
            </button>
          </form>

          <hr className="w-[200%] sm:w-full h-2 bg-secondary m-6" />

          <div>
            <Link
              to="/signup"
              className="text-center py-2 px-6 rounded-full bg-secondary text-sm sm:text-xl font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}