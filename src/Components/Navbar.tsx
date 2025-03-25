import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";

type TokenData = {
  exp: number;
  iat: number;
  userId: string;
  userType: string;
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logged out successfull");
      window.location.reload();
    } catch (error) {
      toast.error("There was a error logging out");
    }
  };

  useEffect(() => {
    const handleUserType = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response: TokenData = jwtDecode(token);
          setUserType(response?.userType);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleUserType();
  }, []);

  return (
    <nav className="bg-slate-800 text-white shadow-md w-full">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">
              MOVIE<span className="text-sky-400">DB</span>
            </span>
          </div>
          {userType === "Admin" ? (
            <div className="hidden md:flex items-center space-x-8 select-none">
              <a
                className="flex items-center hover:text-sky-400 transition duration-300 cursor-pointer font-semibold"
                onClick={() => navigate("/")}
              >
                {" "}
                Home
              </a>
              <a
                className="flex items-center hover:text-sky-400 transition duration-300 cursor-pointer"
                onClick={() => navigate("/addMovies")}
              >
                {" "}
                Add Movie
              </a>
              <a
                className="flex items-center hover:text-sky-400 transition duration-300 cursor-pointer font-semibold"
                onClick={() => navigate("/editMovies")}
              >
                Update Movies
              </a>
              <a
                className="flex items-center hover:text-sky-400 transition duration-300 cursor-pointer font-semibold"
                onClick={() => navigate("/deleteMovies")}
              >
                Delete Movies
              </a>
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-400 px-3 py-2 cursor-pointer rounded-sm font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8 select-none">
              <button
                onClick={handleLogout}
                className="bg-red-700 hover:bg-red-400 px-3 py-2 cursor-pointer rounded-sm font-semibold"
              >
                Logout
              </button>
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-sky-400 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        {userType === "Admin" ? (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
            <a
              className="flex items-center hover:text-sky-400 transition duration-300"
              onClick={() => {
                navigate("/"), setIsOpen(false);
              }}
            >
              {" "}
              Home
            </a>
            <a
              className="flex items-center hover:text-sky-400 transition duration-300"
              onClick={() => {
                navigate("/addMovies"), setIsOpen(false);
              }}
            >
              {" "}
              Add Movie
            </a>
            <a
              className="flex items-center hover:text-sky-400 transition duration-300"
              onClick={() => {
                navigate("/editMovies"), setIsOpen(false);
              }}
            >
              Update Movies
            </a>
            <a
              className="flex items-center hover:text-sky-400 transition duration-300"
              onClick={() => {
                navigate("/deleteMovies"), setIsOpen(false);
              }}
            >
              Delete Movies
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-400 px-3 py-1 cursor-pointer rounded-sm font-semibold"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-400 px-3 py-1 cursor-pointer rounded-sm font-semibold"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
