// document.querySelectorAll('.faq-question').forEach(button => {
//   button.addEventListener('click', () => {
//     const faqItem = button.parentElement;
//     const isActive = faqItem.classList.contains('active');

//     document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

//     if (!isActive) {
//       faqItem.classList.add('active');
//     }
//   });
// });
// FAQ toggle
// FAQ question toggle (for + and -)
// FAQ question toggle (plus <-> minus)
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const plusSpan = question.querySelector('span');

  question.addEventListener('click', (e) => {
    // toggle only this faq-item
    item.classList.toggle('active');

    // update plus/minus sign
    if (item.classList.contains('active')) {
      plusSpan.textContent = '−'; // minus when open
    } else {
      plusSpan.textContent = '+'; // plus when closed
    }
  });
});

// Show More / Show Less toggle (for hidden FAQ section)
const showMoreBtn = document.getElementById('show-more-btn');
const hiddenFaq = document.querySelector('.faq-hidden');

if (hiddenFaq) hiddenFaq.style.display = 'none'; // start hidden

if (showMoreBtn) {
  showMoreBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent event bubbling to parent elements

    const isVisible = hiddenFaq.style.display === 'block';
    if (isVisible) {
      hiddenFaq.style.display = 'none';
      showMoreBtn.classList.remove('active'); // arrow down
    } else {
      hiddenFaq.style.display = 'block';
      showMoreBtn.classList.add('active'); // arrow up
    }
  });
}



