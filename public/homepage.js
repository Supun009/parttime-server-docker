document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = hamburger.contains(event.target) || navLinks.contains(event.target);
      if (!isClickInside && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('show');
      });
    });


      const faqQuestions = document.querySelectorAll('.faq-question');
      
      faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
          const answer = question.nextElementSibling;
          const isOpen = answer.classList.contains('show');
          
          // Close all other answers
          document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('show'));
          document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
          
          // Toggle the clicked answer
          if (!isOpen) {
            answer.classList.add('show');
            question.classList.add('active');
          }
        });
      });

    

  });