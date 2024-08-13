import deleteImg from "../assets/delete.png";

export default function SingleCard({
  favorite,
  deleteFavoriteFunction,
  setSelectedFavorite,
  context
}) {

  function handleDeleteSingleCard(favorite) {
    deleteFavoriteFunction(favorite);
    setSelectedFavorite(null);
  }

  return (
    <>
      <div className="w-full flex flex-col items-center gap-3 mt-4 lg:p-6">
        <div className="w-[100%] h-[80%] flex items-center gap-3 lg:gap-10 ">
          <div
            className="flex flex-col gap-5 w-[100%] h-[100%] p-5 bg-secondary rounded-2xl text-white font-lg  overflow-scroll relative"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <h3 className="text-center font-semibold text-3xl text-wrap">
              {favorite.term ? favorite.term : favorite.idiom}
            </h3>
            <p className="text-xl font-medium">
              Meaning :{" "}
              <span className="text-lg font-normal leading-normal">
                {favorite.meaning}
              </span>
            </p>
            <p className="text-xl font-medium">
              Origin: <span className="text-lg font-normal leading-normal">{favorite.origin}</span>
            </p>
            <p className="text-xl font-medium">
              Example: <span className="text-lg font-normal leading-normal">{favorite.exampleUse}</span>
            </p>
            <p className="text-xl font-medium">
              Equivalent: <span className="text-lg font-normal leading-normal">{favorite.equivalentInLanguage}</span>
            </p>
          </div>

          <div className="group self-end">
            <img
              src={deleteImg}
              alt="delete icon"
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={() => handleDeleteSingleCard(favorite)}
            />
            <span className="absolute right-1 hidden group-hover:block px-2 py-2 text-xs text-white bg-red-300 rounded animate__animated animate__swing z-10">
              Remove from list
            </span>
          </div>
        </div>
        <button
          className="mt-4 p-2 bg-primary text-white text-lg font-semibold rounded hover:scale-90 hover:bg-red-200 transition-all duration-200"
          onClick={() => setSelectedFavorite(null)}
        >
          Back to {context === "history" ? "History" : "Favorites"}
        </button>
      </div>
    </>
  );
}
