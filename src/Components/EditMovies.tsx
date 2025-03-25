import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface Movie {
  name: string;
  coverImage: string;
  director: string;
  rating: number;
  description: string;
  releaseDate: string;
  duration: number;
}

const EditMovie: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [editedMovie, setEditedMovie] = useState<Movie | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3000/movies/getmovie"
        );
        const data: Movie[] = response.data.movies;
        setMovies(data);
      } catch (error) {
        toast.error("Error fetching movies:");
      }
    };

    fetchMovies();
  }, []);

  const handleEditClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditedMovie({ ...movie });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedMovie) {
      setEditedMovie((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  const handleUpdateMovie = async () => {
    if (!editedMovie) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:3000/movies/updatemovie/${editedMovie.name}`,
        {
          director: editedMovie.director,
          rating: editedMovie.rating,
          description: editedMovie.description,
          duration: editedMovie.duration,
        }
      );

      if (response.status === 200) {
        const updatedMovies = movies.map((movie) =>
          movie.name === editedMovie.name ? editedMovie : movie
        );
        setMovies(updatedMovies);
        setIsEditing(false);
        setSelectedMovie(null);
        toast.success("Movie updated successfully!");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error("Failed to update movie");
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
                onClick={() => handleEditClick(movie)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
        {isEditing && selectedMovie && editedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto p-6 space-y-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Edit Movie
                </h1>
                <p className="text-gray-600 mb-4">{editedMovie.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Director
                  </label>
                  <input
                    type="text"
                    name="director"
                    value={editedMovie.director || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    value={editedMovie.rating || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editedMovie.description || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Duration
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={editedMovie.duration || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateMovie}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    Update Movie
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditMovie;
