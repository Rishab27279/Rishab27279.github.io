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

// ======================================== GEMINI-POWERED CHATBOT - SIMPLIFIED ========================================

class PortfolioChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        
        this.geminiApiKey = "AIzaSyD-5TpF4TgEj-4x7ZtoVuRH6fUuVPW7BFI"; 
        
        // NEW: Store conversation history for continuous chat
        this.conversationHistory = [];
        
        // NEW: Store extracted HTML content
        this.portfolioHTML = "";
        
        this.initializeEventListeners();
        this.extractPortfolioHTML();  // NEW: Extract HTML on load
        this.addWelcomeMessage();
    }

    // ======================================== NEW: HTML EXTRACTION ========================================
    
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
    
    // 2. **NEW: Extract project data attributes (where GitHub links are stored)**
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
    
    // 3. **NEW: Extract all links from the page**
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
    console.log('📊 First 500 chars:', this.portfolioHTML.substring(0, 500)); // Debug preview
}

    // ======================================== NEW: GEMINI API CALL ========================================
    
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
I, Rishab am from Bubaneswar, Odisha. Born in Mumbai, and raised in Bhubaneswar I completed my schooling from DAV Chandrasekharpur till 10th with 98.6% and 12th from Doon International School with 96.4%. Now i am studying in BITS Hyderabad. In terms of hobbies, I watch Football, F1. I play games like Fifa, watch anime and listens to music. Vinland Saga had a masterpiece story, AOT and Fullmetal Alchemist are laos one of my favourites. I am supporter of Liverpool and my fav movies of all time are 3 idiots, Harry Potter, Spiderman in teh spiderverse and Notebook (in romance).   

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

WHAT YOU KNOW (Portfolio Content):
${this.portfolioHTML}

CONVERSATION SO FAR:
${historyContext}

CURRENT QUESTION: ${userMessage}

REMEMBER:
- Answer based on the portfolio content when relevant
- Be helpful but conversational
- Keep it real - you're Rishab's voice, not a corporate FAQ bot
- If info isn't available, suggest what you DO know instead
- Contact: f20220491@hyderabad.bits-pilani.ac.in | LinkedIn: linkedin.com/in/rishab-k-pattnaik-6a9939249 | GitHub: github.com/Rishab27279

Now respond naturally to the user's message:`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
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
            console.error('Gemini API Error:', error);
            return "I apologize, but I'm having trouble connecting right now. 😔 Please try again in a moment!";
        }
    }

    // ======================================== EXISTING METHODS (KEPT SAME) ========================================

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

    // MODIFIED: Now calls Gemini API instead of knowledge base
    async generateResponse(userInput) {
        const typingIndicator = this.showTypingIndicator();
        
        try {
            // Call Gemini API
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

// ======================================== UTILITY FUNCTIONS (KEPT SAME) ========================================

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
