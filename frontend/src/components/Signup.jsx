import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signupThunk } from "../store/userReducer";

import profileImg from "../assets/user-profile.gif"

export default function SignUp() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signupThunk({ email: userEmail, password }));

    if (result.success) {
      navigate("/home");
    } else {  
      const errors = {};
      errors.error = result.error.detail || "Invalid email or password";
      setError(errors); 
    }
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
      <div className="flex justify-center items-center bg-primary w-screen h-screen">
        <div className="mx-auto animate__animated animate__fadeInUp w-[50%] relative">
          <img src={profileImg} alt="animated icon" className="hidden sm:block sm:w-[20%] md:w-[23%] absolute -bottom-16 -right-16 rotate-30"/>
          <form className="w-full flex flex-col justify-center items-center gap-10" onSubmit={handleSubmit}>
            <h1 className="text-xl sm:text-3xl md:text-5xl text-secondary font-bold">
              Create an account
            </h1>
            <div className="flex gap-24 justify-center">
              <label
                htmlFor="email"
                className="hidden sm:block text-center text-sm sm:text-3xl p-2 rounded-full text-secondary font-bold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="text-center text-sm sm:text-xl p-2 rounded-full bg-[#F5FBF9] placeholder-secondary outline-none text-secondary font-semibold"
              />
            </div>
            <div className="flex gap-10">
              <label
                htmlFor="password"
                className="hidden sm:block text-center text-sm sm:text-3xl p-2 rounded-full text-secondary font-bold"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center text-sm sm:text-xl p-2 rounded-full bg-[#F5FBF9] placeholder-secondary outline-none text-secondary font-semibold"
              />
            </div>

            <div className="text-center text-red-500 text-sm sm:text-center h-[5px] w-full">
                {error.error}
              </div>

            <button
              disabled={Object.values(error).length > 0}
              className={`bg-secondary w-fit mx-auto py-1 px-3 rounded-full text-white text-sm sm:text-lg font-bold disabled:bg-slate-300 disabled:text-white ${
                isButtonActive ? "animate__animated animate__rotateIn" : ""
              }`}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
