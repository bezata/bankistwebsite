'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScroll = document.querySelector('.btn--scroll-to');
const sect1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const openacButton = document.querySelector('.btn--show-modal');
const header = document.querySelector('.header');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page Nav
buttonScroll.addEventListener('click', function (e) {
  const s1coords = sect1.getBoundingClientRect();
  /*console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('Current Scroll (x/y):', window.pageXOffset, window.pageYOffset);
  console.log(
    'height/width:',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );*/
  /*
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/
  sect1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });
document.querySelector('.nav__links').addEventListener('click', function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  //Guard Clause
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');

  // Content area activation

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fading
const fadeIt = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clickd = e.target;
    const siblings = clickd.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickd.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== clickd) el.style.opacity = this;
    });
    openacButton.style.opacity = 1;
  }
};
nav.addEventListener('mouseover', fadeIt.bind(0.5));
nav.addEventListener('mouseout', fadeIt.bind(1));
// Sticky Navigation(inefficient way)
/*const scrollCoords = sect1.getBoundingClientRect();
window.addEventListener('scroll', function (e) {
  if (window.scrollY > scrollCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});*/
// Intersection Observer API
const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const observerOps = {
  root: null,
  threshold: [0, 0.2],
};
/*const observer = new IntersectionObserver(obsCallBack, observerOps);
observer.observe(sect1);
*/
const height = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});
headerObs.observe(header);
// Scroll for revealing elements
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// Lazy Images(Performance Improvement)
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));
//Slider Component
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
  activateDot(0);
};

goToSlide(0);
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else currentSlide++;
  activateDot(currentSlide);
};
const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else currentSlide--;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
let currentSlide = 0;
const maxSlide = slides.lenght;

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keyDown', function (e) {
  if (e.key === 'ArrowLeft') previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});

const createDots = function () {
  slider.forEach(function (_, i) {
    dotContainer.instertAdjacentHTML(
      'beforeend',
      `<button class="dots_dot" data-slide="${i}"></button>`
    );
  });
};

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots_dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
createDots();
