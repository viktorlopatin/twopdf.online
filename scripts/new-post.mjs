import fs from "node:fs"; import path from "node:path";
const [slug,title,description,category="PDF Guides"] = process.argv.slice(2);
if(!slug||!title||!description){console.error("Usage: node scripts/new-post.mjs <slug> <title> <description> [category]");process.exit(1);}
if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){console.error("Slug must be lowercase a-z, 0-9 and hyphens.");process.exit(1);}
const root=path.resolve(new URL(".",import.meta.url).pathname,".."); const file=path.join(root,"blog",`${slug}.html`);
if(fs.existsSync(file)){console.error("Already exists:",file);process.exit(1);}
const today=new Date().toISOString().slice(0,10);
const human=new Intl.DateTimeFormat("en-US",{dateStyle:"long",timeZone:"UTC"}).format(new Date(`${today}T00:00:00Z`));
const header=fs.readFileSync(path.join(root,"scripts","header.fragment.html"),"utf8");
const footer=fs.readFileSync(path.join(root,"scripts","footer.fragment.html"),"utf8");
let t=fs.readFileSync(path.join(root,"scripts","post-template.html"),"utf8");
const r={"__TITLE__":title.replaceAll('"',"&quot;"),"__DESCRIPTION__":description.replaceAll('"',"&quot;"),"__SLUG__":slug,"__DATE__":today,"__DATE_HUMAN__":human,"__CATEGORY__":category,"__HEADER__":header,"__FOOTER__":footer};
for(const [k,v] of Object.entries(r))t=t.split(k).join(v);
fs.writeFileSync(file,t);
const postsPath=path.join(root,"content","posts.json"); const posts=JSON.parse(fs.readFileSync(postsPath,"utf8")); posts.unshift({slug,title,description,date:today,category,readTime:"5 min read"}); fs.writeFileSync(postsPath,JSON.stringify(posts,null,2)+"\n");
const bi=path.join(root,"blog","index.html"); let b=fs.readFileSync(bi,"utf8"); b=b.replace('<div class="blog-grid">','<div class="blog-grid">\n<a class="post-card" href="/blog/'+slug+'.html"><span class="tag">'+category+'</span><h2>'+title+'</h2><p>'+description+'</p><time datetime="'+today+'">'+human+'</time></a>'); fs.writeFileSync(bi,b);
const sm=path.join(root,"sitemap.xml"); let s=fs.readFileSync(sm,"utf8"); s=s.replace("</urlset>",`<url><loc>https://twopdf.online/blog/${slug}.html</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`); fs.writeFileSync(sm,s);
const rss=path.join(root,"rss.xml"); let x=fs.readFileSync(rss,"utf8"); x=x.replace("</channel>",`<item><title>${title}</title><link>https://twopdf.online/blog/${slug}.html</link><pubDate>${new Date(`${today}T00:00:00Z`).toUTCString()}</pubDate><guid>https://twopdf.online/blog/${slug}.html</guid><description>${description}</description></item></channel>`); fs.writeFileSync(rss,x);
console.log(`Created blog/${slug}.html and updated the blog index, sitemap, RSS feed and posts.json.`);
