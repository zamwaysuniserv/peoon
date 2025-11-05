const images = document.querySelectorAll('.carousel img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
let current = 2;

function updateCarousel() {
  images.forEach((img, index) => {
    const offset = index - current;

    if (Math.abs(offset) > 3) {
      img.classList.add('hidden');
    } else {
      img.classList.remove('hidden');
      img.style.transform = `translateX(${offset * 180}px) translateZ(${-Math.abs(offset) * 200}px) rotateY(${offset * -20}deg)`;
      img.style.zIndex = 10 - Math.abs(offset);
      img.style.opacity = 1 - Math.abs(offset) * 0.2;
    }
  });
}

prev.addEventListener('click', () => {
  current = (current - 1 + images.length) % images.length;
  updateCarousel();
});

next.addEventListener('click', () => {
  current = (current + 1) % images.length;
  updateCarousel();
});

updateCarousel();

