import Carousel from 'bootstrap/js/src/carousel';

(() => {
  document.querySelectorAll<HTMLElement>('.carousel').forEach((el) => {
    new Carousel(el);
  });
})();
