document.addEventListener('DOMContentLoaded', function() {
    // Fetch FAQ data from the server
    fetch('https://parttimejobs.web.lk/api/faq')
        .then(response => response.json())
        .then(data => {
            // Update title
            document.getElementById('faq-title').textContent = data.title;

            // Update description
            // const descriptionElement = document.getElementById('faq-description');
            // descriptionElement.innerHTML = data.description.replace(/\n/g, '<br>');

            // Parse and create FAQ cards
            const faqContainer = document.getElementById('faq-container');
            const faqItems = data.description.split(/\d+\.\s/).slice(1);

            faqItems.forEach((item, index) => {
                const [question, answer] = item.split('\n');
                
                const faqCard = document.createElement('div');
                faqCard.classList.add('faq-card');

                const faqQuestion = document.createElement('div');
                faqQuestion.classList.add('faq-question');
                faqQuestion.textContent = `${index + 1}. ${question.trim()}`;

                const faqAnswer = document.createElement('div');
                faqAnswer.classList.add('faq-answer');
                faqAnswer.textContent = answer.trim();

                faqCard.appendChild(faqQuestion);
                faqCard.appendChild(faqAnswer);
                faqContainer.appendChild(faqCard);

                // Add click event listener to the question
                faqQuestion.addEventListener('click', () => {
                    faqQuestion.classList.toggle('active');
                    faqAnswer.classList.toggle('show');
                });
            });
        })
        .catch(error => {
            console.error('Error fetching FAQ data:', error);
            document.getElementById('faq-title').textContent = 'Error loading FAQ';
            document.getElementById('faq-description').textContent = 'There was an error loading the FAQ. Please try again later.';
        });
});