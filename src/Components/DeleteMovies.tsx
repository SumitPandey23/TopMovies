import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

interface Movie {
  name: string;
  coverImage: string;
  director: string;
  rating: number;
  description: string;
  releaseDate: string;
  duration: number;
}

const DeleteMovie: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [deleteMovie, setDeleteMovie] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3000/movies/getmovie"
        );
        const data: Movie[] = response.data.movies;
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies");
      }
    };

    fetchMovies();
  }, []);

  const handleDeleteClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setDeleteMovie({ ...movie });
    setIsDeleting(true);
  };

  const handleDeleteMovie = async () => {
    if (!deleteMovie) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `http://127.0.0.1:3000/movies/deletemovie/${deleteMovie.name}`
      );

      if (response.status === 200) {
        setMovies(movies.filter((movie) => movie.name !== deleteMovie.name));
        setIsDeleting(false);
        setSelectedMovie(null);
        setDeleteMovie(null);
        toast.success("Movie Deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting movie:");
      setError("Failed to delete movie");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 bg-gray-50 border-b">
            <h1 className="text-xl font-bold text-gray-800">Movie List</h1>
          </div>
          {movies.map((movie) => (
            <div
              key={movie.name}
              className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-800 font-medium">{movie.name}</span>
              <button
                onClick={() => handleDeleteClick(movie)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {isDeleting && selectedMovie && deleteMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6 space-y-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Delete Movie
                </h1>
                <p className="text-gray-600 mb-4">{deleteMovie.name}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteMovie}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    Delete Movie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default DeleteMovie;
