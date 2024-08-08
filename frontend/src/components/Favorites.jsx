import { useDispatch } from "react-redux";
import { deleteUserFavoriteThunk } from "../store/userReducer";

import favoriteImg from "../assets/favorites.gif";
import deleteImg from "../assets/delete.png";
import { useState } from "react";
import SingleCard from "./SingleCard";
import NoUser from "./NoUser";

export default function Favorites({ user }) {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const dispatch = useDispatch();

  const showSingleFavoriteFunction = (favorite) => {
    setSelectedFavorite(favorite);
  };

  const deleteFavoriteFunction = async (item) => {
    await dispatch(deleteUserFavoriteThunk(item ));
  };

  if(!user) {
    return (
      <NoUser />
    );
  }

  if(user.favorite.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-red-300 animate__animated animate__swing">No favorite items yet</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between h-[100%] relative m-4 overflow-hidden">
      <img
        src={favoriteImg}
        alt="favorite icon"
        className="hidden sm:block w-[60px] h-[60px] sticky top-[30px] left-2 -rotate-30 "
      />

      {selectedFavorite ? (
        <SingleCard
          favorite={selectedFavorite}
          deleteFavoriteFunction={deleteFavoriteFunction}
          setSelectedFavorite={setSelectedFavorite}
        />
      ) : (
        <ul className="w-[100%] h-[90%] sm:w-[70%] flex flex-col items-center gap-6 mt-3 overflow-scroll" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {user &&
            user.favorite.map((item) => (
              <li key={item.term} className="w-[100%] flex items-center gap-5">
                <p
                  className="w-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate hover:scale-95 hover:bg-primary transition-all duration-200 cursor-pointer"
                  onClick={() => showSingleFavoriteFunction(item)}
                >
                  {item.term}
                </p>
                <div className="group">
                  <img
                    src={deleteImg}
                    alt="delete icon"
                    className="w-[30px] h-[30px] cursor-pointer"
                    onClick={() => deleteFavoriteFunction(item)}
                  />
                  <span className="absolute mb-1 hidden group-hover:block px-2 py-2 text-xs text-white bg-red-300 rounded animate__animated animate__swing">
                    Remove from Favorite
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}

      <div className="relative h-full hidden sm:block">
        <img
          src={favoriteImg}
          alt="favorite icon"
          className="w-[50px] h-[50px] sticky top-80 rotate-30"
        />
      </div>
    </div>
  );
}
