import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { SearchBar } from "./SearchBar";
import { Logo } from "./Logo";
import { NumResults } from "./NumResults";
import { Box } from "./Box";
import { MovieList } from "./MovieList";
import { WatchedMovieList } from "./WatchedMovieList";
import { WatchedSummary } from "./WatchedSummary";
import { Main } from "./Main";
import { NavBar } from "./NavBar";
import { MovieDetails } from "./MovieDetails";
export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "4bbdac61";

export default function App() {
  // {children} => enables component composition which help in overcoming prop drilling.
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(movieID) {
    setSelectedId((selectedId) => (movieID === selectedId ? null : movieID));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched.filter((m) => m.imdbID != id));
  }

  // only run when the component is mounted.
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const resp = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!resp.ok) throw new Error("Something went wrong fetching movies");

          const data = await resp.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} onSetQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedMovieId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
              onSetWatched={handleWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeletedWatchedMovie={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
