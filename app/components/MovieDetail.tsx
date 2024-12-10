import React from "react";
import { api } from "../../convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

interface MovieProps {
  tid: string;
  title: string;
  year: string;
  length: string;
}

const MovieDetail: React.FC<MovieProps> = ({ tid, title, year, length }) => {
  const { data: dbUrl } = useSuspenseQuery(
    convexQuery(api.movies.getMovieImage, { tid })
  );
  const coverImage = dbUrl ?? "/generic-movie.jpg";
  return (
    <li className="flex items-center space-x-4 m-4 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-102">
      <div className="relative w-16 h-24 flex-shrink-0">
        <div className="absolute inset-0 bg-gold-leaf opacity-50 blur-sm rounded"></div>
        <img
          src={coverImage}
          alt={`${title} cover`}
          width={64}
          height={96}
          className="rounded relative z-10 object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 font-script leading-tight mb-1">
          {title}
        </h3>
        <div className="flex space-x-2 text-md text-gold-leaf">
          <span>©{year}</span>
          <span>•</span>
          <span>{length} minutes</span>
        </div>
      </div>
    </li>
  );
};

export default MovieDetail;
