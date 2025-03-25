import { useState, useEffect, useMemo, useCallback } from "react";

export type Movies = {
  _id: string;
  name: string;
  coverImage: string;
  director: string;
  rating: number;
  description: string;
  releaseDate: string;
  duration: number;
};

const Home = () => {
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("https://top-movies-backend.vercel.app/movies/getmovie");
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.movies);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const debouncedFilteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    
    return movies.filter((movie) => 
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const MovieCard = ({ movie }: { movie: Movies }) => {
    const {
      name,
      coverImage,
      director,
      rating,
      description,
      releaseDate,
      duration,
    } = movie;

    const imageSrc = coverImage || "/api/placeholder/300/450";

    return (
      <div className="relative overflow-hidden rounded-lg shadow-lg bg-white group h-96 ">
        <div className="relative h-full">
          <div className="h-full w-full bg-gray-200">
            <img
              src={`http://localhost:3000/${imageSrc}`}
              alt={name}
              className="w-full object-cover max-h-[500px]"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white cursor-pointer">
            <div>
              <h2 className="text-xl font-bold mb-2">{name}</h2>
              <p className="text-sm mb-1">Director: {director}</p>
              <div className="flex items-center mb-3">
                <span>⭐ {rating}/10</span>
              </div>
              <p className="text-sm overflow-y-auto max-h-40">{description}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
            <h2 className="text-lg font-bold truncate">{name}</h2>
            <div className="flex items-center">
              <span>⭐ {rating}/10</span>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-70 px-2 py-1 rounded">
            <p>{releaseDate}</p>
            <p>{duration} min</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading movies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="mb-8 flex justify-center margin">
        <input 
          type="text" 
          placeholder="Search movies..." 
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-[80vw] max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-center">
        {searchTerm ? `Search Results for "${searchTerm}"` : "Top Movies"}
      </h1>
      
      {debouncedFilteredMovies.length === 0 ? (
        <div className="text-center text-gray-500">
          No movies found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-[95vw] mx-auto">
          {debouncedFilteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;