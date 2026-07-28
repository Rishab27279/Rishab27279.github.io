/* Theme toggle, mobile menu, bar hairline. That's the whole file. */

// theme — initial value is set inline in <head> to avoid a flash
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
});

// mobile menu
const burger = document.getElementById('burger');
const menu   = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// hairline under the bar once you scroll
const bar = document.querySelector('.bar');
addEventListener('scroll', () => {
  bar.classList.toggle('scrolled', scrollY > 8);
}, { passive: true });
