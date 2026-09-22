const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const rotatingWord = document.querySelector('#rotating-word');
const rotationWords = ['reliable', 'scalable', 'beautiful', 'automated', 'invisible'];

if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let wordIndex = 0;
  const pause = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const rotateWord = async () => {
    if (document.visibilityState === 'visible') {
      while (rotatingWord.textContent.length > 0) {
        rotatingWord.textContent = rotatingWord.textContent.slice(0, -1);
        await pause(65);
      }
      await pause(150);
      wordIndex = (wordIndex + 1) % rotationWords.length;
      for (const character of rotationWords[wordIndex]) {
        rotatingWord.textContent += character;
        await pause(92);
      }
    }
    window.setTimeout(rotateWord, 5000);
  };

  window.setTimeout(rotateWord, 5000);
}

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    primaryNav.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const personalProjectGrid = document.querySelector('#personal-project-grid');
const personalProjectToggle = document.querySelector('.personal-project-toggle');

if (personalProjectGrid && personalProjectToggle) {
  const defaultProjectCount = 4;
  const projectCards = Array.from(personalProjectGrid.querySelectorAll('.personal-project-card'));

  projectCards
    .sort((first, second) => Number(second.dataset.projectYear) - Number(first.dataset.projectYear))
    .forEach((card) => personalProjectGrid.append(card));

  const hiddenProjectCount = Math.max(0, projectCards.length - defaultProjectCount);
  const updateProjectVisibility = (expanded) => {
    projectCards.forEach((card, index) => {
      card.hidden = !expanded && index >= defaultProjectCount;
    });
    personalProjectToggle.setAttribute('aria-expanded', String(expanded));
    personalProjectToggle.textContent = expanded
      ? 'Show fewer projects'
      : `Show ${hiddenProjectCount} more projects`;
  };

  if (hiddenProjectCount > 0) {
    personalProjectToggle.hidden = false;
    updateProjectVisibility(false);
    personalProjectToggle.addEventListener('click', () => {
      updateProjectVisibility(personalProjectToggle.getAttribute('aria-expanded') !== 'true');
    });
  }
}

const dot = document.querySelector('.cursor-dot');
if (dot && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
  });
}

// A subtle, original canvas interpretation inspired by the MIT-licensed
// Grok Shooting Stars demo: https://github.com/UsmanDevCraft/grok-shooting-stars
const starCanvas = document.querySelector('.hero-stars');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (starCanvas) {
  const context = starCanvas.getContext('2d');
  const stars = [];
  const shootingStars = [];
  const pointer = { x: .5, y: .5 };
  let width = 0;
  let height = 0;
  let nextTrailAt = 0;

  const createStar = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.15 + .25,
    phase: Math.random() * Math.PI * 2,
    drift: (Math.random() - .5) * .035,
  });

  const resizeStarfield = () => {
    const bounds = starCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    starCanvas.width = Math.round(width * ratio);
    starCanvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const starCount = Math.min(96, Math.max(38, Math.round((width * height) / 18500)));
    for (let index = 0; index < starCount; index += 1) stars.push(createStar());
  };

  const launchTrail = () => {
    shootingStars.push({
      x: width * (.25 + Math.random() * .5),
      y: height * (.05 + Math.random() * .38),
      length: 110 + Math.random() * 95,
      life: 0,
      maxLife: 135 + Math.random() * 40,
      speed: 2.25 + Math.random() * .9,
    });
  };

  const drawStarfield = (time = 0) => {
    context.clearRect(0, 0, width, height);
    const parallaxX = (pointer.x - .5) * 16;
    const parallaxY = (pointer.y - .5) * 10;

    stars.forEach((star, index) => {
      const twinkle = .08 + ((Math.sin(time * .001 + star.phase) + 1) * .07);
      context.fillStyle = index % 6 === 0 ? `rgba(23, 85, 255, ${twinkle + .06})` : `rgba(22, 23, 24, ${twinkle})`;
      context.beginPath();
      context.arc(star.x + parallaxX * .2, star.y + parallaxY * .2, star.radius, 0, Math.PI * 2);
      context.fill();
      if (!reduceMotion.matches) star.x = (star.x + star.drift + width) % width;
    });

    if (!reduceMotion.matches && time > nextTrailAt) {
      launchTrail();
      nextTrailAt = time + 2600 + Math.random() * 1400;
    }

    shootingStars.forEach((trail, index) => {
      const progress = trail.life / trail.maxLife;
      const opacity = Math.sin(progress * Math.PI) * .82;
      context.beginPath();
      context.moveTo(trail.x, trail.y);
      context.lineTo(trail.x - trail.length, trail.y - trail.length * .32);
      context.strokeStyle = `rgba(23, 85, 255, ${opacity * .16})`;
      context.lineWidth = 7;
      context.stroke();
      context.beginPath();
      context.moveTo(trail.x, trail.y);
      context.lineTo(trail.x - trail.length, trail.y - trail.length * .32);
      context.strokeStyle = `rgba(23, 85, 255, ${opacity})`;
      context.lineWidth = 1.5;
      context.stroke();
      trail.x += trail.speed;
      trail.y += trail.speed * .32;
      trail.life += 1;
      if (trail.life > trail.maxLife) shootingStars.splice(index, 1);
    });

    if (!reduceMotion.matches) window.requestAnimationFrame(drawStarfield);
  };

  resizeStarfield();
  window.addEventListener('resize', resizeStarfield);
  window.addEventListener('pointermove', (event) => {
    const bounds = starCanvas.getBoundingClientRect();
    pointer.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    pointer.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  }, { passive: true });
  drawStarfield();
}
