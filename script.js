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

// cursor spotlight — pointer devices only, one write per frame
if (matchMedia('(hover: hover)').matches) {
  let x = 0, y = 0, queued = false;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      document.documentElement.style.setProperty('--mx', x + 'px');
      document.documentElement.style.setProperty('--my', y + 'px');
    });
  }, { passive: true });
}

// hairline under the bar once you scroll
const bar = document.querySelector('.bar');
addEventListener('scroll', () => {
  bar.classList.toggle('scrolled', scrollY > 8);
}, { passive: true });
