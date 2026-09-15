# TwoPDF — static SEO site

Static, GitHub Pages-ready website for `https://twopdf.online/` with a premium SaaS-style landing page, a PDF landing page, SEO article pages, sitemap, RSS, robots.txt, structured data, and a small Node-based article generator.

## Deploy

1. Create a GitHub repository and upload this folder.
2. Enable GitHub Pages from the `main` branch.
3. Keep the included `CNAME` file.
4. Configure your DNS for GitHub Pages and enable HTTPS.

## Add an SEO article

```bash
node scripts/new-post.mjs "merge-pdf-on-android" "How to Merge PDF Files on Android" "A practical Android workflow for combining PDF files into one." "Android"
```

Then edit `blog/merge-pdf-on-android.html` and replace the starter content with a genuinely useful article.

The script updates `content/posts.json`, `blog/index.html`, `sitemap.xml`, and `rss.xml`.

## Before publishing

Replace generic product claims with the bot's real limits and policies: supported formats, maximum file size, retention/deletion behavior, processing limits, and exact bot workflow.
