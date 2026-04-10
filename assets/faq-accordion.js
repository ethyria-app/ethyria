// FAQ Accordion Script
// Only one open at a time (single-open)
document.addEventListener("DOMContentLoaded", function () {
  const faqAccordion = document.getElementById("faqAccordion");
  if (!faqAccordion) return;
  const questions = faqAccordion.querySelectorAll(".faq-question");

  questions.forEach((btn) => {
    btn.addEventListener("click", function () {
      const expanded = this.getAttribute("aria-expanded") === "true";
      // Close all
      questions.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
      });
      // Open this if it was closed
      if (!expanded) {
        this.setAttribute("aria-expanded", "true");
      }
    });
  });
});
