// Elements
const section = document.getElementById('videoSection');
const wrapper = document.getElementById('videoWrapper');
const video = document.getElementById('peeonVideo');
const closeBtn = document.getElementById('closeBtn');

let hasEnteredView = false;
let isShrunk = false;
let isClosed = false;

// helper: play but ignore autoplay errors
function tryPlay() {
  if (!video) return;
  video.play().catch(()=>{/* autoplay blocked — muted required for autoplay in many browsers */});
}

// IntersectionObserver to know when section enters viewport (better than scroll)
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (isClosed) return;

    if (entry.isIntersecting) {
      hasEnteredView = true;
      wrapper.classList.remove('hidden');
      wrapper.classList.add('visible');
      // ensure video starts playing (muted)
      video.muted = true;
      tryPlay();
    }
  });
}, { root: null, threshold: 0.15 }); // 15% visible triggers

io.observe(section);

// Scroll listener to decide shrink: only run after section has been entered once
window.addEventListener('scroll', () => {
  if (isClosed || !hasEnteredView) return;

  // compute absolute top of section relative to document
  const rect = section.getBoundingClientRect();
  const sectionTopAbsolute = window.scrollY + rect.top;
  const triggerPoint = sectionTopAbsolute + (rect.height * 0.5); // halfway through section

  if (window.scrollY > triggerPoint && !isShrunk) {
    wrapper.classList.add('shrink');
    isShrunk = true;
  } else if (window.scrollY <= triggerPoint && isShrunk) {
    wrapper.classList.remove('shrink');
    isShrunk = false;
  }
});

// Close behavior
closeBtn.addEventListener('click', () => {
  isClosed = true;
  // stop and hide
  try { video.pause(); } catch(e){}
  wrapper.style.display = 'none';
  // we can unobserve to be tidy
  io.unobserve(section);
});
