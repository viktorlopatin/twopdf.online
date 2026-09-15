(() => {
  const menu=document.querySelector("[data-menu]"), links=document.querySelector("[data-nav-links]");
  if(menu&&links){menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));links.classList.toggle("open",!open);});}
  document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>{const i=b.closest(".faq-item"),open=i.classList.toggle("open");b.setAttribute("aria-expanded",String(open));}));
  document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear());
})();
