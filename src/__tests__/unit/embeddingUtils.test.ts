import { validateAndSanitizeEmbedding } from '../../utils/embeddingUtils';

const SPOTIFY_EMBED =
  '<iframe src="https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh" width="300" height="80" frameborder="0"></iframe>';

const YOUTUBE_EMBED =
  '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Rick Astley - Never Gonna Give You Up" frameborder="0"></iframe>';

const SOUNDCLOUD_EMBED =
  '<iframe src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/artist-name/track-name" width="100%" height="166"></iframe>';

describe('validateAndSanitizeEmbedding', () => {
  describe('valid embeds', () => {
    it('accepts a Spotify track embed', () => {
      const result = validateAndSanitizeEmbedding(SPOTIFY_EMBED);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe('spotify');
      expect(result.sanitizedCode).toBeDefined();
    });

    it('accepts a YouTube embed and extracts video ID for thumbnail', () => {
      const result = validateAndSanitizeEmbedding(YOUTUBE_EMBED);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe('youtube');
      expect(result.thumbnailUrl).toContain('dQw4w9WgXcQ');
    });

    it('accepts a SoundCloud embed and extracts a title', () => {
      const result = validateAndSanitizeEmbedding(SOUNDCLOUD_EMBED);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe('soundcloud');
      expect(result.title).toContain('track-name');
    });

    it('includes the Spotify type in the title (track / album / playlist)', () => {
      const album =
        '<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3" frameborder="0"></iframe>';
      const result = validateAndSanitizeEmbedding(album);
      expect(result.isValid).toBe(true);
      expect(result.title).toMatch(/album/i);
    });
  });

  describe('empty / missing input', () => {
    it('rejects an empty string', () => {
      const result = validateAndSanitizeEmbedding('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('rejects a whitespace-only string', () => {
      const result = validateAndSanitizeEmbedding('   ');
      expect(result.isValid).toBe(false);
    });

    it('rejects null (runtime guard)', () => {
      // @ts-expect-error intentionally testing runtime type guard
      const result = validateAndSanitizeEmbedding(null);
      expect(result.isValid).toBe(false);
    });
  });

  describe('XSS attempts', () => {
    it('rejects a bare javascript: src', () => {
      const xss = '<iframe src="javascript:alert(1)"></iframe>';
      const result = validateAndSanitizeEmbedding(xss);
      expect(result.isValid).toBe(false);
    });

    it('does not surface script tags in sanitizedCode', () => {
      const xss =
        '<script>alert("xss")</script>' +
        '<iframe src="https://open.spotify.com/embed/track/abc123" frameborder="0"></iframe>';
      const result = validateAndSanitizeEmbedding(xss);
      // Platform is detected as Spotify; sanitized output must strip the script
      if (result.isValid) {
        expect(result.sanitizedCode).not.toContain('<script>');
      }
    });

    it('does not surface event handler attributes in sanitizedCode', () => {
      const xss =
        '<iframe src="https://open.spotify.com/embed/track/abc123" onload="alert(1)" frameborder="0"></iframe>';
      const result = validateAndSanitizeEmbedding(xss);
      if (result.isValid) {
        expect(result.sanitizedCode).not.toMatch(/onload=/i);
      }
    });

    it('rejects a data: URL embed', () => {
      const xss = '<iframe src="data:text/html,<script>alert(1)</script>"></iframe>';
      const result = validateAndSanitizeEmbedding(xss);
      expect(result.isValid).toBe(false);
    });
  });

  describe('unsupported platforms', () => {
    it('rejects a Vimeo embed', () => {
      const vimeo = '<iframe src="https://player.vimeo.com/video/123456789" frameborder="0"></iframe>';
      const result = validateAndSanitizeEmbedding(vimeo);
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/unsupported platform/i);
    });

    it('rejects a generic iframe with no recognised platform', () => {
      const generic = '<iframe src="https://example.com/embed/something"></iframe>';
      const result = validateAndSanitizeEmbedding(generic);
      expect(result.isValid).toBe(false);
    });
  });
});
