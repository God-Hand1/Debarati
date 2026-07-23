// --- Background Music ---
let musicStarted = false;

function playBgMusic() {
    if (musicStarted) return;
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.volume = 0.3;
        audio.play().catch(() => {});
        musicStarted = true;
    }
}

// --- Scene Management ---
function nextScene(nextSceneId) {
    if (!musicStarted) playBgMusic();
    const activeScene = document.querySelector('.scene.active');
    if (activeScene) {
        if (activeScene.id === 'scene-wishes') clearInterval(wishInterval);
        activeScene.classList.remove('active');
        activeScene.classList.add('exit');
        
        setTimeout(() => {
            activeScene.classList.remove('exit');
            activeScene.classList.add('hidden');
        }, 1200); // Matches transition speed
    }

    const nextScene = document.getElementById(nextSceneId);
    if (nextScene) {
        nextScene.classList.remove('hidden');
        // Small delay to ensure transition triggers
        setTimeout(() => {
            nextScene.classList.add('active');
            
            // Trigger scene-specific logic
            if (nextSceneId === 'scene-wishes') startWishes();
            if (nextSceneId === 'scene-photos') initGallery();
            if (nextSceneId === 'scene-nightsky') initNightSky();
            if (nextSceneId === 'scene-celebration') startFireworks();
            if (nextSceneId === 'scene-ending') stopFireworks();
        }, 50);
    }
}

// --- Scene 3: Wishes Animation ---
const wishes = [
    "May your day be as beautiful as your smile.",
    "Wishing you endless joy and unforgettable moments.",
    "Here's to celebrating the wonderful person you are.",
    "May this year bring you closer to all your dreams.",
    "Your kindness makes the world a better place.",
    "May happiness always find its way to you.",
    "Wishing you a year filled with love, laughter, and success.",
    "May every moment today make you feel special.",
    "You deserve all the beautiful things life has to offer.",
    "Here’s to more adventures, memories, and success.",
    "May your heart be full of love and your days full of light.",
    "Wishing you peace, prosperity, and endless blessings.",
    "May you always have a reason to smile.",
    "Here’s to celebrating you today and always.",
    "May your journey ahead be nothing short of amazing.",
    "Wishing you the strength to conquer any challenge.",
    "May your life be a beautiful story of happiness.",
    "Here’s to health, wealth, and all your heart desires.",
    "May every sunrise bring you fresh hope and joy.",
    "Happy Birthday, to someone truly extraordinary."
];

let wishInterval;
function startWishes() {
    if (wishInterval) clearInterval(wishInterval);
    const wrapper = document.getElementById('wishes-wrapper');
    wrapper.innerHTML = '';
    let currentWish = 0;

    const wishElement = document.createElement('p');
    wishElement.className = 'wish-text';
    wrapper.appendChild(wishElement);

    function showNextWish() {
        if (currentWish >= wishes.length) currentWish = 0;
        
        wishElement.classList.remove('show');
        
        setTimeout(() => {
            wishElement.textContent = wishes[currentWish];
            wishElement.classList.add('show');
            currentWish++;
        }, 1000);
    }

    showNextWish();
    wishInterval = setInterval(showNextWish, 4000);
}

// --- Scene 4: Photo Gallery ---
const photoFiles = [
    '1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', 
    '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg', '11.jpeg'
];

function initGallery() {
    const container = document.getElementById('gallery-container');
    if (container.children.length > 0) return; // already initialized

    photoFiles.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        
        // Randomize initial positions and rotations
        const randomX = (Math.random() - 0.5) * 60; // vw
        const randomY = (Math.random() - 0.5) * 40; // vh
        const randomRot = (Math.random() - 0.5) * 30; // deg
        
        card.style.left = `calc(50% + ${randomX}vw - 100px)`;
        card.style.top = `calc(50% + ${randomY}vh - 150px)`;
        card.style.transform = `rotate(${randomRot}deg)`;
        
        // Add parallax effect on mousemove
        card.dataset.rx = randomX;
        card.dataset.ry = randomY;
        card.dataset.rot = randomRot;

        const img = document.createElement('img');
        img.src = `photos/${file}`;
        img.alt = `Memory ${index + 1}`;
        
        card.appendChild(img);
        container.appendChild(card);
    });

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        if (!document.getElementById('scene-photos').classList.contains('active')) return;
        
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        const cards = document.querySelectorAll('.photo-card');
        cards.forEach((card, index) => {
            const depth = (index % 3) + 1; // 1, 2, or 3
            const rx = parseFloat(card.dataset.rx);
            const ry = parseFloat(card.dataset.ry);
            const rot = parseFloat(card.dataset.rot);
            
            const moveX = mouseX * 50 * depth;
            const moveY = mouseY * 50 * depth;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rot}deg)`;
        });
    });
}

// --- Scene 6: Envelope Interaction ---
function openEnvelope() {
    const envelope = document.getElementById('envelope');
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        document.getElementById('envelope-hint').style.display = 'none';
        
        // Show next button after reading delay
        setTimeout(() => {
            const nextBtn = document.getElementById('letter-next-btn');
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }, 5000);
    }
}

// --- Global Particle System (Petals & Dust) ---
const canvas = document.getElementById('global-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? 'rgba(255, 182, 193, 0.5)' : 'rgba(212, 175, 55, 0.4)'; // Pink petal or gold dust
        if (Math.random() > 0.8) {
            this.size = Math.random() * 8 + 4; // bigger petals
            this.color = 'rgba(139, 0, 0, 0.3)'; // deep red petals
        }
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        // wobble
        this.x += Math.sin(this.y * 0.05) * 0.5;
        
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// --- Scene 7: Night Sky ---
function initNightSky() {
    const container = document.getElementById('stars-container');
    if (container.children.length > 0) return;

    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.backgroundColor = '#FFF';
        star.style.borderRadius = '50%';
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,0.8)`;
        
        // twinkling animation
        const duration = Math.random() * 3 + 1;
        star.style.animation = `pulseOpacity ${duration}s infinite alternate`;
        
        container.appendChild(star);
    }
}

// --- Scene 8: Fireworks ---
const fwCanvas = document.getElementById('fireworks-canvas');
const fwCtx = fwCanvas.getContext('2d');
let fwActive = false;
let fireworks = [];

function resizeFwCanvas() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeFwCanvas);
resizeFwCanvas();

class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.size = Math.random() * 3 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.alpha -= this.decay;
    }
    draw(ctx) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

const fwColors = ['#D4AF37', '#DC143C', '#FFB6C1', '#FFFFFF'];

function createExplosion(x, y) {
    const color = fwColors[Math.floor(Math.random() * fwColors.length)];
    for(let i=0; i<80; i++) {
        fireworks.push(new FireworkParticle(x, y, color));
    }
}

function startFireworks() {
    fwActive = true;
    fireworks = [];
    
    function loop() {
        if(!fwActive) return;
        fwCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // trailing effect
        fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
        
        if (Math.random() < 0.05) {
            createExplosion(Math.random() * fwCanvas.width, Math.random() * (fwCanvas.height * 0.6));
        }
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw(fwCtx);
            if (fireworks[i].alpha <= 0) {
                fireworks.splice(i, 1);
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

function stopFireworks() {
    fwActive = false;
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
}
