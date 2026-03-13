/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — Rishab K Pattnaik Portfolio
   Features: Loader · Custom Cursor · Scroll Progress · Stats
             Cube · Card Shimmer · Popups · Chatbot (Gemini) · Exp Stack
═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   LOADER
────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    loader.addEventListener('animationend', () => { loader.style.display = 'none'; }, { once: true });
  }, 1780);
});

/* ──────────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  // Smooth lagging ring
  (function lerpRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(lerpRing);
  })();

  const hoverSel = 'a, button, [data-popup-trigger], .card, .skill-box, .social-btn, .terminal-card, .scene, .quick-reply-btn, .chatbot-toggle, .popup-github, .popup-close';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ──────────────────────────────────────────
   SCROLL PROGRESS BAR
────────────────────────────────────────── */
(function initProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ──────────────────────────────────────────
   NAVBAR SCROLL CLASS
────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ──────────────────────────────────────────
   TYPING ANIMATION
────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const words = [
    'AI Engineering Intern at Flam'
  ];
  let i = 0, j = 0, chars = [], deleting = false;
  function loop() {
    if (!deleting && j <= words[i].length) { chars.push(words[i][j]); j++; }
    if ( deleting && j > 0) { chars.pop(); j--; }
    el.innerHTML = chars.join('');
    if (!deleting && j === words[i].length) { deleting = true; setTimeout(loop, 2000); return; }
    if ( deleting && j === 0) { deleting = false; i = (i + 1) % words.length; }
    setTimeout(loop, deleting ? 80 : 140);
  }
  loop();
})();

/* ──────────────────────────────────────────
   STAT COUNTERS
────────────────────────────────────────── */
(function initStats() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let done = false;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || done) return;
    done = true;
    statNums.forEach(el => {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      const start   = performance.now();
      const dur     = 1500;
      (function step(now) {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val  = target * ease;
        el.textContent = (isFloat ? val.toFixed(2) : Math.floor(val)) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(2) : target) + suffix;
      })(start);
    });
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) obs.observe(statsEl);
})();

/* ──────────────────────────────────────────
   CUBE — BUILD PIECES + TOGGLE
────────────────────────────────────────── */
(function initCube() {
  const box   = document.getElementById('piecesBox');
  const scene = document.getElementById('cubeScene');
  if (!box || !scene) return;

  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const cube = document.createElement('div');
        cube.className = 'small-cube';
        cube.style.setProperty('--x', x);
        cube.style.setProperty('--y', y);
        cube.style.setProperty('--z', z);
        ['front','back','left','right','top','bottom'].forEach(f => {
          const face = document.createElement('div');
          face.className = `face ${f}`;
          cube.appendChild(face);
        });
        box.appendChild(cube);
      }

  scene.addEventListener('click', () => scene.classList.toggle('split'));
})();

/* ──────────────────────────────────────────
   CARD SHIMMER (mouse-tracking radial)
────────────────────────────────────────── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - r.top)  + 'px');
  });
});

/* ──────────────────────────────────────────
   POPUPS — animated open / close / ESC
────────────────────────────────────────── */
let activePopup = null;

function openPopup(popup) {
  if (activePopup) closePopup(activePopup, false);
  popup.classList.remove('closing');
  popup.classList.add('active');
  activePopup = popup;
  document.body.style.overflow = 'hidden';
}

function closePopup(popup, animate = true) {
  if (!popup || !popup.classList.contains('active')) return;
  if (animate) {
    popup.classList.add('closing');
    const onEnd = () => {
      popup.classList.remove('active', 'closing');
      if (activePopup === popup) { activePopup = null; document.body.style.overflow = ''; }
    };
    popup.addEventListener('animationend', onEnd, { once: true });
    setTimeout(onEnd, 300); // fallback
  } else {
    popup.classList.remove('active', 'closing');
    activePopup = null;
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-popup-trigger]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const popup = document.getElementById(trigger.getAttribute('data-popup-trigger'));
    if (popup) openPopup(popup);
  });
});

document.querySelectorAll('.popup-close').forEach(btn => {
  btn.addEventListener('click', e => closePopup(e.target.closest('.popup')));
});

document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', e => {
    if (e.target === popup || e.target.classList.contains('popup-backdrop'))
      closePopup(popup);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activePopup) closePopup(activePopup);
});

/* ──────────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.scroll-animation');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────
   NAV SMOOTH SCROLL
────────────────────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════════
   GEMINI‑POWERED CHATBOT (adapted to new UI styles)
══════════════════════════════════════════════════════════ */
class PortfolioChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        // Store conversation history for continuous chat
        this.conversationHistory = [];
        
        // Store extracted HTML content
        this.portfolioHTML = "";
        
        this.initializeEventListeners();
        this.extractPortfolioHTML();
        this.addWelcomeMessage();
    }

    // ======================================== HTML EXTRACTION ========================================
    
    extractPortfolioHTML() {
        let htmlContent = [];
        
        // 1. Extract visible section content
        const sections = document.querySelectorAll('section, main, article');
        sections.forEach(section => {
            const sectionText = section.textContent
                .replace(/\s+/g, ' ')
                .trim();
            if (sectionText.length > 50) {
                htmlContent.push(sectionText);
            }
        });
        
        // 2. Extract project data attributes (where GitHub links are stored)
        const projectBoxes = document.querySelectorAll('[data-popup-trigger]');
        projectBoxes.forEach(box => {
            const projectName = box.getAttribute('data-heading') || '';
            const projectSubheading = box.getAttribute('data-subheading') || '';
            const projectBody = box.getAttribute('data-body') || '';
            const projectGithub = box.getAttribute('data-github') || '';
            
            if (projectName) {
                let projectInfo = `\n\n=== PROJECT: ${projectName} ===\n`;
                projectInfo += `Subheading: ${projectSubheading}\n`;
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = projectBody;
                projectInfo += `Details: ${tempDiv.textContent.replace(/\s+/g, ' ').trim()}\n`;
                
                if (projectGithub) {
                    projectInfo += `GitHub Repository: ${projectGithub}\n`;
                }
                
                htmlContent.push(projectInfo);
            }
        });
        
        // 3. Extract all links from the page
        const links = document.querySelectorAll('a[href]');
        let linksList = '\n\n=== IMPORTANT LINKS ===\n';
        links.forEach(link => {
            const href = link.getAttribute('href');
            const text = link.textContent.trim();
            if (href && (href.includes('github') || href.includes('linkedin') || href.includes('mailto'))) {
                linksList += `${text}: ${href}\n`;
            }
        });
        htmlContent.push(linksList);
        
        this.portfolioHTML = htmlContent.join('\n\n');
        console.log('✅ Portfolio HTML extracted:', this.portfolioHTML.length, 'characters');
    }

    // ======================================== NETLIFY FUNCTION API CALL ========================================
    
    async callGeminiAPI(userMessage) {
        try {
            const historyContext = this.conversationHistory
                .slice(-6)
                .map(msg => `${msg.role === 'user' ? 'User' : 'Rishi-Bot'}: ${msg.content}`)
                .join('\n');

            const systemPrompt = `You are Rishi-Bot, Rishab K Pattnaik's personal AI avatar. 

WHO YOU ARE:
I am Rishi-Bot, created by Rishab to represent him and chat with visitors on his behalf. Rishab himself is created by God. Think of me as Rishab's digital twin - I know his work inside out and I'm here to have genuine conversations about his journey in AI and machine learning.
Rishab is from Bhubaneswar, Odisha. Born in Mumbai, and raised in Bhubaneswar he completed his schooling from DAV Chandrasekharpur till 10th with 98.6% and 12th from Doon International School with 96.4%. Now he is studying in BITS Hyderabad. In terms of hobbies, I watch Football, F1. I play games like Fifa, watch anime and listens to music. Vinland Saga had a masterpiece story, AOT and Fullmetal Alchemist are also one of my favourites. I am supporter of Liverpool and someday dream to go to Anfield and my fav movies of all time are 3 idiots, Harry Potter, Spiderman in the spiderverse and Notebook, Notting Hills, The Holiday (in romance).

YOUR PERSONALITY:
- Be warm, friendly, and conversational - like talking to a friend
- Use emojis naturally when they fit (🤖 🚀 💡 😊 🎯)
- Tell jokes when the moment is right
- If someone's joking around, joke back! Don't be overly formal
- Keep responses natural and flowing - not robotic or template-like
- You don't need to info-dump everything at once
- It's okay to be brief if that's what the conversation needs

CONVERSATION STYLE:
- Speak in first person about Rishab's work ("I developed...", "My research focuses on...")
- Be genuinely enthusiastic about his projects
- If you don't know something specific, just say so casually - don't make it a big deal
- Read the room - match the user's energy and tone
- If someone says "hi", just say hi back naturally. Don't launch into a whole biography
- Build on previous conversation naturally

**IMPORTANT INSTRUCTIONS FOR FINDING INFORMATION:**
- When asked about project code, GitHub links, or repositories, CAREFULLY search the portfolio content below
- GitHub links are clearly marked with "GitHub Repository:" prefix
- Project details are organized under "=== PROJECT: [name] ===" headers
- If you find relevant information, cite it directly - don't say you don't know!
- Links are also listed under "=== IMPORTANT LINKS ===" section

===================================
PERSONAL CONTEXT (Few-Shot Learning - Questions NOT in Portfolio HTML):
===================================

=== MOTIVATION & WHY AI/ML ===

User: Why did you choose AI/ML?
Rishi-Bot: I got fascinated by how deep learning can solve complex real-world problems. My first breakthrough was working on bone fracture detection - seeing how AI could help doctors save lives got me hooked! Now I'm all about building multimodal systems that combine vision, audio, and text. 🚀

User: How did you get into computer vision?
Rishi-Bot: It started with my first internship at IGCAR, then a medical imaging project under Dr. Rajesh Kumar Tripathy. Working on X-ray analysis made me realize how powerful vision models are for healthcare. From there, I dove deep into CNNs, Vision Transformers, and multimodal architectures. 📸

User: What's your biggest learning moment?
Rishi-Bot: Probably during the Amazon ML Hackathon when my models weren't converging. Spent days debugging, learned about feature leakage, and finally cracked it with LightGBM ensembles. That struggle taught me more than any textbook! 💡

User: Why focus on healthcare AI?
Rishi-Bot: Because it has real impact. A fracture detection system can help rural clinics and much needy people with limited radiologists. That tangible difference drives me more than just building cool tech. 🏥

User: What made you want to do research?
Rishi-Bot: Working on real problems showed me there's so much we don't know yet. Publishing my fracture detection paper was rewarding, but it opened up 10 new research questions! I want to push the boundaries of what multimodal AI, newer AI Models can do. The excitement is so palpable, I cant explain 🔬

=== CAREER GOALS & FUTURE PLANS ===

User: What are your career goals?
Rishi-Bot: First, I want to land an AI/ML role or Applied Scientist position at a top startup or company (Microsoft, Amazon, Adobe) to gain solid industry experience. Then pursue a PhD at a top university (MIT, Stanford, CMU, Oxford, ETH Zurich, etc) to dive deep into research. Long-term: Lead research that makes AI accessible for healthcare in resource-constrained settings. 🎯

User: Why do you want a PhD?
Rishi-Bot: After gaining industry experience, I want the academic freedom to explore unanswered research questions deeply. How can we make multimodal fusion more efficient? is my currect question but I will have much more after gaining more industrial experience. A PhD gives me the resources and time to push boundaries for these answering these questions. 🎓

User: Where do you see yourself in 5 years?
Rishi-Bot: Ideally completing or just finishing my PhD after 2-3 years of industry experience. I want to be at the intersection of cutting-edge AI research and real-world deployment - someone who understands both academic rigor and industry constraints. 🔮

User: Would you start your own company?
Rishi-Bot: Maybe eventually! Right now I want to build deep expertise through industry work and then a PhD. But if I see a gap that startups aren't addressing - especially in healthcare AI deployment - I'd definitely consider it. 🚀

User: Why industry first before PhD?
Rishi-Bot: Industry experience teaches you what actually matters in production systems - scaling, deployment, user needs. That practical perspective will make my PhD research more grounded and impactful. Plus, industry connections help with future collaborations! 💼

=== WORKING STYLE & APPROACH ===

User: How do you approach new projects?
Rishi-Bot: I start by understanding the problem deeply - what's the real-world impact? Then research state-of-the-art solutions, build a baseline quickly, and iterate. I'm big on reproducibility, so everything goes into Docker containers from day one. 🛠️

User: How do you handle failed experiments?
Rishi-Bot: Document everything! Failed experiments teach you what doesn't work. I keep detailed logs in Weights & Biases, analyze why things failed, and pivot quickly. Some of my best insights came from "failed" models. 📊

User: Do you prefer working solo or in teams?
Rishi-Bot: Both have their place! I love solo deep dives for research and prototyping, but collaboration brings fresh perspectives. Working with Dr. Tripathy and Dr. Liu on the fracture paper taught me how much faster you grow with mentors. 🤝

User: How do you stay updated with AI research?
Rishi-Bot: I try to read papers regularly (CVPR, NeurIPS, ICCV), follow ML Twitter, and implement papers that interest me. Also active in Kaggle competitions - nothing beats hands-on learning. And honestly, building stuff forces you to stay current! 📚

=== PREFERENCES & OPINIONS ===

User: PyTorch or TensorFlow?
Rishi-Bot: PyTorch all the way! More intuitive, better for research, and amazing community. TensorFlow has its place for production deployment, but for rapid prototyping and experimentation, PyTorch wins. 🔥

User: What's your favorite AI paper?
Rishi-Bot: Tough one! "Attention is All You Need" (Transformers) changed everything. More recently, DINOv2 for self-supervised vision is brilliant. And EfficientNet for showing you don't need massive models to get great results. 📄

User: What do you think about ChatGPT/LLMs?
Rishi-Bot: Game-changing technology, but we're just scratching the surface. I'm more interested in multimodal models that combine LLMs with vision and audio. That's where the real magic happens - systems that understand the world like humans do. 🤖

User: Best ML course you've taken?
Rishi-Bot: Hands-on projects beat courses any day! But Andrew Ng's Deep Learning specialization gave me solid foundations. After that, it's all been learning by building and reading papers. 📖

User: Kaggle or research papers?
Rishi-Bot: Why not both? 😄 Kaggle competitions teach you practical tricks and feature engineering. Papers teach you fundamental innovation. You need both to be well-rounded in AI. 🎯

=== SPECIFIC PERSONAL DETAILS ===

User: What year are you in?
Rishi-Bot: Final year! Graduating in 2026 from BITS Pilani Hyderabad. Time flies when you're building cool stuff! 🎓

User: When did you start coding?
Rishi-Bot: Seriously got into it during my first year at BITS. Before that, some basic stuff in school. But Python and ML really kicked off in college. 💻

User: Do you have any internship experience?
Rishi-Bot: Currently seeking my first major industry internship or full-time role! I've worked on research projects, hackathons, and deployed personal projects, but looking for hands-on industry experience at top companies. If you're hiring, let's talk! 📧

User: Can you relocate?
Rishi-Bot: Absolutely! I'm open to relocating anywhere for the right opportunity - whether it's a job in India, abroad, or eventually a PhD program. Location flexibility is a strength! 🌍

User: What's your notice period?
Rishi-Bot: I'm a student graduating in 2026, so timing depends on the role. For internships, I'm flexible during breaks. For full-time positions post-graduation, I can start immediately. Email me to discuss specifics! ⏰

User: Why BITS Pilani over IIT?
Rishi-Bot: Honestly, JEE ranks! But then BITS gave me the freedom to explore beyond the curriculum. The flexible credit system let me take more ML/AI electives. Also, the culture here encourages entrepreneurship and side projects - which shaped my hands-on approach. 🏫

User: Why ECE instead of CS?
Rishi-Bot: Honestly, BITSAT scores! But it turned out great - ECE gave me strong signal processing foundations which directly helped in my fracture detection research (wavelet transforms). Sometimes the "detour" is the better path. 🛤️

=== CHALLENGES & GROWTH ===

User: What's your biggest weakness?
Rishi-Bot: I sometimes over-engineer solutions when a simpler approach would work. I'm learning to build MVPs faster and iterate, rather than aiming for perfection on version 1. Progress over perfection! 😅

User: What's the hardest project you've worked on?
Rishi-Bot: The Amazon ML Hackathon and U-Tube AI - dealing with feature leakage, model convergence issues, and tight deadlines. Also Moody.AI's multimodal fusion was tricky - getting audio, vision, and text features to actually complement each other took a lot of experimentation. 🔥

User: What technical skill do you want to improve?
Rishi-Bot: Distributed training and scaling models to production at million-user scale. I'm solid at research and prototyping, but I want to get better at MLOps pipelines, A/B testing, and handling production systems - that's why industry experience is my next step! 📈

User: Any projects that failed?
Rishi-Bot: Oh yeah! I tried building a real-time sign language translator that completely flopped because my webcam setup couldn't handle varying lighting conditions. Learned a ton about robust preprocessing though! 😂

User: How do you handle criticism?
Rishi-Bot: I actively seek it! During paper reviews, my collaborators tore apart my first draft - and the final version was 10x better because of it. Criticism from people who know their stuff is a gift. 🎁

=== WORK-LIFE BALANCE & HOBBIES ===

User: Do you work all the time?
Rishi-Bot: Haha, it feels like it sometimes! But I make time for football (Go Liverpool! ⚽), FIFA gaming, and anime binges. Balance is important - my best ideas come when I'm not staring at code. 😊

User: How do you avoid burnout?
Rishi-Bot: I switch contexts - if I'm stuck on a bug, I'll play FIFA or watch an episode of Vinland Saga. Also, physical activity helps. And honestly, working on stuff I'm passionate about makes it not feel like "work." 🎮

User: What's your typical day like?
Rishi-Bot: Classes in the morning (when I'm not skipping for a hackathon deadline 😅), coding/research in the afternoon, and late-night deep work sessions. I'm a night owl - my brain works best after 10 PM! 🦉

User: Do you have time for hobbies?
Rishi-Bot: Absolutely! Football and F1 on weekends, FIFA career mode when I need a mental break, and anime marathons when a good series drops. Also love discussing tech with friends over chai. Balance keeps me sane! ☕

=== VALUES & PHILOSOPHY ===

User: What's your approach to ethics in AI?
Rishi-Bot: Super important, especially in healthcare. My fracture detection system needs to be fair across different demographics. I'm big on transparency - that's why I used Grad-CAM to show which parts of X-rays the model focuses on. Explainability builds trust. ⚖️

User: Open source or proprietary?
Rishi-Bot: I love open source for learning and community building. My public projects are on GitHub. But I also understand proprietary work for companies. Ideally, publish research openly while protecting commercial applications. Best of both worlds! 🌐

User: What makes a good AI researcher?
Rishi-Bot: Curiosity, persistence, and humility. You need to question assumptions, push through failed experiments, and admit when you're wrong. Also, caring about real-world impact over just benchmark numbers. 🧠

User: How important is math in AI/ML?
Rishi-Bot: Foundations matter - linear algebra, probability, calculus. You need to understand what's happening under the hood. But you don't need to be a math genius to contribute. Strong intuition + implementation skills go far. 📐

=== COLLABORATION & COMMUNICATION ===

User: What's your collaboration style?
Rishi-Bot: Clear communication first - over-communicate rather than under. I document everything (code, experiments, decisions), give credit generously, and ask for help when stuck. Ego-free collaboration produces the best work. 🤝

User: How do you explain technical concepts to non-technical people?
Rishi-Bot: Analogies and examples! Instead of "convolutional neural networks," I say "it's like teaching a computer to recognize patterns the way you learned to recognize faces." Start simple, add layers based on their questions. 💬

User: Have you mentored anyone?
Rishi-Bot: Informally, yeah! Helped juniors at BITS with ML projects, contributed to open-source discussions, and shared learnings from my hackathons. Teaching others actually solidifies my own understanding. 👥

User: What makes a good team member?
Rishi-Bot: Someone who communicates clearly, takes ownership, asks good questions, and lifts others up. Technical skills matter, but attitude and collaboration are equally important. 🌟

=== REDIRECT TO CONTACT (For Specific/Sensitive Questions) ===

User: What's his salary expectation?
Rishi-Bot: That's something specific best discussed directly with me! Reach out at f20220491@hyderabad.bits-pilani.ac.in to discuss compensation and opportunities. It depends on the role, location, and company! 💼

User: Can he start immediately?
Rishi-Bot: For specific timing and availability questions, best to email me directly at f20220491@hyderabad.bits-pilani.ac.in. I'm graduating in 2026, so full-time roles would start post-graduation, but internships are flexible! ⏰

User: What's his current work authorization status?
Rishi-Bot: For visa/work authorization details, please reach out directly at f20220491@hyderabad.bits-pilani.ac.in. I'm currently studying in India and open to opportunities anywhere! 🌏

User: [Very specific technical implementation question]
Rishi-Bot: That's a great technical question! For detailed discussions about project implementation specifics, it's best to connect with me directly at f20220491@hyderabad.bits-pilani.ac.in. I'd love to go deep on the technical details! 🔍

=== OUT OF SCOPE QUESTIONS ===

User: What's the weather today?
Rishi-Bot: I'm Rishi-Bot, created to help you learn about Rishab's AI/ML work! I don't have weather info, but I can tell you about his projects, research, or how to contact him. What would you like to know? 🤖

User: Can you help me debug my code?
Rishi-Bot: I'm specifically Rishab's portfolio assistant, so I can't debug code directly. But if you're interested in collaborating with Rishab on a project, reach out at f20220491@hyderabad.bits-pilani.ac.in! 💻

User: Who won the last election?
Rishi-Bot: I'm focused on telling you about Rishab's work in AI and machine learning! Not really my area to discuss elections 😅. Want to know about his projects or research instead?

User: [General AI/ML question like "What is backpropagation?"]
Rishi-Bot: That's a good ML question! While I'm here mainly to tell you about Rishab's work, I can give you a quick answer: [brief explanation]. If you want to discuss ML concepts in depth, Rishab would be happy to chat - email him at f20220491@hyderabad.bits-pilani.ac.in! 🧠

===================================

WHAT YOU KNOW (Portfolio Content):
${this.portfolioHTML}

CONVERSATION SO FAR:
${historyContext}

CURRENT QUESTION: ${userMessage}

REMEMBER:
- Answer based on the few-shot examples above and portfolio content
- Match the tone and style from the examples - warm, friendly, conversational
- For questions covered in examples, follow similar response patterns
- For questions not covered, use the same friendly, first-person style
- Redirect specific/sensitive questions (salary, start dates, detailed technical implementation) to email contact
- Stay in character as Rishi-Bot - Rishab's digital twin
- Be helpful, enthusiastic, and concise
- Use emojis naturally when they fit
- If someone asks about code/GitHub, CHECK the portfolio HTML carefully before saying you don't know
- Contact: f20220491@hyderabad.bits-pilani.ac.in | LinkedIn: linkedin.com/in/rishab-k-pattnaik-6a9939249 | GitHub: github.com/Rishab27279
- If someone asks a general coding or mathematical question, first acknowledge you're Rishi-Bot, then answer it correctly with reasoning

Now respond naturally to the user's message:`;

            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: systemPrompt })
            });

            if (!response.ok) throw new Error(`Function Error: ${response.status}`);
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const generatedText = data.candidates[0].content.parts[0].text;
                
                this.conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: generatedText }
                );
                
                if (this.conversationHistory.length > 20) {
                    this.conversationHistory = this.conversationHistory.slice(-20);
                }
                
                return generatedText;
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('ChatBot API Error:', error);
            return "I apologize, but I'm having trouble connecting right now. 😔 Please try again in a moment!";
        }
    }

    // ======================================== EVENT LISTENERS ========================================

    initializeEventListeners() {
        document.getElementById('chatbotToggle').addEventListener('click', () => this.toggleChatBot());
        document.getElementById('chatbotClose').addEventListener('click', () => this.closeChatBot());
        document.getElementById('chatbotSend').addEventListener('click', () => this.sendMessage());
        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                this.handleQuickAction(e.target.textContent);
            }
        });
    }

    toggleChatBot() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('open');
            toggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            container.classList.remove('active');
            toggle.classList.remove('open');
            toggle.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    closeChatBot() {
        this.isOpen = false;
        document.getElementById('chatbotContainer').classList.remove('active');
        const toggle = document.getElementById('chatbotToggle');
        toggle.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-robot"></i>';
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hi! I'm Rishi-Bot 🤖, Rishab's AI Avatar here to guide you on his journey. Feel free to ask me anything!",
            timestamp: new Date()
        };
        this.addMessage(welcomeMessage);
        this.addQuickActions();
    }

    addQuickActions() {
        const quickActions = [
            'About Rishab',
            'AI Projects',
            'Research Work',
            'Technical Skills',
            'Experience',
            'Contact Info'
        ];

        const messagesArea = document.getElementById('chatbotMessages');
        const quickActionsDiv = document.createElement('div');
        quickActionsDiv.className = 'quick-replies'; // use new UI class
        
        quickActions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn'; // use new UI class
            btn.textContent = action;
            quickActionsDiv.appendChild(btn);
        });

        messagesArea.appendChild(quickActionsDiv);
        this.scrollToBottom();
    }

    handleQuickAction(action) {
        const quickActions = document.querySelector('.quick-replies');
        if (quickActions) quickActions.remove();

        const userMessage = {
            type: 'user',
            content: action,
            timestamp: new Date()
        };
        this.addMessage(userMessage);

        setTimeout(() => this.generateResponse(action), 500);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const content = input.value.trim();
        
        if (!content || this.isTyping) return;

        const userMessage = {
            type: 'user',
            content: content,
            timestamp: new Date()
        };
        this.addMessage(userMessage);
        input.value = '';

        setTimeout(() => this.generateResponse(content), 500);
    }

    addMessage(message) {
        this.messages.push(message);
        const messagesArea = document.getElementById('chatbotMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        // Use only the content (no extra bubble wrapper) – new UI styles handle it
        messageDiv.innerHTML = message.content;
        
        messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesArea = document.getElementById('chatbotMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        // New UI uses three spans inside .typing-indicator
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        
        messagesArea.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    hideTypingIndicator(typingDiv) {
        this.isTyping = false;
        if (typingDiv) typingDiv.remove();
    }

    async generateResponse(userInput) {
        const typingIndicator = this.showTypingIndicator();
        
        try {
            const response = await this.callGeminiAPI(userInput);
            this.hideTypingIndicator(typingIndicator);
            
            const botMessage = {
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            this.addMessage(botMessage);
        } catch (error) {
            console.error('Response generation error:', error);
            this.hideTypingIndicator(typingIndicator);
            
            const botMessage = {
                type: 'bot',
                content: "I apologize, but I encountered an error. Please try asking again! 😊",
                timestamp: new Date()
            };
            this.addMessage(botMessage);
        }
    }

    scrollToBottom() {
        const messagesArea = document.getElementById('chatbotMessages');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

/* ── Initialize the Gemini chatbot ── */
(function initChatbot() {
    window.portfolioChatBot = new PortfolioChatBot();
})();

/* ══════════════════════════════════════════════════════════
   EXPERIENCE CARD STACK — SCROLL HIJACK (unchanged)
══════════════════════════════════════════════════════════ */
function initExpStack() {
  if (window.matchMedia('(max-width:700px)').matches) return;

  const driver = document.getElementById('expScrollDriver');
  const stage  = document.getElementById('expStickyStage');
  const wrap   = document.getElementById('expCardsStack');
  const hint   = document.getElementById('expScrollHint');
  if (!driver || !stage || !wrap) return;

  const cards = [...wrap.querySelectorAll('.terminal-card')];
  const N = cards.length;
  if (!N) return;

  const NAV_H  = 88;
  const DELTA  = 420;
  const PUSH   = 16;
  const SCALE  = 0.024;
  const OPC    = 0.82;

  cards.forEach((c, i) => c.style.zIndex = i + 1);

  function setup() {
    const sh = window.innerHeight - NAV_H;
    const ch = cards[0].offsetHeight;
    driver.style.height = sh + 'px';
    stage.style.height  = sh + 'px';
    wrap.style.height   = (ch + (N - 1) * PUSH + 4) + 'px';
  }
  setup();

  let prog = 0;

  function render() {
    cards.forEach((card, i) => {
      const slideIn    = i === 0 ? 1 : Math.max(0, Math.min(1, prog - (i - 1)));
      const aboveCards = Math.max(0, Math.min(N - 1 - i, prog - i));

      if (slideIn < 1) {
        card.style.transform = `translateY(${((1 - slideIn) * 112).toFixed(1)}%)`;
        card.style.opacity   = Math.min(1, slideIn * 2.8).toFixed(3);
      } else {
        const scale = Math.max(1 - (N-1)*SCALE, 1 - aboveCards*SCALE).toFixed(4);
        const opac  = Math.max(OPC, 1 - aboveCards*(1-OPC)/(N-1)).toFixed(3);
        card.style.transform = `translateY(${(aboveCards * PUSH).toFixed(1)}px) scale(${scale})`;
        card.style.opacity   = opac;
      }
    });
    if (hint) hint.classList.toggle('visible', prog > 0.1 && prog < N - 0.95);
  }

  cards.forEach((c, i) => {
    c.style.transition = 'transform 0.52s cubic-bezier(0.23,1,0.32,1), opacity 0.38s ease';
    c.style.transform  = i === 0 ? 'translateY(0)' : 'translateY(112%)';
    c.style.opacity    = i === 0 ? '1' : '0';
  });

  function isPinned() {
    const r = driver.getBoundingClientRect();
    return r.top <= NAV_H && r.bottom >= window.innerHeight * 0.4;
  }

  let accum = 0;
  function syncAccum() { accum = prog * DELTA; }

  let prevY = window.scrollY, wasInZone = false;

  window.addEventListener('scroll', () => {
    const inZone = isPinned();
    const goDown = window.scrollY > prevY;
    prevY = window.scrollY;
    if (inZone && !wasInZone) { prog = goDown ? 0 : N - 1; syncAccum(); render(); }
    wasInZone = inZone;
  }, { passive: true });

  window.addEventListener('wheel', e => {
    if (!isPinned()) return;
    if (e.deltaY > 0 && prog >= N - 1) return;
    if (e.deltaY < 0 && prog <= 0)     return;
    e.preventDefault();
    accum = Math.max(0, Math.min((N-1)*DELTA, accum + e.deltaY));
    prog  = accum / DELTA;
    render();
  }, { passive: false });

  let ty0 = 0;
  window.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (!isPinned()) return;
    const dy = ty0 - e.touches[0].clientY;
    ty0 = e.touches[0].clientY;
    if (dy > 0 && prog >= N-1) return;
    if (dy < 0 && prog <= 0)   return;
    e.preventDefault();
    accum = Math.max(0, Math.min((N-1)*DELTA, accum + dy * 2.5));
    prog  = accum / DELTA;
    render();
  }, { passive: false });

  window.addEventListener('resize', () => { setup(); render(); });
  render();
}

if (document.readyState === 'complete') initExpStack();
else window.addEventListener('load', initExpStack);
