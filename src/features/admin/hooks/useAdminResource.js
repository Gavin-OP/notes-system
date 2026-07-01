import { useEffect, useState } from "react";

import { AdminApiError } from "../api/client";

export default function useAdminResource(loader) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setState((current) => ({
        ...current,
        loading: true,
        error: null,
      }));

      try {
        const data = await loader();
        if (isActive) {
          setState({
            loading: false,
            error: null,
            data,
          });
        }
      } catch (error) {
        const message =
          error instanceof AdminApiError && error.status === 401
            ? "Your session has expired. Please sign in again."
            : error instanceof Error
              ? error.message
              : "Failed to load data.";
        if (isActive) {
          setState({
            loading: false,
            error: message,
            data: null,
          });
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [loader]);

  return state;
}
