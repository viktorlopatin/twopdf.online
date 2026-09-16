# TwoPDF static blog

Pure HTML + CSS + JavaScript. Designed for GitHub Pages.

## Add a new article

1. Copy `articles/_template.html`.
2. Rename it to a slug, for example `split-pdf-pages.html`.
3. Change the title, description, date, category and article body.
4. Commit and push.

Nothing else is required. The Blog page reads the `articles/` folder through the public GitHub Contents API, discovers all `.html` files, loads their metadata, sorts by date and builds pagination automatically.

Files beginning with `_` are ignored, so `_template.html` never appears on the blog.

## One-time settings

Edit `js/config.js` only if your GitHub owner/repository or bot username differs.

Blog pages use the current article filename as the Telegram start tag. For example:

`articles/how-to-combine-pdf-files.html`

becomes:

`https://t.me/TwoPdfBot?start=how-to-combine-pdf-files`

The header uses `website_header`, while home/about/footer have their own tags.

## GitHub Pages

Upload the folder contents to the repository root and enable GitHub Pages from the branch/folder that contains `index.html`.
