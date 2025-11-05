// slider.js
const track = document.querySelector('.person-track');
const cards = document.querySelectorAll('.person-circle-card');
let speed = 1;
let pos = 0;

// Clone cards for smooth infinite scroll
cards.forEach(card => {
  const clone = card.cloneNode(true);
  track.appendChild(clone);
});

const totalWidth = Array.from(cards).reduce(
  (acc, card) => acc + card.offsetWidth + 30,
  0
);

function animate() {
  pos -= speed;

  // Reset seamlessly
  if (Math.abs(pos) >= totalWidth) pos = 0;

  track.style.transform = `translateX(${pos}px)`;
  requestAnimationFrame(animate);
}

animate();





