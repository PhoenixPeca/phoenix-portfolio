const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const dot = document.querySelector('.cursor-dot');
if (dot && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });
}
