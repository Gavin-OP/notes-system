import { useEffect, useMemo, useState } from "react";

import { getMyProfile, UserApiError } from "../api/user";

function pickDisplayName(profile) {
  return (
    profile?.displayName ||
    profile?.display_name ||
    profile?.name ||
    profile?.full_name ||
    profile?.email ||
    ""
  );
}

export default function useCurrentUserSummary() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const payload = await getMyProfile();
        if (!mounted) return;
        setProfile(payload || null);
        setStatus("authenticated");
      } catch (error) {
        if (!mounted) return;
        setProfile(null);
        setStatus(error instanceof UserApiError && error.status === 401 ? "anonymous" : "unavailable");
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const displayName = useMemo(() => pickDisplayName(profile), [profile]);

  return {
    displayName,
    isAuthenticated: status === "authenticated",
    profile,
    status,
  };
}
