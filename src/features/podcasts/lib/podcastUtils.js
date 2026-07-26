export function formatPodcastDuration(durationMs = 0) {
  const totalSeconds = Math.max(0, Math.round(Number(durationMs || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function podcastProgress(episode) {
  const duration = Number(episode?.duration_ms || 0);
  const position = Number(episode?.playback?.position_ms || 0);
  if (!duration) return 0;
  return Math.min(100, Math.round((position / duration) * 100));
}
