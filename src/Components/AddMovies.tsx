import { FormEvent, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

type Movie = {
  name: string;
  director: string;
  rating: number;
  description: string;
  releaseDate: string;
  duration: number;
};

const AddMovie = () => {

  const [movie, setMovie] = useState<Movie>({
    name: "",
    director: "",
    rating: 0,
    description: "",
    releaseDate: "",
    duration: 0,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setCoverImage(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !movie.name ||
      !movie.director ||
      !movie.rating ||
      !movie.description ||
      !movie.releaseDate ||
      !movie.duration
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (!coverImage) {
      toast.error("Cover image is required!");
      return;
    }

    if (isNaN(movie.duration) || movie.duration <= 0) {
      toast.error("Duration must be a positive number!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', movie.name);
    formData.append('director', movie.director);
    formData.append('rating', movie.rating.toString());
    formData.append('description', movie.description);
    formData.append('releaseDate', movie.releaseDate);
    formData.append('duration', movie.duration.toString());
    formData.append('coverImage', coverImage);

    try {
      const response = await axios.post(
        'https://top-movies-backend.vercel.app/movies/addmovie',
        formData
      );

      if (response.status === 400) {
        throw new Error('Failed to add movie');
      }

      toast.success('Movie added successfully!');

      setMovie({
        name: '',
        director: '',
        rating: 0,
        description: '',
        releaseDate: '',
        duration: 0,
      });
      setCoverImage(null);
      setPreviewUrl('');
    } catch (err) {
      toast.error('Error adding movie: ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 py-12 bg-white rounded-lg shadow-md ">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Movie</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Movie Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={movie.name}
              onChange={(e) => setMovie({ ...movie, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie name"
            />
          </div>

          <div>
            <label
              htmlFor="director"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Director *
            </label>
            <input
              type="text"
              id="director"
              name="director"
              value={movie.director}
              onChange={(e) =>
                setMovie({ ...movie, director: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter director name"
            />
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rating *
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              value={movie.rating}
              onChange={(e) =>
                setMovie({ ...movie, rating: parseFloat(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Release Date *
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={movie.releaseDate}
              onChange={(e) =>
                setMovie({ ...movie, releaseDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={movie.duration}
              onChange={(e) =>
                setMovie({ ...movie, duration: parseInt(e.target.value) })
              }
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter duration in minutes"
            />
          </div>

          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Image *
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={movie.description}
            onChange={(e) =>
              setMovie({ ...movie, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter movie description"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center cursor-pointer"
          >
            Add Movie
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default AddMovie;