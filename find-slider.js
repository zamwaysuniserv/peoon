document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.carousel-section'); // assume single carousel; adapt if multiple
  const track = section.querySelector('.carousel-track');
  let cards = Array.from(track.children);

  // Guard
  if (cards.length === 0) return;

  // 1) Duplicate the entire set of slides and append
  const fragment = document.createDocumentFragment();
  cards.forEach(card => fragment.appendChild(card.cloneNode(true)));
  track.appendChild(fragment);

  // Refresh list after duplication
  const allCards = Array.from(track.children); // originals then clones
  const originalCount = cards.length;

  // 2) compute card width including gap (reads real layout)
  // Use getBoundingClientRect for accurate width (includes rendered width)
  const computeCardWidth = () => {
    const r = allCards[0].getBoundingClientRect();
    // we assume horizontal spacing is handled by gap or margin between cards,
    // so find distance between left edges of card 0 and card 1
    if (allCards[1]) {
      const r2 = allCards[1].getBoundingClientRect();
      return Math.round(r2.left - r.left);
    }
    return Math.round(r.width);
  };

  let cardWidth = computeCardWidth();

  // 3) Start index at first original (index 0 in originals but offset in full array)
  let index = 0;

  // position — we start at first original (no offset needed since originals at start)
  track.style.transform = `translateX(-${index * cardWidth}px)`;

  // utility to move with transition
  const moveTo = (i, useTransition = true) => {
    if (useTransition) {
      track.style.transition = 'transform 0.45s ease';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(-${i * cardWidth}px)`;
  };

  // Buttons
  const nextBtn = section.querySelector('.right-btn');
  const prevBtn = section.querySelector('.left-btn');

  // Next handler: increment index and move
  const goNext = () => {
    index++;
    moveTo(index, true);
  };

  // Prev handler: decrement index and move
  const goPrev = () => {
    index--;
    moveTo(index, true);
  };

  // Transition end: if we've moved into cloned area, snap back to the equivalent original index (no transition)
  track.addEventListener('transitionend', () => {
    // If index is beyond the last original (i.e., inside the appended clones)
    if (index >= originalCount) {
      // jump back to same relative item in the original block
      index = index - originalCount;
      moveTo(index, false); // no transition so user doesn't see jump
    } else if (index < 0) {
      // If moved left past 0 into negative (we can handle by jumping to the corresponding original at end)
      index = index + originalCount;
      moveTo(index, false);
    }
  });

  // Wire buttons with throttling to avoid rapid multiple clicks breaking transition logic
  let isMoving = false;
  const clickGuard = (fn) => {
    if (isMoving) return;
    isMoving = true;
    fn();
    // unlock after transition duration (slightly longer)
    setTimeout(() => { isMoving = false; }, 480);
  };

  nextBtn.addEventListener('click', () => clickGuard(goNext));
  prevBtn.addEventListener('click', () => clickGuard(goPrev));

  // Recalculate dimensions when window resizes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cardWidth = computeCardWidth();
      // re-position to current index with no animation to avoid flicker
      moveTo(index, false);
    }, 150);
  });

  // OPTIONAL: keyboard navigation (left/right arrows)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') clickGuard(goNext);
    if (e.key === 'ArrowLeft') clickGuard(goPrev);
  });

  // (Optional) initial visual "active" class update helper
  const refreshActive = () => {
    // mark active among the original set only (use modulo)
    const activeOriginalIndex = ((index % originalCount) + originalCount) % originalCount;
    // clear existing and set on original cards only
    cards.forEach((c, i) => {
      c.classList.toggle('active', i === activeOriginalIndex);
    });
  };

  // Listen to transitionend to refresh active class (and also after forced reposition)
  track.addEventListener('transitionend', refreshActive);
  // call once to set initial active
  refreshActive();
});