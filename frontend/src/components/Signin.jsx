import { useEffect, useState } from "react";
import robot from "../assets/chat-bot.gif";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    // Check if both userName and password are not empty to enable the button
    if (userName && password) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  }, [userName, password]);

  return (
    <>
      <div className="bg-[#F5FBF9] flex justify-center items-center w-full h-screen relative">
        <img
          src={robot}
          alt="chat bot"
          className="w-[8%] absolute top-[25%] left-[37%]"
        />
        <div className="animate__animated animate__fadeInUp w-[50%] flex flex-col gap-4 justify-center items-center relative">
          <h1 className="text-5xl text-secondary font-bold mb-6">Sign In</h1>
          <form className="flex flex-col gap-6">
            <div>
              <input
                type="email"
                placeholder="User email"
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                className="text-center text-xl p-2 rounded-full bg-secondary placeholder-white outline-none text-white font-semibold"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-xl p-2 rounded-full bg-secondary placeholder-white outline-none text-white font-semibold"
              />
            </div>

            <button
              disabled={!userName || !password}
              className={`bg-secondary w-fit mx-auto py-1 px-2 rounded-full disabled:bg-slate-300 disabled:text-white ${
                isButtonActive ? "animate__animated animate__rotateIn" : ""
              }`}
            >
              Sign In
            </button>
          </form>

          <hr className="w-full h-2 bg-secondary rounded mb-6" />

          <div>
            <Link
              to="/signup"
              className="text-center py-2 px-6 rounded-full bg-secondary text-xl font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
