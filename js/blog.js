(function () {
  const cfg = window.TWOPDF_CONFIG;
  const grid = document.getElementById('article-grid');
  const pagination = document.getElementById('pagination');
  const status = document.getElementById('blog-status');
  if (!cfg || !grid) return;

  const params = new URLSearchParams(window.location.search);
  let currentPage = Math.max(1, Number(params.get('page')) || 1);

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  }

  async function githubList() {
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.githubRepo)}/contents/${cfg.articlesPath}`;
    const response = await fetch(endpoint, { headers: { 'Accept': 'application/vnd.github+json' } });
    if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
    return response.json();
  }

  async function readPost(file) {
    const url = `${location.origin}${location.pathname.replace(/blog\.html$/, '')}${cfg.articlesPath}/${encodeURIComponent(file.name)}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to read ${file.name}`);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const meta = name => doc.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || '';
    const title = doc.querySelector('h1')?.textContent?.trim() || doc.title.replace(/\s*[-|].*$/, '').trim();
    const description = meta('description') || doc.querySelector('p')?.textContent?.trim() || '';
    const date = meta('article:published_time') || meta('date') || '';
    const category = meta('category') || 'PDF Guides';
    const slug = file.name.replace(/\.html$/i, '');
    return { name: file.name, slug, title, description, date, category, href: `${cfg.articlesPath}/${encodeURIComponent(file.name)}` };
  }

  function render(posts) {
    const totalPages = Math.max(1, Math.ceil(posts.length / cfg.postsPerPage));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * cfg.postsPerPage;
    const visible = posts.slice(start, start + cfg.postsPerPage);

    grid.innerHTML = visible.map(post => `
      <article class="article-card">
        <div class="article-card-top"><span>${escapeHtml(post.category)}</span><span>${escapeHtml(formatDate(post.date))}</span></div>
        <h2><a href="${post.href}">${escapeHtml(post.title)}</a></h2>
        <p>${escapeHtml(post.description)}</p>
        <a class="card-link" href="${post.href}">Read article <span aria-hidden="true">→</span></a>
      </article>`).join('');

    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state">No articles found yet.</div>';
    }

    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    const items = [];
    items.push(`<button class="page-button" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" aria-label="Previous page">←</button>`);
    for (let page = 1; page <= totalPages; page++) {
      if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
        items.push(`<button class="page-button ${page === currentPage ? 'current' : ''}" data-page="${page}" aria-current="${page === currentPage ? 'page' : 'false'}">${page}</button>`);
      } else if (page === currentPage - 2 || page === currentPage + 2) {
        items.push('<span class="pagination-dots">…</span>');
      }
    }
    items.push(`<button class="page-button" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" aria-label="Next page">→</button>`);
    pagination.innerHTML = items.join('');
    pagination.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => {
      const next = Number(btn.dataset.page);
      if (!next || next < 1 || next > totalPages || next === currentPage) return;
      currentPage = next;
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('page', String(currentPage));
      history.pushState({}, '', nextUrl);
      render(posts);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }));
  }

  async function init() {
    try {
      const files = await githubList();
      const htmlFiles = files.filter(item => item.type === 'file' && /\.html$/i.test(item.name) && !item.name.startsWith('_'));
      if (!htmlFiles.length) {
        status.textContent = 'No articles yet.';
        render([]);
        return;
      }
      const posts = (await Promise.all(htmlFiles.map(readPost))).sort((a, b) => {
        const da = new Date(a.date).getTime() || 0;
        const db = new Date(b.date).getTime() || 0;
        return db - da;
      });
      status.textContent = `${posts.length} article${posts.length === 1 ? '' : 's'}`;
      render(posts);
    } catch (error) {
      console.error(error);
      status.innerHTML = 'Articles could not be loaded right now. <button class="inline-retry" id="retry-blog">Try again</button>';
      document.getElementById('retry-blog')?.addEventListener('click', init);
    }
  }

  window.addEventListener('popstate', () => {
    const next = Math.max(1, Number(new URLSearchParams(location.search).get('page')) || 1);
    currentPage = next;
    init();
  });

  init();
})();
