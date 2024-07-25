import chatBotImg from "../assets/chat-bot.gif";
import bookMarkImg from "../assets/bookmark.gif";
import FavoriteImg from "../assets/favorites.gif";
import { useState } from "react";

export default function Result({ handleShowResult }) {
  const [favorite, setFavorite] = useState(false);

  function addToFavorite() {
    setFavorite(true);
  }

  function removeFromFavorite() {   
    setFavorite(false);
  }

  return (
    <div className="flex flex-col w-full h-full animate__animated animate__fadeInRight">
      <div className="flex gap-5 h-[80%] w-full">
        <img
          src={chatBotImg}
          alt="chat bot icon"
          className="hidden sm:block sm:w-[50px] sm:h-[50px] md:w-[100px] md:h-[100px]"
        />
        <div className="sm:relative top-10 -left-6 p-5 w-full sm:w-[90%] h-[90%] md:h-[80%] rounded-xl border-4 border-secondary">
          <div className="flex justify-between w-full">
            <h1>Result</h1>
            <div className="relative group">
              {favorite ? (
                <img
                  src={FavoriteImg}
                  alt="favorite icon"
                  className="w-[30px] h-[30px] cursor-pointer rotate-30"
                  onClick={removeFromFavorite}
                />
              ) : (
                <img
                  src={bookMarkImg}
                  alt="add to favorite icon"
                  className="w-[30px] h-[30px] cursor-pointer rotate-30"
                  onClick={addToFavorite}
                />

                
              )}

              <span className="absolute mb-1 hidden group-hover:block px-2 py-2 text-xs text-white bg-secondary rounded animate__animated animate__swing">
                {favorite ?  "Remove from Favorite" : "Add to Favorite"}
              </span>
            </div>
          </div>
          <p>
            Definition: A result is the outcome of an event or situation,
            especially when it is considered to be the most important aspect.
          </p>
          <p>
            Example: The result of the test was positive, so I am going to the
            hospital for a check-up.
          </p>
        </div>
      </div>
      <button
        onClick={() => handleShowResult(false)}
        className="flex justify-center self-end p-2 sm:p-3 text-xs sm:text-base bg-secondary w-fit sm:w-[10%] rounded-full z-10 text-white font-medium"
      >
        Got it
      </button>
    </div>
  );
}