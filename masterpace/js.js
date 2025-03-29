document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('testimonialForm');
    const testimonialCards = document.getElementById('testimonialCards');
    const dotsContainer = document.querySelector('.nav-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const alertBox = document.getElementById('customAlert');
    const alertAction = document.querySelector('.alert-action');
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.querySelector('.avatar-preview');
    const stars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');

    let currentIndex = 0;
    let testimonials = [];

    // Initialize star rating
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('active');
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });

    // Handle avatar upload preview
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.style.backgroundImage = `url(${event.target.result})`;
                avatarPreview.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = form.name.value;
        const position = form.position.value || 'Customer';
        const testimonialText = form.testimonial.value;
        const rating = parseInt(ratingInput.value);
        
        // Validate rating
        if (rating < 1 || rating > 5) {
            alert('Please select a rating between 1 and 5 stars');
            return;
        }

        // Create testimonial object
        const newTestimonial = {
            id: Date.now(),
            name,
            position,
            quote: testimonialText,
            rating,
            avatar: avatarPreview.style.backgroundImage || 'https://randomuser.me/api/portraits/lego/5.jpg'
        };

        // Add to testimonials array
        testimonials.unshift(newTestimonial); // Add to beginning of array
        
        // Render testimonials
        renderTestimonials();
        
        // Reset form
        form.reset();
        ratingInput.value = 0;
        avatarPreview.style.backgroundImage = '';
        avatarPreview.classList.remove('has-image');
        stars.forEach(star => {
            star.classList.remove('active', 'fas');
            star.classList.add('far');
        });
        
        // Show success alert
        showAlert();
    });

    // Initialize testimonials
    function initTestimonials() {
        // Sample testimonials (can be empty)
        testimonials = [];
        renderTestimonials();
    }

    // Render testimonials
    function renderTestimonials() {
        testimonialCards.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        if (testimonials.length === 0) {
            testimonialCards.innerHTML = '<p class="no-testimonials">No testimonials yet. Be the first to share your experience!</p>';
            return;
        }
        
        testimonials.forEach((testimonial, index) => {
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
            card.innerHTML = `
                <div class="client-avatar" style="background-image: url(${testimonial.avatar})"></div>
                <div class="client-rating">
                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                </div>
                <p class="client-quote">${testimonial.quote}</p>
                <div class="client-info">
                    <h4 class="client-name">${testimonial.name}</h4>
                    <p class="client-position">${testimonial.position}</p>
                </div>
            `;
            testimonialCards.appendChild(card);

            // Create dots
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
            
            // Dot click event
            dot.addEventListener('click', () => {
                goToTestimonial(index);
            });
        });
    }

    // Navigate to specific testimonial
    function goToTestimonial(index) {
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.dot');
        
        // Update current index
        currentIndex = index;
        
        // Update cards
        cards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }

    // Next testimonial
    function nextTestimonial() {
        if (testimonials.length === 0) return;
        currentIndex = (currentIndex + 1) % testimonials.length;
        goToTestimonial(currentIndex);
    }

    // Previous testimonial
    function prevTestimonial() {
        if (testimonials.length === 0) return;
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        goToTestimonial(currentIndex);
    }

    // Show alert
    function showAlert() {
        alertBox.classList.add('show');
    }

    // Hide alert
    function hideAlert() {
        alertBox.classList.remove('show');
    }

    // Event listeners
    prevBtn.addEventListener('click', prevTestimonial);
    nextBtn.addEventListener('click', nextTestimonial);
    alertAction.addEventListener('click', hideAlert);

    // Auto-rotate testimonials (optional)
    let autoRotate = setInterval(nextTestimonial, 5000);

    // Pause auto-rotation on hover
    testimonialCards.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    testimonialCards.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextTestimonial, 5000);
    });

    // Initialize
    initTestimonials();
});