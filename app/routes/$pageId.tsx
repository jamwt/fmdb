import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import MovieDetail from "../components/MovieDetail";
import { ChoosePage } from "../components/PageChooser";
import MoviePage from "../components/MoviePage";
import AutocompleteSearch from "../components/search";
import { Suggestion } from "../../convex/movies";

const ITEMS_PER_PAGE = 10;

export const Route = createFileRoute("/$pageId")({
  component: Home,
  loader: async ({ params }) => {
    const pageRaw = Number(params.pageId);
    const pageNum = isNaN(pageRaw) ? 1 : pageRaw;
    return {
      pageNum,
    };
  },
});

function Home() {
  const { pageNum } = Route.useLoaderData();
  const router = useRouter();
  const { data: numberOfMovies } = useSuspenseQuery(
    convexQuery(api.movies.getMovieCount, {})
  );

  const handleSuggestionClick = async (s: Suggestion) => {
    const page = Math.floor(s.position / ITEMS_PER_PAGE) + 1;
    router.navigate({
      to: "/$pageId",
      params: { pageId: page.toString() },
    });
  };

  return (
    <div className="min-h-screen bg-indigo-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/fancy-head.png"
          alt="Fancy Movie Database"
          className="w-64"
        />
        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 font-script leading-tight mb-1">
          The Fancy Movie Database
        </div>
        <div>
          <AutocompleteSearch handleSuggestionClick={handleSuggestionClick}/>
        </div>
      </div>
      <div>
        <MoviePage pageNum={pageNum} itemsPerPage={ITEMS_PER_PAGE} />
      </div>
      <div>
        <ChoosePage
          totalItems={numberOfMovies}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={pageNum}
          onPageChange={(page) => {
            router.navigate({
              to: "/$pageId",
              params: { pageId: page.toString() },
            });
          }}
        />
      </div>
    </div>
  );
}
