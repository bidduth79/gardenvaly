/**
 * @file videoUtils.ts
 * @description Centralized video parsing and embedding utilities for Gardenvaly hero section.
 * Supports direct video URLs (MP4, WebM, Ogg, data URLs) and YouTube embeds with zero audio leaks.
 */

/**
 * Extracts and formats YouTube embed URL with autoplay, mute, and loop parameters.
 * Muting is mandatory for autoplay on modern browsers.
 */
export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  }

  return null;
}

/**
 * Determines whether a URL points to a direct video file or data URI.
 */
export function isDirectVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.startsWith('data:video/') ||
    lower.startsWith('blob:') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(lower)
  );
}

/**
 * Determines whether a hero slide should be rendered as a video.
 */
export function isVideoSlide(slide?: { videoUrl?: string; mediaType?: string; imageUrl?: string } | null): boolean {
  if (!slide) return false;
  if (slide.mediaType === 'video' && slide.videoUrl && slide.videoUrl.trim().length > 0) {
    return true;
  }
  return Boolean(slide.videoUrl && slide.videoUrl.trim().length > 0);
}
