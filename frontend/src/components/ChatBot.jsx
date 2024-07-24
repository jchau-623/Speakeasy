import chatBotImg from "../assets/chat-bot.gif";
import userImg from "../assets/profile.gif";
import speechImg from "../assets/speech.png";
import speechUserImg from "../assets/speech-user.png";
import { useEffect, useState } from "react";
import Result from "./Result";

import { RiSendPlane2Fill } from "react-icons/ri";

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState(false);

  function handlesubmit(e) {
    e.preventDefault();
    setShowResult(true);
    setUserInput("");
  }

  useEffect(() => {
    const errors = {};
    if (userInput === "") {
      errors.userInput = "Please input a word or phrase";
    }

    setError(errors);
    setIsButtonActive(Object.values(errors).length === 0);
  }, [userInput]);

  return (
    <>
      {showResult ? (
        <div className="w-full h-full overflow-hidden">

          <Result handleShowResult={ setShowResult }/>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col overflow-hidden">
          <div className="flex w-full h-[45%] items-end justify-start animate__animated animate__fadeInLeft">
            <img
              src={chatBotImg}
              alt="chat-bot"
              className="w-[80px] h-[80px]"
            />
            <div className="flex items-center justify-start relative w-full h-[45%] ">
              <img src={speechImg} alt="" className="w-1/2 relative -top-10" />
              <p className="z-10 absolute -top-5 left-16 w-[35%] text-center">
                Hi! What slang or idioms would you like to learn today?
              </p>
            </div>
          </div>
          <div className="flex w-full h-[45%] justify-end items-center relative animate__animated animate__fadeInRight">
            <div className="flex justify-center items-center relative -top-16 -right-20 ">
              <img src={speechUserImg} alt="" className="w-2/3 " />
              <form className="absolute flex" onSubmit={handlesubmit}>
                <textarea
                  type="text"
                  placeholder="Input the word or phrase"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="outline-none text-center p-2 bg-container placeholder-secondary scrollbar-hide resize-none"
                />
                <button
                  disabled={Object.values(error).length > 0}
                  className={`${
                    isButtonActive ? "text-secondary" : "text-slate-300"
                  } `}
                >
                  <RiSendPlane2Fill />
                </button>
              </form>
            </div>
            <img
              src={userImg}
              alt="user animated icon"
              className="w-[60px] h-[60px]"
            />
          </div>
        </div>
      )}
    </>
  );
}
