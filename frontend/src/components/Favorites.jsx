import { useDispatch } from "react-redux";
import { deleteUserFavoriteThunk } from "../store/userReducer";

import favoriteImg from "../assets/favorites.gif";
import deleteImg from "../assets/delete.png";
import { useState } from "react";
import SingleCard from "./SingleCard";

export default function Favorites({ user }) {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const dispatch = useDispatch();

  const showSingleFavoriteFunction = (favorite) => {
    setSelectedFavorite(favorite);
  };

  const deleteFavoriteFunction = async (item) => {
    await dispatch(deleteUserFavoriteThunk({ item }));
  };

  if(!user) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-secondary">Please sign in or create an account.</p>
      </div>
    );
  }

  if(user.favorite.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-secondary">No favorite items yet</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between h-[100%] relative m-4">
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
        <ul className="w-[100%] sm:w-[70%] flex flex-col items-center gap-6 mt-6 overflow-hidden">
          {user &&
            user.favorite.map((favorite) => (
              <li key={favorite} className="w-[100%] flex items-center gap-3">
                <p
                  className="w-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate"
                  onClick={() => showSingleFavoriteFunction(favorite)}
                >
                  {favorite}
                </p>
                <div className="group">
                  <img
                    src={deleteImg}
                    alt="delete icon"
                    className="w-[30px] h-[30px] cursor-pointer"
                    onClick={() => deleteFavoriteFunction(favorite)}
                  />
                  <span className="absolute mb-1 hidden group-hover:block px-2 py-2 text-xs text-white bg-secondary rounded animate__animated animate__swing">
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
