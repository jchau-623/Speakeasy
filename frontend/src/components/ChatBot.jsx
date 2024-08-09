import chatBotImg from "../assets/chat-bot.gif";
import askImg from "../assets/ask-bubble.gif";
import { useEffect, useState } from "react";
import Result from "./Result";

import { RiSendPlane2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { search } from "../store/slangReducer";
import { useNavigate } from "react-router-dom";

export default function ChatBot({ user }) {
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handlesubmit(e) {
    e.preventDefault();
    setShowResult(true);
    const reponse = dispatch(search({ term: userInput, user_id: user.id }));
    if (reponse) {
      console.log("response", reponse);
    }
    setUserInput("");
  }

  const typingEffect = (elementId, text, typingSpeed) => {
    const element = document.getElementById(elementId);
    let index = 0;
    element.innerText = "";

    const type = () => {
      if (index < text.length) {
        element.append(text.charAt(index));
        index++;
        setTimeout(type, typingSpeed);
      }
    };

    type();
  };

  useEffect(() => {
    const errors = {};
    if (userInput === "") {
      errors.userInput = "Please input a word or phrase";
    }

    setError(errors);
    setIsButtonActive(Object.values(errors).length === 0);
  }, [userInput]);

  useEffect(() => {
    if (!showResult) {
      const text = "Hi! What slang or idioms would you like to learn today?";
      typingEffect("typingEffect", text, 50);
    }
  }, [showResult]);

  if (!user) {
    navigate("/");
  }

  return (
    <>
      {showResult ? (
        <div className="w-full h-full overflow-hidden">
          <Result handleShowResult={setShowResult} user={user} />
        </div>
      ) : (
        <div className="chatBot w-full h-full flex flex-col justify-around">
          <div className="flex gap-5 w-full xl:w-[60%] p-2 md:p-8 items-center justify-start animate__animated animate__fadeInLeft border-4 border-secondary rounded-full overflow-hidden">
            <img
              src={chatBotImg}
              alt="chat-bot"
              className="w-[40px] h-[40px] sm:w-[80px] sm:h-[80px]"
            />
            <p id="typingEffect" className="w-full break-words text-lg">
              Hi! What slang or idioms would you like to learn today?
            </p>
          </div>
          <div
            className={`flex w-full xl:w-[60%] self-end justify-end items-center relative animate__animated animate__fadeInRight border-4 ${
              userInput.length > 0 ? "border-secondary" : "border-slate-300"
            } rounded-full`}
          >
            <div className="flex justify-center items-center p-2 md:p-8 w-full">
              <form
                className="w-full flex items-center gap-5"
                onSubmit={handlesubmit}
              >
                <textarea
                  type="text"
                  placeholder="Input the word or phrase"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={1}
                  className="flex items-center outline-none text-center p-2 bg-container placeholder-secondary w-[90%] placeholder-center resize-none text-lg"
                />
                <button
                  disabled={Object.values(error).length > 0}
                  className={`text-2xl
                    ${isButtonActive ? "text-secondary" : "text-slate-300"} `}
                >
                  <RiSendPlane2Fill />
                </button>
              </form>
              <img
                src={askImg}
                alt="user ask icon"
                className="hidden sm:block sm:w-[40px] sm:h-[40px] md:w-[80px] md:h-[80px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
