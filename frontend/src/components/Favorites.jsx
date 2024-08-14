import { useDispatch } from "react-redux";
import { deleteUserFavoriteThunk } from "../store/userReducer";

import favoriteImg from "../assets/favorites.gif";
import deleteImg from "../assets/delete.png";
import { useState } from "react";
import SingleCard from "./SingleCard";
import bookmarkImg from "../assets/bookmark.gif";

export default function Favorites({ user }) {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState(null);
  const dispatch = useDispatch();

  const showSingleFavoriteFunction = (favorite) => {
    setSelectedFavorite(favorite);
  };

  const deleteFavoriteFunction = async (item) => {
    await dispatch(deleteUserFavoriteThunk(item));
  };

  if (user.favorite.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-red-300 animate__animated animate__swing">
          No favorite items yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[100%] gap-10 xl:gap-20 relative m-4 overflow-hidden">
      {!selectedFavorite && (
        <img
        src={bookmarkImg}
        alt="favorite icon"
        className="hidden lg:block lg:w-[100px] lg:h-[100px] sticky top-[2px] -rotate-30 xl:w-[150px] xl:h-[150px]"
      />
      )}
      

      {selectedFavorite ? (
        <SingleCard
          favorite={selectedFavorite}
          deleteFavoriteFunction={deleteFavoriteFunction}
          setSelectedFavorite={setSelectedFavorite}
          context="favorites"
        />
      ) : (
        <ul
          className="w-[100%] h-[90%] pr-8 flex flex-col items-center gap-6 mt-3 overflow-scroll relative animate__animated animate__fadeInUp"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {user &&
            user.favorite.map((item) => (
              <li
                key={item.term ? item.term : item.idiom}
                className="w-[100%] flex items-center gap-5 lg:gap-10 relative"
              >
                <p
                  className="w-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate hover:scale-95 hover:bg-primary transition-all duration-200 cursor-pointer"
                  onClick={() => showSingleFavoriteFunction(item)}
                >
                  {item.term ? item.term : item.idiom}
                </p>
                <div className="flex relative">
                  <img
                    src={deleteImg}
                    alt="delete icon"
                    className="w-[30px] h-[30px] cursor-pointer hover:scale-125 transition-all duration-200"
                    onClick={() => deleteFavoriteFunction(item)}
                    onMouseEnter={() => setFavoriteItem(item)}
                    onMouseLeave={() => setFavoriteItem(null)}
                  />
                  {favoriteItem === item && (
                    <div className="absolute text-center w-[200px] top-0 -left-52 z-20 mb-1 px-2 py-2 text-sm text-white bg-red-300 rounded animate__animated animate__swing">
                      Remove from favorites
                    </div>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
      {/* {!selectedFavorite && (
        <div className="relative h-full hidden md:block">
        <img
          src={favoriteImg}
          alt="favorite icon"
          className="w-[50px] h-[50px] sticky top-80 rotate-30"
        />
      </div>
      )} */}
      
    </div>
  );
}
