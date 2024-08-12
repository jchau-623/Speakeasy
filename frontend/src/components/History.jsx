import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addUserFavoriteThunk,
  deleteUserFavoriteThunk,
  deleteUserHistoryThunk,
} from "../store/userReducer";
import SingleCard from "./SingleCard";

import historyImg from "../assets/history.gif";
import bookMarkImg from "../assets/bookmark.gif";
import FavoriteImg from "../assets/favorites.gif";
import deleteImg from "../assets/delete.png";

const History = ({ user }) => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [favoriteItem, setFavoriteItem] = useState(null);
  const [historyItem, setHistoryItem] = useState(null);

  const dispatch = useDispatch();

  const showSingleHistoryFunction = (item) => {
    setSelectedHistoryItem(item);
  };

  const deleteHistoryFunction = async (item) => {
    try {
      await dispatch(
        deleteUserHistoryThunk(item.term ? item.term : item.idiom)
      );
      setSelectedHistoryItem(null);
      setHistoryItem(null);
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  };

  async function addToFavoriteFunction(item) {
    await dispatch(addUserFavoriteThunk(item));
    setFavoriteItem(null);
  }

  async function deleteFavoriteFunction(item) {
    await dispatch(deleteUserFavoriteThunk(item));
    setFavoriteItem(null);
  }

  if (user.history.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-red-300 animate__animated animate__swing">
          No history items yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[100%] gap-10 relative m-4 overflow-hidden">
      {!selectedHistoryItem && (
        <img
          src={historyImg}
          alt="history icon"
          className="hidden sm:block w-[60px] h-[60px] md:w-[120px] md:h-[120px] sticky top-[2px] left-2 -rotate-30"
        />
      )}

      {selectedHistoryItem ? (
        <SingleCard
          favorite={selectedHistoryItem}
          deleteFavoriteFunction={deleteHistoryFunction}
          setSelectedFavorite={setSelectedHistoryItem}
          context="history"
        />
      ) : (
        <ul
          className="w-[100%] h-[90%] sm:w-[70%] flex flex-col items-center gap-6 mt-3 overflow-scroll mr-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {user.history.map((item) => {
            return (
              <li
                key={item._id}
                className="w-[100%] flex items-center gap-5 relative"
              >
                <p
                  className="w-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate hover:scale-95 hover:bg-primary transition-all duration-200 cursor-pointer"
                  onClick={() => showSingleHistoryFunction(item)}
                >
                  {item.term || item.idiom}
                </p>
                <div className="relative cursor-pointer">
                  {user.favorite.find(
                    (favorite) => favorite._id === item._id
                  ) ? (
                    <div className="flex relative">
                      <img
                        src={FavoriteImg}
                        alt="favorite icon"
                        className={`w-[40px] h-[40px] cursor-pointer rotate-30 hover:scale-125 transition-all duration-200`}
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
                  ) : (
                    <div className="flex relative">
                      <img
                        src={bookMarkImg}
                        alt="add to favorite icon"
                        className="w-[40px] h-[40px] cursor-pointer rotate-30 hover:scale-125 transition-all duration-200"
                        onClick={() => addToFavoriteFunction(item)}
                        onMouseEnter={() => setFavoriteItem(item)}
                        onMouseLeave={() => setFavoriteItem(null)}
                      />
                      {favoriteItem === item && (
                        <div className="absolute text-center w-[130px] top-0 -left-36 z-20 mb-1 px-2 py-2 text-sm text-white bg-red-300 rounded animate__animated animate__swing">
                          Add to favorites
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex relative">
                  <img
                    src={deleteImg}
                    alt="delete icon"
                    className="w-[35px] h-[35px] cursor-pointer hover:scale-125 transition-all duration-200"
                    onClick={() => deleteHistoryFunction(item)}
                    onMouseEnter={() => setHistoryItem(item)}
                    onMouseLeave={() => setHistoryItem(null)}
                  />
                  {historyItem === item && (
                    <div className="absolute text-center w-[200px] top-0 -left-52 z-20 mb-1 px-2 py-2 text-sm text-white bg-red-300 rounded animate__animated animate__swing">
                      Remove from History
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default History;
