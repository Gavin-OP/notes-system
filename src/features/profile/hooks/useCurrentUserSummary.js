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

export default function useCurrentUserSummary({ disabled = false } = {}) {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(disabled ? "anonymous" : "loading");

  useEffect(() => {
    if (disabled) {
      return undefined;
    }
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
  }, [disabled]);

  const displayName = useMemo(() => pickDisplayName(profile), [profile]);

  return {
    displayName,
    isAuthenticated: !disabled && status === "authenticated",
    profile,
    status: disabled ? "anonymous" : status,
  };
}
