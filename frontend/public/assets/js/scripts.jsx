
// Most JavaScript functionality has been moved into the React components

// Helper function to initialize accordion functionality for static elements
const initAccordions = () => {
  // accordion variables
  const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
  const accordion = document.querySelectorAll('[data-accordion]');

  for (let i = 0; i < accordionBtn.length; i++) {
    accordionBtn[i].addEventListener('click', function () {
      const clickedBtn = this.nextElementSibling.classList.contains('active');

      for (let i = 0; i < accordion.length; i++) {
        if (clickedBtn) break;

        if (accordion[i].classList.contains('active')) {
          accordion[i].classList.remove('active');
          accordionBtn[i].classList.remove('active');
        }
      }

      this.nextElementSibling.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
};

// Initialize after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Any remaining JavaScript initialization that's needed for non-React elements
  setTimeout(initAccordions, 500); // Give React time to render
});