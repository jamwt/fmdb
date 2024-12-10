import { convexQuery } from "@convex-dev/react-query";
import React from "react";
import { api } from "../../convex/_generated/api";
import MovieDetail from "./MovieDetail";
import { useSuspenseQuery } from "@tanstack/react-query";

interface MoviePageProps {
  pageNum: number;
  itemsPerPage: number;
}

const MoviePage: React.FC<MoviePageProps> = ({ pageNum, itemsPerPage }) => {
  const { data: movies } = useSuspenseQuery(
    convexQuery(api.movies.pageOfMovies, {
      start: (pageNum - 1) * itemsPerPage,
      count: itemsPerPage,
    })
  );
  return (
    <div>
      <ul>
        {movies.map((movie) => (
          <MovieDetail
            key={movie._id}
            tid={movie.tid}
            title={movie.title?.toString() ?? ""}
            year={movie.fancyYear}
            length={movie.runtime.toString() ?? ""}
          />
        ))}
      </ul>
    </div>
  );
};

export default MoviePage;
