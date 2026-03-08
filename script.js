document.addEventListener('DOMContentLoaded', () => {

    /* --- Audio Playback --- */
    const bgMusic = document.getElementById('bg-music');
    let musicStarted = false;

    // Start music on first interaction
    document.body.addEventListener('click', () => {
        if (!musicStarted) {
            bgMusic.play().catch((err) => {
                console.log("Audio play failed, user may not have interacted enough yet.", err);
            });
            musicStarted = true;
        }
    }, { once: true });

    /* --- Smooth Scrolling --- */
    const openSurpriseBtn = document.getElementById('open-surprise-btn');
    openSurpriseBtn.addEventListener('click', () => {
        document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    });

    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load

    /* --- Particle & Heart Animations --- */
    const createParticles = (containerId, symbol, minSize, maxSize, count, isHeart = false) => {
        const container = document.getElementById(containerId);
        if(!container) return;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            // Random styles
            const size = Math.random() * (maxSize - minSize) + minSize;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 5; // 5s to 15s
            const delay = Math.random() * 10;

            if (isHeart) {
                el.classList.add('floating-heart');
                el.innerHTML = symbol;
                el.style.fontSize = `${size}px`;
            } else {
                el.classList.add('particle');
                el.style.width = `${size}px`;
                el.style.height = `${size}px`;
            }

            el.style.left = `${left}vw`;
            el.style.animationDuration = `${duration}s`;
            el.style.animationDelay = `${delay}s`;

            container.appendChild(el);
        }
    };

    // Particles for hero
    createParticles('particles-container', '', 2, 6, 50, false);
    createParticles('hearts-container', '❤️', 10, 30, 20, true);
    
    // Particles for final section
    createParticles('final-hearts-container', '💖', 15, 40, 30, true);


    /* --- Love Notes Data --- */
    const loveNotes = [
        "❤️ Baby dhudu pilana.",
        "❤️ billo maaf karde aage se nhi karuga.",
        "❤️ billo baat karna mujhse.",
        "❤️ billariya kidr khud rahi.",
        "❤️ billo terese na daily daily aur pyar badhta jaa raha hai billo i love u so much ."
    ];

    const notesContainer = document.querySelector('.notes-container');
    
    loveNotes.forEach((note, index) => {
        const btn = document.createElement('button');
        btn.classList.add('love-note-btn');
        btn.innerHTML = '❤️';
        btn.onclick = () => openNote(note);
        notesContainer.appendChild(btn);
    });

    /* --- Mini Game Logic --- */
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    const successDiv = document.getElementById('game-success');

    // Phrases to show on the NO button when evading
    const noPhrases = [
        "NO 😜",
        "Try again! 🙈",
        "Nope! 🏃‍♂️",
        "Too slow! 🐢",
        "Catch me! 💨",
        "Not today! 🙅",
        "Still NO! 😂"
    ];

    let currentX = 0;
    let currentY = 0;

    // Make NO button run away
    const moveNoButton = () => {
        // Calculate random movement using translate
        const minMove = 100;
        const maxMove = window.innerWidth < 600 ? 150 : 300; 
        
        const angle = Math.random() * Math.PI * 2;
        const distance = minMove + Math.random() * (maxMove - minMove);
        
        currentX += Math.cos(angle) * distance;
        currentY += Math.sin(angle) * distance;
        
        // Keep within reasonable bounds from the original position
        const boundX = window.innerWidth < 600 ? 150 : 400;
        const boundY = window.innerHeight < 600 ? 200 : 400;
        currentX = Math.max(-boundX, Math.min(boundX, currentX));
        currentY = Math.max(-boundY, Math.min(boundY, currentY));

        btnNo.style.transform = `translate(${currentX}px, ${currentY}px)`;

        // Change the text randomly
        const randomPhrase = noPhrases[Math.floor(Math.random() * noPhrases.length)];
        btnNo.innerText = randomPhrase;
    };

    btnNo.addEventListener('mouseover', moveNoButton);
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    btnYes.addEventListener('click', () => {
        // Trigger confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffb6c1', '#ff6b81', '#ffffff', '#e6e6fa']
        });

        // Show success message and hide buttons
        btnNo.style.display = 'none';
        btnYes.style.display = 'none';
        successDiv.classList.remove('hidden');

        // Optional: Scroll to final section after a delay
        setTimeout(() => {
            document.getElementById('final-surprise').scrollIntoView({ behavior: 'smooth' });
        }, 3000);
    });

});

/* --- Lightbox Functions --- */
function openLightbox(mediaSrc, caption, type = 'image') {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (type === 'video') {
        lightboxImg.innerHTML = `<video src="${mediaSrc}" controls autoplay style="max-width: 100%; max-height: 100%; border-radius: 5px; object-fit: contain;"></video>`;
    } else {
        lightboxImg.innerHTML = `<img src="${mediaSrc}" style="max-width: 100%; max-height: 100%; border-radius: 5px; object-fit: contain;">`;
    }
    
    lightboxCaption.innerText = caption;
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Stop video from playing when modal closes
    lightboxImg.innerHTML = '';
    
    lightbox.classList.add('hidden');
}

/* --- Love Note Functions --- */
function openNote(text) {
    const modal = document.getElementById('note-modal');
    const noteText = document.getElementById('note-text');
    
    noteText.innerText = text;
    modal.classList.remove('hidden');
}

function closeNote() {
    document.getElementById('note-modal').classList.add('hidden');
}
