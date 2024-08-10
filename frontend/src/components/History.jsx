import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserHistory, removeHistoryItem } from '../store/historyReducer';

import historyImg from '../assets/book.gif';
import deleteImg from '../assets/delete.png';
import bookMarkImg from '../assets/bookmark.gif';
import FavoriteImg from '../assets/favorites.gif';
import SingleCard from './SingleCard';

const History = ({ addToFavoriteFunction, removeFromFavorite, user }) => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const dispatch = useDispatch();
  const userId = user ? user.id : null;
  const history = useSelector((state) => state.history);

  useEffect(() => {
    if (userId) {
      dispatch(getUserHistory(userId));
    }
  }, [dispatch, userId]);

  // Debugging: Ensure that history data is being retrieved correctly
  console.log("History data:", history);

  const showSingleHistoryFunction = (item) => {
    setSelectedHistoryItem(item);
  };

  const deleteHistoryFunction = async (item) => {
    console.log('Attempting to delete item:', item);

    if (!item || !item._id) {
      console.error('Item ID is undefined');
      alert('Item ID is missing or invalid.');
      return;
    }

    if (!userId) {
      console.error('User is not authenticated');
      alert('User is not authenticated.');
      return;
    }

    try {
      await dispatch(removeHistoryItem(item._id, userId));
      setSelectedHistoryItem(null);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-red-300 animate__animated animate__swing">
          No history items yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-between h-[100%] relative m-4 overflow-hidden">
      <img
        src={historyImg}
        alt="history icon"
        className="hidden sm:block w-[60px] h-[60px] sticky top-[30px] left-2 -rotate-30"
      />

      {selectedHistoryItem ? (
        <SingleCard
          favorite={selectedHistoryItem}
          deleteFavoriteFunction={deleteHistoryFunction}
          setSelectedFavorite={setSelectedHistoryItem}
        />
      ) : (
        <ul
          className="w-[100%] h-[90%] sm:w-[70%] flex flex-col items-center gap-6 mt-3 overflow-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {history && history.map((item) => {
            // Debugging: Ensure each item is being iterated and rendered
            console.log("Rendering item:", item);

            const isFavorite = user.favorite.find(
              (favorite) => favorite.term === item.term
            );

            return (
              <li key={item._id} className="w-[100%] flex items-center gap-5">
                <p
                  className="w-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate hover:scale-95 hover:bg-primary transition-all duration-200 cursor-pointer"
                  onClick={() => showSingleHistoryFunction(item)}
                >
                  {item.term || item.idiom}  {/* Ensuring display of term or idiom */}
                </p>
                <div className="group relative">
                  {isFavorite ? (
                    <img
                      src={FavoriteImg}
                      alt="favorite icon"
                      className="w-[30px] h-[30px] cursor-pointer rotate-30"
                      onClick={() => removeFromFavorite(item)}
                    />
                  ) : (
                    <img
                      src={bookMarkImg}
                      alt="add to favorite icon"
                      className="w-[30px] h-[30px] cursor-pointer rotate-30"
                      onClick={() => addToFavoriteFunction(item)}
                    />
                  )}
                  <span className="absolute hidden mb-1 group-hover:block px-2 py-2 text-xs text-white bg-secondary rounded animate__animated animate__swing">
                    {isFavorite ? "Remove from favorite" : "Add to favorite"}
                  </span>
                </div>
                <div className="group">
                  <img
                    src={deleteImg}
                    alt="delete icon"
                    className="w-[30px] h-[30px] cursor-pointer"
                    onClick={() => deleteHistoryFunction(item)}
                  />
                  <span className="absolute mb-1 hidden group-hover:block px-2 py-2 text-xs text-white bg-red-300 rounded animate__animated animate__swing">
                    Remove from History
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="relative h-full hidden sm:block">
        <img
          src={historyImg}
          alt="history icon"
          className="w-[50px] h-[50px] sticky top-80 rotate-30"
        />
      </div>
    </div>
  );
};

export default History;
