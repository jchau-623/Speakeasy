import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ChatBot from "./ChatBot";
import History from "./History";
import Favorites from "./Favorites";
import Profile from "./Profile";
import HomeBG from "./HomeBG";
import NoUser from "./NoUser";

import loadingImg from "../assets/loading.gif";
import chatBotImg from "../assets/chat-bot.gif";
import historyImg from "../assets/history.gif";
import bookmarkImg from "../assets/bookmark.gif";
import profileImg from "../assets/user-profile.gif";
import logoutImg from "../assets/logout.gif";
import friendshipImg from "../assets/friendships.gif";
import infoImg from "../assets/info.gif";
import copyrightImg from "../assets/copyright.gif";

import { getUserHistoryThunk, logoutThunk } from "../store/userReducer";

export default function Home() {
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showMainContent, setShowContainer] = useState(false);
  const [showChatBot, setShowChatBot] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorite, setShowFavorite] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const result = await dispatch(logoutThunk());
    if (result.success) {
      navigate("/");
    } else {
      alert(result.error.message);
    }
  };

  const addToFavoriteFunction = async (item) => {
    await dispatch(addUserFavoriteThunk(item));
  };

  const removeFromFavorite = async (item) => {
    await dispatch(deleteUserFavoriteThunk(item));
  };

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

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLoading(false);
        setShowContainer(true);
        // setFadeOut(false);
      }, 2000);
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, []);

  useEffect(() => {
    dispatch(getUserHistoryThunk());
  }, [dispatch]);

  if (!user) {
    return <NoUser />;
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
          {/* <HomeBG /> */}

          <div className="flex absolute top-[30px] left-[50px] justify-center items-center gap-3">
            <img
              src={friendshipImg}
              alt="friendship icon"
              className="w-[100px] h-[100px]"
            />
            <h1 className="font-extrabold text-white text-3xl ">SpeakEasy</h1>
          </div> 
          <div className="group ">
            <img
              src={logoutImg}
              alt="log out button"
              className="w-[50px] h-[50px] absolute top-[50px] right-[60px] cursor-pointer hover:scale-125 transition-all duration-200"
              onClick={handleLogOut}
            />
            <span className="absolute top-[100px] right-[50px] mb-1 hidden group-hover:block px-2 py-2 text-sm font-medium text-white bg-red-300 rounded animate__animated animate__swing">
              Log Out
            </span>
          </div> 


          <div className="flex flex-col w-[60%] bg-[#F5FBF9] h-3/6 rounded-xl shadow-sm overflow-hidden">
            <div className="container w-[100%] h-full">
              <div className="w-[100%] grid grid-cols-4 h-[80px] bg-primary">
                <div
                  className={` ${
                    showChatBot
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleHomeRender}
                >
                  {showChatBot ? (
                    "EasyChat"
                  ) : (
                    <img
                      src={chatBotImg}
                      alt="chat bot image"
                      className="w-[45px] h-[45px] hover:scale-150 transition-all duration-200"
                    />
                  )}
                </div>
                <div
                  className={` ${
                    showHistory
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleHistoryRender}
                >
                  {showHistory ? (
                    "History"
                  ) : (
                    <img
                      src={historyImg}
                      alt="history image"
                      className="w-[40px] h-[40px] hover:scale-150 transition-all duration-200"
                    />
                  )}
                </div>
                <div
                  className={` ${
                    showFavorite
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleFavoriteRender}
                >
                  {showFavorite ? (
                    "Favorites"
                  ) : (
                    <img
                      src={bookmarkImg}
                      alt="favorite image"
                      className="w-[40px] h-[40px] hover:scale-150 transition-all duration-200"
                    />
                  )}
                </div>
                <div
                  className={` ${
                    showProfile
                      ? "bg-container text-secondary flex items-center justify-center rounded-t-xl cursor-pointer text-xl font-bold"
                      : "rounded-t-xl bg-primary border-4 border-secondary flex items-center justify-center text-white cursor-pointer"
                  }`}
                  onClick={handleProfileRender}
                >
                  {showProfile ? (
                    "Profile"
                  ) : (
                    <img
                      src={profileImg}
                      alt="profile image"
                      className="w-[40px] h-[40px] hover:scale-150 transition-all duration-200"
                    />
                  )}
                </div>
              </div>

              <div
                className="grid grid-cols-1 p-8 w-full h-[90%] overflow-scroll relative"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {showChatBot && <ChatBot user={user} />}
                {showHistory && <History user={user} />}
                {showFavorite && <Favorites user={user} />}
                {showProfile && (
                  <Profile
                    user={user}
                    handleFavoriteRender={handleFavoriteRender}
                    handleHistoryRender={handleHistoryRender}
                  />
                )}
              </div>
            </div>
          </div>

          <footer className="absolute bottom-0 w-full bg-secondary text-white py-4 h-[80px] flex items-center">
            <div className="w-full flex justify-between px-20 items-center ">
              <div className="flex items-center gap-1">
                <img src={copyrightImg} alt="copy right icon" className="w-[30px] h-[30px]"/>
              <p className="text-lg">SpeakEasy 2024</p>
              </div>
              <div className="flex items-center gap-2 py-2 px-4 rounded-lg text-lg hover:bg-primary hover:scale-90 transition-all duration-200">
                <img
                  src={infoImg}
                  alt="information icon"
                  className="w-[30px] h-[30px]"
                />
                <Link
                  to="/about"
                  className=" text-white  "
                >
                  About Us
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
