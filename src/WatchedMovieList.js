import { WatchedMovie } from "./WatchedMovie";

export function WatchedMovieList({ watched, onDeletedWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeletedWatchedMovie={onDeletedWatchedMovie}
        />
      ))}
    </ul>
  );
}
