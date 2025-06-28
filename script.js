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

// ======================================== ENHANCED CHATBOT IMPLEMENTATION ========================================

class PortfolioChatBot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.initializeEventListeners();
        this.addWelcomeMessage();
    }

    initializeKnowledgeBase() {
        return {
            // Personal Information
            'about': {
                keywords: ['about', 'who', 'profile', 'bio', 'background', 'introduction', 'tell me about'],
                response: "I'm Rishab K Pattnaik, a Machine Learning Engineer and Electronics & Communication Engineering student at BITS Pilani Hyderabad Campus. I'm passionate about developing AI solutions for real-world challenges, specializing in medical imaging through deep learning architectures and wavelet-CNN integration. My work spans from medical AI applications to intelligent document processing systems, exploring cutting-edge architectures like Vision Transformers and Mamba while building practical solutions using PyTorch and TensorFlow."
            },
            'education': {
                keywords: ['education', 'study', 'degree', 'university', 'college', 'bits', 'academic', 'coursework', 'school'],
                response: "I'm currently pursuing a Bachelor of Engineering in Electronics and Communication Engineering at BITS Pilani Hyderabad Campus. My relevant coursework includes Machine Learning for Electronics Engineer, Neural Networks and Fuzzy Logic, Deep Learning, Digital Signal Processing, Signals and Systems, Probability and Statistics, Microprocessor and Interfacing, and Linear Algebra. This comprehensive curriculum provides a strong foundation for my AI and ML specialization."
            },
            'experience': {
                keywords: ['experience', 'work', 'job', 'internship', 'research', 'position', 'career', 'employment'],
                response: "I have diverse experience including: Currently working as AI Research Intern at Hamad Medical Corporation, Qatar (May 2025 - Present) focusing on emergency research under Dr. Sarada Prasad Dakua. Previously served as Research Assistant at BITS Pilani Hyderabad (Aug 2024 - Present) under Dr. Rajesh Kumar Tripathy, and completed Research Internship at IGCAR Kalpakkam (May 2024 - Aug 2024) working on camouflaged object detection using Meta's SAM model."
            },
            'skills': {
                keywords: ['skills', 'technology', 'programming', 'languages', 'framework', 'tools', 'technical', 'expertise'],
                response: "My technical arsenal includes: Programming Languages (Python, C, SQL, Git, Verilog), AI/ML Frameworks (PyTorch, TensorFlow, Computer Vision, Scikit-learn, Keras, NumPy, Pandas, Matplotlib), Development Tools (Docker, LangChain, FastAPI, Android Studio, Streamlit), and AI Specializations (Machine Learning, Deep Learning, Generative AI, LLM). I'm proficient in building end-to-end AI solutions from research to deployment."
            },
            'projects': {
                keywords: ['projects', 'work', 'built', 'developed', 'created', 'portfolio', 'applications'],
                response: "I've developed several innovative projects: 🦴 OsteoDiagnosis.AI (bone health diagnostics app with 90% accuracy using novel signal processing), 😊 Expression.AI (real-time facial emotion recognition with custom ResInceptionCNN), 🖐️ AI Hand Gesture Recognition (97.5% accuracy using Apple's FastViT), 📄 AI Document Processing System (combining DeepSeek R1-1.5B and Llama-7B), 🎮 Smart AI Checkers Bot (Minimax with alpha-beta pruning), and 👤 Gender Detection System (94.35% accuracy on CelebA dataset)."
            },
            'research': {
                keywords: ['research', 'publication', 'paper', 'published', 'academic', 'journal', 'book chapter'],
                response: "My research contributions include: 📚 Published book chapter in Elsevier's 'Non-stationary and nonlinear data processing for automated computer-aided medical diagnosis' on Deep Representation Learning for pneumonia and tuberculosis detection using chest X-rays (87.08% accuracy). 📝 Currently have a journal paper under review: 'Multi-Frequency Aware Deep Representation Learning for Automated Detection of Bone Fractures using Muscle X-ray Images' achieving 92.22% accuracy and 0.841 F1-score."
            },
            'contact': {
                keywords: ['contact', 'email', 'reach', 'connect', 'linkedin', 'github', 'social', 'communication'],
                response: "You can reach me through multiple channels: 📧 Email: f20220491@hyderabad.bits-pilani.ac.in, 💼 LinkedIn: linkedin.com/in/rishab-k-pattnaik-6a9939249/, 💻 GitHub: github.com/Rishab27279, 📝 Medium Blog: medium.com/@rishab27279, 📄 Resume: https://drive.google.com/file/d/1Xyy_8oioOhYW-OzaAevTrmitYBp56Y3b/view. Feel free to connect for collaborations or discussions!"
            },
            'resume': {
                keywords: ['resume', 'cv', 'download', 'curriculum vitae'],
                response: "You can download my comprehensive resume from: https://drive.google.com/file/d/1Xyy_8oioOhYW-OzaAevTrmitYBp56Y3b/view?usp=sharing. It contains detailed information about my experience, projects, publications, and technical skills."
            },
            'ai': {
                keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'ai', 'ml', 'dl', 'neural networks'],
                response: "I specialize in AI/ML with focus on medical imaging, computer vision, and deep learning. I work with cutting-edge architectures like CNNs, Vision Transformers, and Mamba models, building practical solutions using PyTorch and TensorFlow. My research contributes to published work with measurable diagnostic improvements, achieving 5-15% accuracy improvements across diverse medical datasets exceeding 10,000 scans."
            },
            'medical': {
                keywords: ['medical', 'healthcare', 'imaging', 'diagnosis', 'clinical', 'hospital', 'patient'],
                response: "My medical AI work focuses on: 🏥 Emergency triage systems using multi-modal approaches, 🦴 Bone fracture detection with 92.22% accuracy using novel signal processing, 🫁 Pneumonia and tuberculosis detection from chest X-rays, 🩺 Chronic Kidney Disease diagnosis combining multiple clinical datasets. I'm currently working at Hamad Medical Corporation on AI-driven emergency care solutions."
            },
            'internship': {
                keywords: ['internship', 'intern', 'training', 'hamad', 'igcar', 'kalpakkam', 'qatar'],
                response: "My internship experiences include: 🇶🇦 Current AI Research Intern at Hamad Medical Corporation, Qatar (May 2025 - Present) working on emergency research under Dr. Sarada Prasad Dakua, and 🇮🇳 Previous Research Intern at IGCAR Kalpakkam (May 2024 - Aug 2024) under Raja Sekhar M, focusing on camouflaged object detection using Meta's SAM model with 14% mIoU improvement."
            },
            'blog': {
                keywords: ['blog', 'medium', 'writing', 'article', 'medmamba', 'mamba'],
                response: "I've written a comprehensive technical blog on MedMamba - the first Vision Mamba architecture for medical image classification. The blog explains how MedMamba achieves linear computational complexity O(N) compared to ViTs' quadratic complexity O(N²), making it ideal for resource-constrained medical environments. It covers State Space Models, 2D-Selective-Scan mechanism, and why practitioners should adopt MedMamba over traditional ViTs. Read it on Medium: https://ai.gopubby.com/medmamba-explained..."
            },
            'github': {
                keywords: ['github', 'code', 'repository', 'open source', 'programming'],
                response: "My GitHub profile (github.com/Rishab27279) showcases various projects including OsteoDiagnosis.AI, Expression.AI, Hand Gesture Recognition, Camouflaged Object Detection, and more. You can find source code, documentation, and implementation details for most of my projects. I believe in open-source contribution and knowledge sharing."
            },
            'achievements': {
                keywords: ['achievements', 'awards', 'recognition', 'accomplishments', 'success'],
                response: "Key achievements include: 🏆 92.22% accuracy in bone fracture detection research, 🏆 97.5% accuracy in hand gesture recognition, 🏆 Published research in Elsevier book chapter, 🏆 14% improvement in camouflaged object detection using SAM, 🏆 Successfully deployed multiple AI applications, 🏆 5-15% accuracy improvements across 10,000+ medical scans."
            },
            'future': {
                keywords: ['future', 'goals', 'plans', 'career', 'aspirations', 'next'],
                response: "My future goals include: 🎯 Advancing medical AI research for better patient outcomes, 🎯 Exploring cutting-edge architectures like diffusion models and advanced transformers, 🎯 Publishing more research in top-tier journals, 🎯 Developing scalable AI solutions for healthcare, 🎯 Contributing to open-source AI projects, 🎯 Pursuing advanced studies in AI/ML."
            },
            'technologies': {
                keywords: ['pytorch', 'tensorflow', 'python', 'opencv', 'docker', 'fastapi', 'streamlit'],
                response: "I work with a comprehensive tech stack: 🔥 PyTorch for deep learning research, 🧠 TensorFlow for production models, 🐍 Python for AI development, 👁️ OpenCV for computer vision, 🐳 Docker for containerization, ⚡ FastAPI for API development, 📊 Streamlit for rapid prototyping, 📱 Android Studio for mobile AI apps."
            },

            // ======================================== NEW ENHANCED CAPABILITIES ========================================

            // Bot Identity & Creator Questions
            'bot_identity': {
                keywords: ['who made you', 'who created you', 'who built you', 'your creator', 'who developed you', 'your maker', 'who programmed you'],
                response: "I am Rishab's AI Avatar created by him! 🤖 And Rishab is created by God! ✨ I'm designed to be your friendly guide through Rishab's amazing AI journey, projects, and achievements. Think of me as his digital representative here to help you explore his work!"
            },
            'bot_api': {
                keywords: ['your api', 'what api', 'api used', 'how you work', 'your technology', 'your backend'],
                response: "I am Rishab's AI Avatar created by him using advanced JavaScript and natural language processing techniques! 🤖 And remember, Rishab is created by God! ✨ I'm built with custom knowledge bases, intelligent response matching, and conversational AI capabilities to provide you with comprehensive information about Rishab's work."
            },
            'bot_purpose': {
                keywords: ['why were you made', 'your purpose', 'why do you exist', 'what is your job', 'your role'],
                response: "I exist to share Rishab's incredible AI journey with the world! 🌟 My purpose is to help visitors learn about his research, projects, skills, and achievements in an interactive and engaging way. I'm here 24/7 to answer questions about his work, provide detailed insights, and connect people with his expertise. Think of me as his personal AI ambassador!"
            },

            // Technical Deep Dives
            'computer_vision': {
                keywords: ['computer vision', 'cv', 'image processing', 'vision models', 'opencv', 'image recognition'],
                response: "Rishab's computer vision expertise spans multiple domains! 👁️ He's worked on: Medical imaging for bone fracture detection (92.22% accuracy), Facial expression recognition using custom ResInceptionCNN, Hand gesture recognition with Apple's FastViT (97.5% accuracy), Camouflaged object detection using Meta's SAM model, and Gender detection systems. His approach combines traditional CV techniques with modern deep learning architectures."
            },
            'transformers': {
                keywords: ['transformer', 'attention', 'bert', 'gpt', 'vision transformer', 'vit'],
                response: "Rishab works extensively with transformer architectures! 🔄 His experience includes: Vision Transformers for medical imaging applications, Apple's FastViT for efficient gesture recognition, Meta's SAM (Segment Anything Model) for object detection, Attention mechanisms for medical diagnosis, and exploring cutting-edge architectures like Vision Mamba for linear computational complexity. He's particularly interested in making transformers more efficient for real-world deployment."
            },
            'medical_ai': {
                keywords: ['medical ai', 'healthcare ai', 'medical imaging', 'diagnosis', 'clinical ai'],
                response: "Rishab is a pioneer in medical AI! 🏥 His contributions include: Emergency triage systems for rapid patient prioritization, Bone fracture detection achieving 92.22% accuracy, Pneumonia and tuberculosis detection from chest X-rays (87.08% accuracy), Chronic Kidney Disease diagnosis using multiple clinical datasets, and Novel signal processing techniques for medical imaging. He's currently advancing emergency care AI at Hamad Medical Corporation, Qatar."
            },
            'mobile_ai': {
                keywords: ['mobile ai', 'android ai', 'mobile apps', 'tensorflow lite', 'edge ai'],
                response: "Rishab excels in mobile AI deployment! 📱 His mobile AI projects include: OsteoDiagnosis.AI - bone health diagnostics app (90% accuracy, <100MB), Expression.AI - real-time emotion recognition using TensorFlow Lite, Offline inference capabilities with optimized models, Custom CNN architectures for mobile deployment, and Edge AI solutions for resource-constrained environments. All his mobile apps work completely offline!"
            },

            // Research & Publications Deep Dive
            'signal_processing': {
                keywords: ['signal processing', 'wavelet', 'fourier', 'dsp', 'frequency analysis'],
                response: "Rishab's signal processing expertise is cutting-edge! 📊 He specializes in: Wavelet-DNN integration for medical imaging, Multi-frequency analysis for bone fracture detection, Novel signal processing techniques (details confidential due to ongoing research), Discrete Wavelet Transform applications, and Fourier analysis for enhanced feature extraction. His MFADRLN framework combines advanced signal processing with deep learning for superior medical diagnosis."
            },
            'publications_detail': {
                keywords: ['elsevier', 'book chapter', 'journal paper', 'publication details', 'research paper'],
                response: "Rishab's research publications showcase his expertise! 📚 Published work: Elsevier book chapter on 'Deep Representation Learning for Computer-Aided Detection of Pneumonia and Tuberculosis Using Chest X-Ray Images' (ISBN: 9780443314261), achieving 87.08% accuracy. Under review: 'Multi-Frequency Aware Deep Representation Learning for Automated Detection of Bone Fractures using Muscle X-ray Images' with 92.22% accuracy and 0.841 F1-score. His research contributes to advancing medical AI diagnosis."
            },

            // Project Deep Dives
            'osteodiagnosis_detail': {
                keywords: ['osteodiagnosis', 'bone health', 'osteoporosis', 'bone density', 'bone app'],
                response: "OsteoDiagnosis.AI is Rishab's flagship medical AI project! 🦴 Key features: Novel signal processing + deep learning architecture, 90% accuracy in bone density classification (Osteoporosis, Osteopenia, Normal), <100MB model size for mobile deployment, Completely offline Android application, Kappa Score of 0.82 for reliability, and Research-driven development under academic supervision. The app demonstrates successful integration of advanced AI with practical healthcare applications!"
            },
            'expression_ai_detail': {
                keywords: ['expression ai', 'emotion recognition', 'facial recognition', 'resinceptioncnn'],
                response: "Expression.AI showcases Rishab's computer vision expertise! 😊 Technical details: Custom ResInceptionCNN hybrid architecture, 7 emotion detection (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral), Real-time camera and gallery image processing, TensorFlow Lite optimization for mobile, Trained on FER2013 dataset, Completely offline inference, and Clean UI with emoji representations. It demonstrates the power of hybrid CNN architectures!"
            },
            'gesture_recognition_detail': {
                keywords: ['hand gesture', 'fastvit', 'hagrid', 'gesture recognition'],
                response: "The Hand Gesture Recognition system demonstrates Rishab's expertise with modern architectures! 🖐️ Technical specs: Apple's FastViT architecture (fastvit_t8.apple_in1k), 97.5% accuracy on validation set, 19 different gesture classes, HaGRID dataset (150k subset), Real-time inference >30 FPS, Transfer learning with frozen backbone, Google Colab deployment, and Efficiency advantages over ConvNeXT. Perfect example of efficient vision transformers!"
            },

            // Career & Mentorship
            'mentors': {
                keywords: ['mentor', 'supervisor', 'guide', 'professor', 'dr tripathy', 'dr dakua'],
                response: "Rishab works under exceptional mentors! 👨‍🏫 Current supervisors: Dr. Sarada Prasad Dakua (Principal Data Scientist, Hamad Medical Corporation) - guiding emergency AI research, Dr. Rajesh Kumar Tripathy (BITS Pilani) - supervising medical imaging research and publications. Previous guidance: Raja Sekhar M (SO/E, IGCAR) - computer vision research. These mentorships have shaped his research direction and technical expertise."
            },
            'collaboration': {
                keywords: ['collaboration', 'teamwork', 'team projects', 'working together'],
                response: "Rishab excels in collaborative research! 🤝 His collaborative experiences include: Multi-institutional research projects, Cross-functional teams with data scientists and clinicians, International collaboration with Hamad Medical Corporation, Qatar, Academic-industry partnerships, Open-source contributions, and Knowledge sharing through technical blogs. He believes in the power of collaborative innovation to solve complex AI challenges."
            },

            // Industry & Trends
            'ai_trends': {
                keywords: ['ai trends', 'latest ai', 'future ai', 'ai developments', 'emerging ai'],
                response: "Rishab stays at the forefront of AI trends! 🚀 He's exploring: Vision Mamba for efficient medical imaging (linear complexity O(N) vs ViT's O(N²)), Diffusion models for synthetic medical data generation, Multimodal AI for comprehensive diagnosis, Edge AI for real-time healthcare applications, Explainable AI for clinical decision support, and Foundation models adaptation for specialized domains. His blog on MedMamba showcases his trend awareness!"
            },
            'industry_impact': {
                keywords: ['industry impact', 'real world', 'practical applications', 'deployment'],
                response: "Rishab's work has real-world impact! 🌍 Practical applications: Mobile health apps deployed for bone health assessment, Emergency triage systems improving patient care, Medical imaging solutions with measurable diagnostic improvements, IoT-enabled healthcare diagnostics, and Research contributing to clinical decision support. His focus on deployment-ready solutions bridges the gap between research and practical healthcare applications."
            },

            // Fun & Personal
            'hobbies': {
                keywords: ['hobbies', 'interests', 'free time', 'personal interests', 'what do you like'],
                response: "While I know Rishab is deeply passionate about AI and research, his primary focus seems to be advancing medical AI for better patient outcomes! 🎯 His 'hobby' appears to be exploring cutting-edge AI architectures, writing technical blogs, contributing to open-source projects, and building practical AI solutions. He's the type of person who finds joy in solving complex problems and making AI accessible to everyone!"
            },
            'inspiration': {
                keywords: ['inspiration', 'motivation', 'why ai', 'what drives you'],
                response: "Rishab is inspired by AI's potential to transform healthcare! 💡 His motivation comes from: Making medical diagnosis more accurate and accessible, Bridging the gap between AI research and practical applications, Improving patient outcomes through intelligent systems, Democratizing healthcare through mobile AI solutions, and Contributing to the global AI research community. His work at Hamad Medical Corporation exemplifies his commitment to impactful AI research."
            },

            // Technical Troubleshooting
            'learning_resources': {
                keywords: ['learning', 'resources', 'how to learn', 'study materials', 'recommendations'],
                response: "Based on Rishab's journey, here are key learning resources! 📚 Technical foundations: Strong mathematical background (Linear Algebra, Statistics), Programming proficiency (Python, deep learning frameworks), Hands-on projects (start with simple CV tasks), Research papers (follow latest developments), Online platforms (Google Colab for experimentation), and Community engagement (GitHub, technical blogs). His coursework at BITS Pilani provides excellent foundation!"
            },
            'advice': {
                keywords: ['advice', 'tips', 'guidance', 'suggestions', 'help'],
                response: "Here's advice inspired by Rishab's journey! 💪 Key principles: Start with strong fundamentals in math and programming, Focus on practical projects with real-world impact, Contribute to research and publications, Build a portfolio of deployed applications, Stay updated with latest AI trends and architectures, Collaborate with mentors and peers, and Always aim for solutions that benefit society. His path from student to published researcher is truly inspiring!"
            }
        };
    }

    // Enhanced response generation with better context understanding
    findBestResponse(userInput) {
        // Normalize input
        const normalizedInput = userInput.toLowerCase().trim();
        
        // Check for greetings
        if (this.isGreeting(normalizedInput)) {
            return "Hello there! 👋 Great to meet you! I'm Rishi-Bot, your AI guide to everything about Rishab's work and achievements. I can tell you about his research, projects, experience, skills, and much more. What interests you most?";
        }

        // Check for gratitude
        if (this.isGratitude(normalizedInput)) {
            return "You're absolutely welcome! 😊 I'm here to help anytime. Feel free to ask about Rishab's latest projects, research publications, technical skills, or anything else you'd like to know!";
        }

        // Enhanced specific project detection
        if (normalizedInput.includes('osteodiagnosis') || normalizedInput.includes('bone')) {
            return this.knowledgeBase.osteodiagnosis_detail.response;
        }

        if (normalizedInput.includes('expression') || normalizedInput.includes('emotion')) {
            return this.knowledgeBase.expression_ai_detail.response;
        }

        if (normalizedInput.includes('gesture') || normalizedInput.includes('hand')) {
            return this.knowledgeBase.gesture_recognition_detail.response;
        }

        // Check for bot identity questions
        if (this.isBotIdentityQuestion(normalizedInput)) {
            return this.knowledgeBase.bot_identity.response;
        }

        if (this.isBotAPIQuestion(normalizedInput)) {
            return this.knowledgeBase.bot_api.response;
        }

        // Find best matching topic
        let bestMatch = null;
        let maxScore = 0;

        for (const [topic, data] of Object.entries(this.knowledgeBase)) {
            const score = this.calculateMatchScore(normalizedInput, data.keywords);
            if (score > maxScore) {
                maxScore = score;
                bestMatch = data;
            }
        }

        if (maxScore > 0) {
            return bestMatch.response;
        }

        // Enhanced fallback responses
        return this.getFallbackResponse(normalizedInput);
    }

    // New helper methods for bot identity detection
    isBotIdentityQuestion(input) {
        const identityKeywords = ['who made you', 'who created you', 'who built you', 'your creator', 'who developed you', 'your maker', 'who programmed you'];
        return identityKeywords.some(keyword => input.includes(keyword));
    }

    isBotAPIQuestion(input) {
        const apiKeywords = ['your api', 'what api', 'api used', 'how you work', 'your technology', 'your backend'];
        return apiKeywords.some(keyword => input.includes(keyword));
    }

    // Enhanced fallback responses with more variety
    getFallbackResponse(input) {
        const contextualFallbacks = [
            "That's an interesting question! 🤔 I'd love to help you learn more about Rishab. I can share details about his AI research at BITS Pilani, his medical imaging projects, his experience at Hamad Medical Corporation, or his published research work. What specific area interests you?",
            "I'm not sure about that specific detail, but I have comprehensive knowledge about Rishab's work! 🚀 I can tell you about his innovative projects like OsteoDiagnosis.AI, his research publications, his technical expertise in PyTorch and TensorFlow, or his internship experiences. What would you like to explore?",
            "Let me help you discover more about Rishab's AI journey! 🧠 I can provide insights into his education at BITS Pilani, his cutting-edge research in medical imaging, his successful project deployments, or his technical blog on MedMamba. Which topic catches your interest?",
            "Great question! 💡 I'm here to share everything about Rishab's expertise in deep learning, computer vision, medical AI, and generative AI. I can also tell you about his specific achievements, like 92.22% accuracy in bone fracture detection or 97.5% in gesture recognition. What would you like to know more about?",
            "I'm Rishab's AI Avatar and I'm here to help! 🤖 While I might not have that exact information, I can tell you about his amazing projects, research publications, technical skills, career journey, or future goals. What aspect of his work interests you most?",
            "Hmm, let me think about that! 🤯 I have extensive knowledge about Rishab's AI research, mobile app development, computer vision projects, medical imaging work, and academic achievements. Perhaps you'd like to know about his work at Hamad Medical Corporation or his published research?"
        ];
        
        return contextualFallbacks[Math.floor(Math.random() * contextualFallbacks.length)];
    }

    // Rest of the methods remain the same...
    initializeEventListeners() {
        // Toggle chatbot
        document.getElementById('chatbotToggle').addEventListener('click', () => {
            this.toggleChatBot();
        });

        // Close chatbot
        document.getElementById('chatbotClose').addEventListener('click', () => {
            this.closeChatBot();
        });

        // Send message
        document.getElementById('chatbotSend').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick actions
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
            content: "Hi! I'm Rishi-Bot 🤖. I'm here to help you learn everything about Rishab's AI journey, research, projects, and experience. What would you like to explore?",
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
        // Remove quick actions after use
        const quickActions = document.querySelector('.chatbot-quick-actions');
        if (quickActions) {
            quickActions.remove();
        }

        // Send user message
        const userMessage = {
            type: 'user',
            content: action,
            timestamp: new Date()
        };
        this.addMessage(userMessage);

        // Generate response
        setTimeout(() => {
            this.generateResponse(action.toLowerCase());
        }, 500);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const content = input.value.trim();
        
        if (!content || this.isTyping) return;

        // Add user message
        const userMessage = {
            type: 'user',
            content: content,
            timestamp: new Date()
        };
        this.addMessage(userMessage);

        // Clear input
        input.value = '';

        // Generate response
        setTimeout(() => {
            this.generateResponse(content.toLowerCase());
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

    generateResponse(userInput) {
        const typingIndicator = this.showTypingIndicator();
        
        // Simulate thinking time
        setTimeout(() => {
            const response = this.findBestResponse(userInput);
            this.hideTypingIndicator(typingIndicator);
            
            const botMessage = {
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            this.addMessage(botMessage);
        }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
    }

    calculateMatchScore(input, keywords) {
        let score = 0;
        keywords.forEach(keyword => {
            if (input.includes(keyword)) {
                score += keyword.length * 2; // Longer matches get higher scores
            }
            // Also check for partial matches
            const words = input.split(' ');
            words.forEach(word => {
                if (keyword.includes(word) && word.length > 2) {
                    score += word.length;
                }
            });
        });
        return score;
    }

    isGreeting(input) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'];
        return greetings.some(greeting => input.includes(greeting));
    }

    isGratitude(input) {
        const gratitude = ['thank', 'thanks', 'appreciate', 'grateful', 'awesome', 'great', 'perfect'];
        return gratitude.some(word => input.includes(word));
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

// Additional utility functions
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

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    const scrollTop = window.pageYOffset;
    
    // Add any scroll-based animations or effects here
    if (scrollTop > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Print styles handling
window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// Initialize ChatBot
function initializeChatBot() {
    // Initialize the chatbot when DOM is ready
    window.portfolioChatBot = new PortfolioChatBot();
}

// Service Worker Registration for PWA capabilities (optional)
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

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
        }, 0);
    });
}

// Single event handler for both escape key and click outside
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const popup = document.querySelector('.popup.active');
        if (popup) {
            popup.classList.remove('active');
        }
    }
});

// Click outside to close popup
document.addEventListener('click', function(event) {
    const popup = document.querySelector('.popup.active');
    if (popup && event.target === popup) {
        // Only close if clicking on the popup overlay (not the content)
        popup.classList.remove('active');
    }
});
