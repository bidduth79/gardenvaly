/**
 * @file heroVideo.test.ts
 * @description Automated tests for Gardenvaly hero section video banner support and slide integrity.
 */

import { getYouTubeEmbedUrl, isDirectVideoUrl, isVideoSlide } from '../src/utils/videoUtils';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

console.log('\n🎬 Running Gardenvaly Hero Video & Slide Automated Tests...\n');

// Suite 1: YouTube Embed URL Parser
console.log('--- Suite 1: YouTube Embed URL Generation ---');
const standardYt = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const shortYt = 'https://youtu.be/dQw4w9WgXcQ';
const embedYt = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

const parsedStandard = getYouTubeEmbedUrl(standardYt);
assert(
  parsedStandard !== null && parsedStandard.includes('dQw4w9WgXcQ') && parsedStandard.includes('autoplay=1') && parsedStandard.includes('mute=1'),
  'Standard YouTube watch URL converts to muted autoplay embed URL'
);

const parsedShort = getYouTubeEmbedUrl(shortYt);
assert(
  parsedShort !== null && parsedShort.includes('dQw4w9WgXcQ'),
  'Short youtu.be URL converts to embed URL'
);

const parsedEmbed = getYouTubeEmbedUrl(embedYt);
assert(
  parsedEmbed !== null && parsedEmbed.includes('dQw4w9WgXcQ'),
  'Existing embed URL is normalized'
);

assert(
  getYouTubeEmbedUrl(undefined) === null && getYouTubeEmbedUrl('') === null && getYouTubeEmbedUrl('https://example.com/video.mp4') === null,
  'Non-YouTube URLs return null safely'
);

// Suite 2: Direct Video URL Detection
console.log('\n--- Suite 2: Direct Video URL Detection ---');
assert(
  isDirectVideoUrl('https://example.com/video.mp4') === true,
  'MP4 URL is recognized as direct video'
);
assert(
  isDirectVideoUrl('https://example.com/video.webm') === true,
  'WebM URL is recognized as direct video'
);
assert(
  isDirectVideoUrl('data:video/mp4;base64,AAAA...') === true,
  'data:video URI is recognized as direct video'
);
assert(
  isDirectVideoUrl('https://images.unsplash.com/photo-1526047932273-341f2a7631f9.jpg') === false,
  'Image URL is not classified as video'
);

// Suite 3: Video Slide Classification
console.log('\n--- Suite 3: Hero Slide Video Classification ---');
assert(
  isVideoSlide({ videoUrl: 'https://example.com/garden.mp4' }) === true,
  'Slide with videoUrl is classified as video slide'
);
assert(
  isVideoSlide({ mediaType: 'video', videoUrl: 'https://youtu.be/abc12345678' }) === true,
  'Slide with mediaType video and videoUrl is classified as video slide'
);
assert(
  isVideoSlide({ imageUrl: 'https://example.com/photo.jpg' }) === false,
  'Slide without videoUrl is classified as image slide'
);
assert(
  isVideoSlide(null) === false,
  'Null slide gracefully returns false'
);

console.log(`\n========================================`);
console.log(`📊 Hero Video Test Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
