import deleteImg from "../assets/delete.png";


export default function SingleCard({ favorite, deleteFavoriteFunction, setSelectedFavorite, }) {
  return (
    <>
      <div className="w-[70%] flex flex-col items-center gap-6 mt-6">
          <div className="w-[100%] h-[70%] flex items-center gap-3">
            <p className="w-[100%] h-[100%] bg-secondary text-white p-2 font-lg rounded-2xl text-center font-semibold text-2xl truncate">
              {favorite}
            </p>
            <img
              src={deleteImg}
              alt="delete icon"
              className="w-[30px] h-[30px]"
              onClick={() => deleteFavoriteFunction(favorite)}
            />
          </div>
          <button
            className="mt-4 p-2 bg-primary text-white rounded"
            onClick={() => setSelectedFavorite(null)}
          >
            Back to Favorites
          </button>
        </div>
    </>
  )
}
