import { useDispatch, useSelector } from "react-redux";
import { deleteUserThunk } from "../store/userReducer";
import { useNavigate } from "react-router-dom";

import profileImg from "../assets/user-profile.gif";

export default function Profile({
  user,
  handleFavoriteRender,
  handleHistoryRender,
}) {

  const history = useSelector((state) => state.history);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const response = await dispatch(deleteUserThunk());
    if (response.success) {
      alert("Account deleted successfully");
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[100%]">
        <p className="text-2xl font-semibold text-red-300">
          Please sign in or create an account.
        </p>
      </div>
    );
  }

  return (
    <>
      {user && (
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
          <img
            src={profileImg}
            alt="user profile icon"
            className="hidden sm:block sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[300px] lg:h-[300px]"
          />

          <div className="w-full flex flex-col justify-center items-center sm:items-start gap-10 text-secondary font-semibold md:font-bold md:text-2xl md:p-10 lg:font-extrabold lg:text-3xl">
            <div className="mt-6">
              <p>Username: {user.email}</p>
              {/* <button>Update email</button> */}
            </div>
            <div className="group relative">
              <p
                onClick={() => handleFavoriteRender()}
                className="cursor-pointer"
              >
                Favorite:{" "}
                <span className="hover:text-red-200 transition-all duration-200">
                  {user.favorite.length} items
                </span>
              </p>
              <span className="absolute hidden top-10 right-0 mb-1 group-hover:block px-2 py-2 text-sm font-normal text-white bg-secondary rounded animate__animated animate__swing">
                Go to Favorite
              </span>
            </div>

            <div className="group relative">
              <p
                onClick={() => handleHistoryRender()}
                className="cursor-pointer"
              >
                History:{" "}
                <span className="hover:text-red-200 transition-all duration-200">
                  {history == null ? "0" : history.length} items
                </span>
              </p>
              <span className="absolute top-10 right-0 mb-1 hidden group-hover:block px-2 py-2 text-sm font-normal text-white bg-secondary rounded animate__animated animate__swing">
                Go to History
              </span>
            </div>

            <button
              className="px-5 py-3 text-sm sm:text-lg lg:text-2xl bg-red-200 rounded self-center md:self-end mt-10 hover:bg-red-400 hover:text-white transition-all duration-150"
              onClick={() => handleDeleteAccount()}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </>
  );
}
