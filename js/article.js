(function () {
  const cfg = window.TWOPDF_CONFIG || { botUsername: 'TwoPdfBot' };
  const filename = decodeURIComponent(window.location.pathname.split('/').pop() || '').replace(/\.html$/i, '');
  const articleTitle = document.querySelector('h1')?.textContent?.trim() || document.title;
  const slug = filename || articleTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const startTag = slug || 'website_article';
  const botUrl = `https://t.me/${cfg.botUsername}?start=${encodeURIComponent(startTag)}`;

  document.querySelectorAll('[data-bot-link]').forEach(link => { link.href = botUrl; });
  const titleNode = document.getElementById('article-title');
  if (titleNode) titleNode.textContent = articleTitle;
})();
