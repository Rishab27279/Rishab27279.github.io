// Enhanced JavaScript functionality with ChatBot integration
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading overlay
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 500);
    }, 1500);

    // Enhanced header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function() {
        document.body.classList.toggle('light-theme');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
    });

    // Popup functionality for clickable boxes
    document.querySelectorAll('[data-popup-trigger]').forEach(box => {
        box.addEventListener('click', function() {
            const popupId = this.getAttribute('data-popup-trigger');
            const popup = document.getElementById(popupId);
            const heading = this.getAttribute('data-heading');
            const subheading = this.getAttribute('data-subheading');
            const body = this.getAttribute('data-body');
            const github = this.getAttribute('data-github');

            if (popup) {
                popup.querySelector('.popup-heading').textContent = heading;
                popup.querySelector('.popup-subheading').textContent = subheading;
                popup.querySelector('.popup-body').innerHTML = body;
                popup.querySelector('.popup-github').href = github;

                // Add animation class and show popup
                popup.style.display = 'flex';
                setTimeout(() => {
                    popup.classList.add('active');
                }, 10);
            }
        });
    });

    // Close popups
    document.querySelectorAll('.popup-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.popup');
            popup.classList.remove('active');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        });
    });

    // Close popup on outside click
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.popup').forEach(popup => {
                popup.style.display = 'none';
            });
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.scroll-animation').forEach(el => {
        observer.observe(el);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Enhanced typing animation for subtitle
    function typeSubtitle() {
        const typingElement = document.getElementById('typingText');
        const text = "Deep Learning • Computer Vision • Medical AI • Generative AI • Agentic AI";
        let i = 0;
        
        typingElement.textContent = '';
        
        function typeChar() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 80);
            } else {
                // Stop cursor blinking after typing is complete
                setTimeout(() => {
                    typingElement.style.borderRight = 'none';
                }, 2000);
            }
        }
        
        setTimeout(typeChar, 2000); // Start after 2 seconds
    }
    
    typeSubtitle();

    // Update active navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Parallax effect for hero particles
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-particles');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add loading class to images for better UX
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Error handling for failed image loads
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);
        });
    });

    // Performance optimization: Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Initialize ChatBot
    initializeChatBot();
});

// ======================================== GEMINI-POWERED CHATBOT - NETLIFY SECURE VERSION ========================================

class PortfolioChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        // REMOVED: API key no longer stored on client side
        
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
                // Create a structured project entry
                let projectInfo = `\n\n=== PROJECT: ${projectName} ===\n`;
                projectInfo += `Subheading: ${projectSubheading}\n`;
                
                // Extract text from HTML in data-body
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
        console.log('📊 First 500 chars:', this.portfolioHTML.substring(0, 500));
    }

    // ======================================== NETLIFY FUNCTION API CALL ========================================
    
    async callGeminiAPI(userMessage) {
        try {
            // Build conversation history context
            const historyContext = this.conversationHistory
                .slice(-6)  // Last 3 exchanges
                .map(msg => `${msg.role === 'user' ? 'User' : 'Rishi-Bot'}: ${msg.content}`)
                .join('\n');

            // Build the complete prompt
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

            // Call Netlify Function instead of Gemini API directly
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: systemPrompt
                })
            });

            if (!response.ok) {
                throw new Error(`Function Error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const generatedText = data.candidates[0].content.parts[0].text;
                
                // Update conversation history
                this.conversationHistory.push(
                    { role: 'user', content: userMessage },
                    { role: 'assistant', content: generatedText }
                );
                
                // Keep history manageable (last 10 exchanges)
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
        document.getElementById('chatbotToggle').addEventListener('click', () => {
            this.toggleChatBot();
        });

        document.getElementById('chatbotClose').addEventListener('click', () => {
            this.closeChatBot();
        });

        document.getElementById('chatbotSend').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
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
            toggle.classList.add('active');
            toggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            container.classList.remove('active');
            toggle.classList.remove('active');
            toggle.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    closeChatBot() {
        this.isOpen = false;
        document.getElementById('chatbotContainer').classList.remove('active');
        const toggle = document.getElementById('chatbotToggle');
        toggle.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-robot"></i>';
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hi! I'm Rishi-Bot 🤖, Rishab's AI Avatar here to guide you in him journey. Feel free to ask me what you have on your mind....",
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
        quickActionsDiv.className = 'chatbot-quick-actions';
        
        quickActions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = action;
            quickActionsDiv.appendChild(btn);
        });

        messagesArea.appendChild(quickActionsDiv);
        this.scrollToBottom();
    }

    handleQuickAction(action) {
        const quickActions = document.querySelector('.chatbot-quick-actions');
        if (quickActions) {
            quickActions.remove();
        }

        const userMessage = {
            type: 'user',
            content: action,
            timestamp: new Date()
        };
        this.addMessage(userMessage);

        setTimeout(() => {
            this.generateResponse(action);
        }, 500);
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

        setTimeout(() => {
            this.generateResponse(content);
        }, 500);
    }

    addMessage(message) {
        this.messages.push(message);
        const messagesArea = document.getElementById('chatbotMessages');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${message.content}
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;
        
        messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const messagesArea = document.getElementById('chatbotMessages');
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-message';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span>Rishi-Bot is thinking</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesArea.appendChild(typingDiv);
        this.scrollToBottom();
        
        return typingDiv;
    }

    hideTypingIndicator(typingDiv) {
        this.isTyping = false;
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    async generateResponse(userInput) {
        const typingIndicator = this.showTypingIndicator();
        
        try {
            // Call Netlify Function via callGeminiAPI
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

    formatTime(timestamp) {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        const messagesArea = document.getElementById('chatbotMessages');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

// ======================================== UTILITY FUNCTIONS ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const optimizedScrollHandler = debounce(() => {
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

function initializeChatBot() {
    window.portfolioChatBot = new PortfolioChatBot();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
        }, 0);
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const popup = document.querySelector('.popup.active');
        if (popup) {
            popup.classList.remove('active');
        }
    }
});

document.addEventListener('click', function(event) {
    const popup = document.querySelector('.popup.active');
    if (popup && event.target === popup) {
        popup.classList.remove('active');
    }
});
