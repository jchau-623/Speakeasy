import { useState, useEffect } from "react";
import logo from "../assets/logo.gif";
import SignIn from "./Signin";

export default function Welcome() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowWelcome(false);
        setShowMainContent(true);
      }, 2000);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, []);

  return (
    <>
      <div className="bg-[#94DFE1] w-screen h-screen flex justify-center items-center">
        {showWelcome && (
          <div
            className={`welcome bg-[#94DFE1] absolute w-screen h-screen flex flex-col justify-center items-center animate__animated animate__fadeInUp ${
              fadeOut ? "animate__fadeOut" : ""
            }`}
          >
            <img src={logo} alt="speak logo" className="w-[20%]" />
            <p className="text-3xl lg:text-6xl font-semibold lg:font-bold text-white">
              Welcome to SpeakEasy!
            </p>
          </div>
        )}

        <div
          className={`mainContent w-full h-full ${
            showMainContent ? "animate__animated animate__fadeIn" : "hidden"
          }`}
        >
          <div><SignIn /></div>
          
        </div>
      </div>
    </>
  );
}
