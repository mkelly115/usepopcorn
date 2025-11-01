import { useState, useEffect, useRef } from "react";

const KEY = process.env.REACT_APP_IMDB_API_KEY;

export function useMovies(query, { debounceMs = 500 } = {}) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef(null);
  const lastRequestId = useRef(0);

  useEffect(() => {
    if (!query || query.length < 3) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setMovies([]);
      setError("");
      setIsLoading(false);
      return;
    }

    clearTimeout(timerRef.current);

    const controller = new AbortController();

    timerRef.current = setTimeout(async () => {
      const requestId = ++lastRequestId.current;
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies :(");

        const data = await res.json();

        if (data.Response === "false")
          throw new Error(data.Error || "Movie not found");

        if (requestId === lastRequestId.current) {
          setMovies(data.Search || []);
          setError("");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          if (requestId === lastRequestId.current) {
            setError(err.message || "Unknown error");
            setMovies([]);
          }
        }
      } finally {
        if (requestId === lastRequestId.current) setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      controller.abort();
    };
  }, [query, debounceMs]);

  return { movies, isLoading, error };
}
