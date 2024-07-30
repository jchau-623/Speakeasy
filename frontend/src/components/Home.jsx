import { useState, useEffect } from "react";
import signout from "../assets/signout.png";

import ChatBot from "./ChatBot";
import History from "./History";
import Favorites from "./Favorites";
import Profile from "./Profile";

import loadingImg from "../assets/loading.gif";
import chatBotImg from "../assets/chat-bot.gif";
import historyImg from "../assets/history.gif";
import favoriteImg from "../assets/favorites.gif";
import profileImg from "../assets/user-profile.gif";

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showMainContent, setShowContainer] = useState(false);
  const [showChatBot, setShowChatBot] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorite, setShowFavorite] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoading(false);
        setShowContainer(true);
      }, 2000);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, []);

  function handleHomeRender() {
    setShowChatBot(true);
    setShowHistory(false);
    setShowFavorite(false);
    setShowProfile(false);
  }

  function handleHistoryRender() {
    setShowChatBot(false);
    setShowHistory(true);
    setShowFavorite(false);
    setShowProfile(false);
  }

  function handleFavoriteRender() {
    setShowChatBot(false);
    setShowHistory(false);
    setShowFavorite(true);
    setShowProfile(false);
  }

  function handleProfileRender() {
    setShowChatBot(false);
    setShowHistory(false);
    setShowFavorite(false);
    setShowProfile(true);
  }

  return (
    <>
      <div className="bg-primary w-screen h-screen flex justify-center items-center">
        {showLoading && (
          <div className="animate__animated animate__fadeInUp">
            <img
              src={loadingImg}
              alt="loading image"
              className={`w-[100px] h-[100px] ${
                fadeOut ? "animate__animated animate__fadeOut" : ""
              }`}
            />
          </div>
        )}

        <div
          className={`flex justify-center items-center w-full h-full ${
            showMainContent ? "animate__animated animate__fadeIn" : "hidden"
          }`}
        >
          <img
            src={signout}
            alt="log out button"
            className="w-[40px] h-[40px] absolute top-[30px] right-[50px]"
          />

          <div className="flex flex-col bg-[#F5FBF9] w-4/6 h-3/6 rounded-xl shadow-sm overflow-hidden">
            <div className="container w-[100%] h-full">
              <div className="grid grid-cols-4 w-full h-[80px] bg-primary">
                <div
                  className={` ${
                    showChatBot
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleHomeRender}
                >
                  {showChatBot ?  "EasyChat" : <img src={chatBotImg} alt="chat bot image" className="w-[40px] h-[40px]" />}
                </div>
                <div
                  className={` ${
                    showHistory
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleHistoryRender}
                >
                  {showHistory ? "History" : <img src={historyImg} alt="history image" className="w-[40px] h-[40px]" />}
                </div>
                <div
                  className={` ${
                    showFavorite
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleFavoriteRender}
                >
                  {showFavorite ? "Favorites" : <img src={favoriteImg} alt="favorite image" className="w-[40px] h-[40px]" />}
                </div>
                <div
                  className={` ${
                    showProfile
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleProfileRender}
                >
                  {showProfile ? "Profile" : <img src={profileImg} alt="profile image" className="w-[40px] h-[40px]" />}
                </div>
              </div>

              <div className="grid grid-cols-1 p-8 w-full h-[90%]">
                {showChatBot && <ChatBot />}
                {showHistory && <History />}
                {showFavorite && <Favorites />}
                {showProfile && <Profile />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
