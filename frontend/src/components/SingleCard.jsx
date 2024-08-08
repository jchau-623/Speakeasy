import deleteImg from "../assets/delete.png";


export default function SingleCard({ favorite, deleteFavoriteFunction, setSelectedFavorite, }) {

  // console.log("favorite in single card", favorite);
  
  return (
    <>
      <div className="w-[80%] flex flex-col items-center gap-3 mt-6">
          <div className="w-[100%] h-[75%] flex items-center gap-3">
            <p className="w-[100%] h-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate">
              {favorite.id}
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
            
          </div>
          <button
            className="mt-4 p-2 bg-primary text-white rounded "
            onClick={() => setSelectedFavorite(null)}
          >
            Back to Favorites
          </button>
        </div>
    </>
  )
}
