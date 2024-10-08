import chatBotImg from "../assets/chat-bot.gif";
import bookMarkImg from "../assets/bookmark.gif";
import FavoriteImg from "../assets/favorites.gif";
import { useDispatch } from "react-redux";
import search from "../assets/search-2.gif";

import {
  addUserFavoriteThunk,
  deleteUserFavoriteThunk,
  getUserHistoryThunk,
} from "../store/userReducer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Result({ handleShowResult, user }) {
  const slang = useSelector((state) => state.slangs.slang);
  const loading = useSelector((state) => state.slangs.loading);
  const dispatch = useDispatch();

  const [isIdiom, setIsIdiom] =useState(false)  ;

  async function addToFavoriteFunction(item) {
    await dispatch(addUserFavoriteThunk(item));
  }

  async function removeFromFavorite(item) {
    await dispatch(deleteUserFavoriteThunk(item));
  }

  useEffect(() => {
    if (slang) {
      dispatch(getUserHistoryThunk());
    }
  }, [slang, dispatch]);

  useEffect(()=>{
    if(slang && slang.term){
      setIsIdiom(false)
    
    }
    if(slang && slang.idiom){
      setIsIdiom(true)
      
    }
      },[slang])

  return (
    <div className="flex flex-col w-full h-full animate__animated animate__fadeInRight">
      <div className="flex gap-5 h-[88%] w-full">
        <img
          src={chatBotImg}
          alt="chat bot icon"
          className="hidden sm:block sm:w-[50px] sm:h-[50px] md:w-[100px] md:h-[100px]"
        />
        <div
          className="sm:relative top-10 -left-6 p-5 w-full sm:w-[85%] h-[100%] md:h-[80%] rounded-xl border-4 border-secondary overflow-scroll"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading && (
            <div className="w-full h-[100%] flex justify-center items-center">
              <img
                src={search}
                className="sm:w-[50px] sm:h-[50px] md:w-[100px] md:h-[100px] animate-bounce"
                alt="sesrch icon"
              />
            </div>
          )}
          {!loading && (
            <div className="animate__animated animate__fadeInUp">
              <div className="flex justify-between w-full ">
                <h1 className="text-3xl text-[#38b0b5] font-extrabold">
                  {slang?.term}
                  {slang?.idiom}
                </h1>
                 {/* <h1 className="text-3xl text-[#38b0b5] font-extrabold">{isIdiom?"Idiom: ":"Slang: "}{slang?.term}{slang?.idiom}</h1> */}
                <div className="relative group">
                  {user.favorite.find(
                    (favorite) =>
                      favorite.term === slang?.term ||
                      favorite.idiom === slang?.idiom
                  ) ? (
                    <div className="relative group">
                      <img
                        src={FavoriteImg}
                        alt="favorite icon"
                        className="w-[40px] h-[40px] cursor-pointer rotate-30"
                        onClick={() => removeFromFavorite(slang)}
                      />
                      <span className="absolute hidden mb-1 group-hover:block px-2 py-2 text-xs text-white bg-red-300 rounded animate__animated animate__swing">
                        Remove from favorite
                      </span>
                    </div>
                  ) : (
                    <div className="relative group">
                      <img
                        src={bookMarkImg}
                        alt="add to favorite icon"
                        className="w-[40px] h-[40px] cursor-pointer rotate-30"
                        onClick={() => addToFavoriteFunction(slang)}
                      />
                      <span className="absolute hidden mb-1 group-hover:block px-2 py-2 text-xs text-white bg-secondary rounded animate__animated animate__swing">
                        Add to favorite
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-5 mt-5 text-[#38b0b5]">
                <p className="text-xl font-medium">
                  Meaning :{" "}
                  <span className="text-lg font-normal leading-normal">
                    {slang.meaning}
                  </span>
                </p>
                <p className="text-xl font-medium">
                  Origin:{" "}
                  <span className="text-lg font-normal leading-normal">
                    {slang.origin}
                  </span>
                </p>
                <p className="text-xl font-medium">
                  Example:{" "}
                  <span className="text-lg font-normal leading-normal">
                    {slang.exampleUse}
                  </span>
                </p>
                <p className="text-xl font-medium">
                  Equivalent:{" "}
                  <span className="text-lg font-normal leading-normal">
                    {slang.equivalentInLanguage}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => handleShowResult(false)}
        className="flex justify-center self-end p-2 sm:p-3 text-xs sm:text-base bg-secondary w-fit sm:w-[10%] rounded-full text-white font-medium hover:scale-90 hover:bg-red-200 transition-all duration-200"
      >
        Got it
      </button>
    </div>
  );
}
