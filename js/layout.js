(function () {
  const path = window.location.pathname.replace(/\\/g, '/');
  const articleIndex = path.indexOf('/articles/');
  const root = articleIndex >= 0 ? path.slice(0, articleIndex + 1) : (path.endsWith('/') ? path : path.substring(0, path.lastIndexOf('/') + 1));
  const isHome = /(?:^|\/)index\.html$/.test(path) || path.endsWith('/');
  const isBlog = /\/blog\.html$/.test(path);
  const isAbout = /\/about\.html$/.test(path);

  const headerTarget = document.getElementById('site-header');
  if (headerTarget) {
    headerTarget.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="${root}index.html" aria-label="TwoPDF home">
            <span class="brand-mark">2</span>
            <span>TwoPDF</span>
          </a>
          <nav class="main-nav" aria-label="Main navigation">
            <a class="${isHome ? 'active' : ''}" href="${root}index.html">Home</a>
            <a class="${isBlog ? 'active' : ''}" href="${root}blog.html">Blog</a>
            <a class="${isAbout ? 'active' : ''}" href="${root}about.html">About</a>
          </nav>
          <a class="header-cta" href="https://t.me/TwoPdfBot?start=website_header">Launch bot <span aria-hidden="true">↗</span></a>
        </div>
      </header>`;
  }

  const footerTarget = document.getElementById('site-footer');
  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div>
            <a class="brand footer-brand" href="${root}index.html"><span class="brand-mark">2</span><span>TwoPDF</span></a>
            <p class="footer-copy">A simple Telegram bot for combining PDF files.</p>
          </div>
          <div class="footer-links">
            <a href="${root}blog.html">Blog</a>
            <a href="${root}about.html">About</a>
            <a href="https://t.me/TwoPdfBot?start=website_footer">Telegram Bot</a>
          </div>
        </div>
        <div class="container footer-bottom"><span>© ${new Date().getFullYear()} TwoPDF</span><span>Built with HTML, CSS & JavaScript.</span></div>
      </footer>`;
  }
})();
