import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Loader";
import { KEY } from "./App";

export function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  watched,
  onSetWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((m) => m.imdbID).includes(selectedMovieId);
  const watchedMovieUserRating = watched.find(
    (m) => m.imdbID === selectedMovieId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Runtime: runtime,
    Genre: genre,
    Actors: actors,
    Plot: plot,
    Poster: poster,
    imdbRating,
    Director: director,
    Released: released,
  } = movie;

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const resp = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
        );
        const data = await resp.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedMovieId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "Movie-Time";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.key === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  function handleAdd() {
    const newMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      userRating: Number(userRating),
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
    };
    onSetWatched(newMovie);
    onCloseMovie();
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of movie ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} Imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated the movie {watchedMovieUserRating} 🌟</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
