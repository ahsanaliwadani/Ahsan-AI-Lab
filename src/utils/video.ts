/**
 * Helper utility to parse video URLs (YouTube, Vimeo, Loom, Direct Video, Uploaded Files)
 */

export interface ParsedVideoInfo {
  type: 'youtube' | 'vimeo' | 'loom' | 'direct' | 'iframe' | 'none';
  embedUrl?: string;
  directSrc?: string;
}

export function parseVideoUrl(url?: string): ParsedVideoInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none' };
  }

  const cleanUrl = url.trim();

  // 1. YouTube
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`
    };
  }

  // 2. Vimeo
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|))(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0`
    };
  }

  // 3. Loom
  const loomMatch = cleanUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`
    };
  }

  // 4. Direct video files or local uploads (e.g. /uploads/video.mp4, blob:, data:video/, .mp4, .webm, .mov)
  const isDirectVideo = 
    cleanUrl.startsWith('/uploads/') ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('data:video/') ||
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(cleanUrl);

  if (isDirectVideo) {
    return {
      type: 'direct',
      directSrc: cleanUrl
    };
  }

  // 5. Generic embed or iframe
  if (cleanUrl.includes('embed') || cleanUrl.includes('player')) {
    return {
      type: 'iframe',
      embedUrl: cleanUrl
    };
  }

  // 6. Default fallback to direct video if valid URL
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('/')) {
    return {
      type: 'direct',
      directSrc: cleanUrl
    };
  }

  return { type: 'none' };
}
