// ========== 1. ADVANCED INTERACTIVE PRELOADER ==========
        const preloader = document.getElementById('preloader');
        const loaderPercent = document.getElementById('loaderPercent');
        const loaderSystemMsg = document.getElementById('loaderSystemMsg');
        const cyberProgressFill = document.getElementById('cyberProgressFill');
        const loaderContent = document.getElementById('loaderContent');
        const loaderSkipBtn = document.getElementById('loaderSkipBtn');
        const loaderCanvas = document.getElementById('loaderCanvas');

        let currentProgress = 0;
        let isLoaded = false;
        let fastForward = false;

        const systemBootLogs = [
            { threshold: 0, text: '> INITIALIZING NEURAL WORKSPACE...' },
            { threshold: 20, text: '> COMPILING FULL-STACK MODULES...' },
            { threshold: 45, text: '> LOADING 3D AVATAR & ASSETS...' },
            { threshold: 70, text: '> MOUNTING INTERACTIVE PARTICLES...' },
            { threshold: 90, text: '> ALL SYSTEMS OPTIMAL. LAUNCHING...' },
            { threshold: 100, text: '> WELCOME, DEVELOPER!' }
        ];

        // Canvas Cyber Stream in background
        if (loaderCanvas) {
            const lCtx = loaderCanvas.getContext('2d');
            let lParticles = [];

            function resizeLoaderCanvas() {
                loaderCanvas.width = window.innerWidth;
                loaderCanvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeLoaderCanvas);
            resizeLoaderCanvas();

            for (let i = 0; i < 45; i++) {
                lParticles.push({
                    x: Math.random() * loaderCanvas.width,
                    y: Math.random() * loaderCanvas.height,
                    speed: Math.random() * 2 + 1,
                    length: Math.random() * 30 + 10,
                    opacity: Math.random() * 0.45 + 0.1
                });
            }

            function drawLoaderStream() {
                if (isLoaded) return;
                lCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
                lCtx.lineWidth = 1;
                for (let p of lParticles) {
                    lCtx.beginPath();
                    lCtx.moveTo(p.x, p.y);
                    lCtx.lineTo(p.x, p.y + p.length);
                    lCtx.strokeStyle = `rgba(59, 130, 246, ${p.opacity})`;
                    lCtx.stroke();
                    p.y += p.speed;
                    if (p.y > loaderCanvas.height) {
                        p.y = -p.length;
                        p.x = Math.random() * loaderCanvas.width;
                    }
                }
                requestAnimationFrame(drawLoaderStream);
            }
            drawLoaderStream();
        }

        // Parallax 3D tilt on Preloader mouse movement
        preloader.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 22;
            const y = (e.clientY / window.innerHeight - 0.5) * -22;
            loaderContent.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
        });

        function updateLoaderProgress(val) {
            currentProgress = Math.min(Math.round(val), 100);
            loaderPercent.textContent = (currentProgress < 10 ? '0' : '') + currentProgress + '%';
            cyberProgressFill.style.width = currentProgress + '%';

            // Find matching log message
            for (let i = systemBootLogs.length - 1; i >= 0; i--) {
                if (currentProgress >= systemBootLogs[i].threshold) {
                    loaderSystemMsg.textContent = systemBootLogs[i].text;
                    break;
                }
            }

            if (currentProgress >= 100 && !isLoaded) {
                isLoaded = true;
                setTimeout(finishLoading, 220);
            }
        }

        function finishLoading() {
            preloader.classList.add('hidden');
            initNumbersCounter();
            showToast('🚀 Welcome to Akash Bhuniya\'s Workspace!');
        }

        // Speed-up trigger on click or keypress
        function triggerFastForward() {
            fastForward = true;
        }

        preloader.addEventListener('click', triggerFastForward);
        if (loaderSkipBtn) {
            loaderSkipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerFastForward();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!isLoaded && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                triggerFastForward();
            }
        });

        // Smooth Counter Loop
        let progressVal = 0;
        const progressTimer = setInterval(() => {
            if (isLoaded) {
                clearInterval(progressTimer);
                return;
            }
            if (fastForward) {
                progressVal += 10;
            } else {
                if (progressVal < 30) progressVal += 2.4;
                else if (progressVal < 65) progressVal += 1.6;
                else if (progressVal < 90) progressVal += 1.1;
                else progressVal += 0.8;
            }

            updateLoaderProgress(progressVal);

            if (progressVal >= 100) {
                clearInterval(progressTimer);
            }
        }, 32);

        // Current Year
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // ========== 2. SCROLL PROGRESS & ACTIVE NAV ==========
        const scrollBar = document.getElementById('scrollProgressBar');
        const navbar = document.getElementById('navbar');
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const navSections = document.querySelectorAll('section[id]');
        const navAnchors = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = scrolled + '%';

            // Navbar styling
            if (window.scrollY > 40) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');

            // Scroll to top visibility
            if (window.scrollY > 400) scrollTopBtn.classList.add('show');
            else scrollTopBtn.classList.remove('show');

            // Active section highlighting
            let current = '';
            navSections.forEach(sec => {
                const secTop = sec.offsetTop - 140;
                if (window.scrollY >= secTop) {
                    current = sec.getAttribute('id');
                }
            });

            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + current) {
                    a.classList.add('active');
                }
            });
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ========== 3. CUSTOM CURSOR ==========
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');

        if (window.innerWidth >= 1024) {
            document.addEventListener('mousemove', (e) => {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                cursorRing.style.left = e.clientX + 'px';
                cursorRing.style.top = e.clientY + 'px';
            });

            document.querySelectorAll('a, button, .service-card, .project-card, .skill-box').forEach(el => {
                el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
                el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
            });
        }

        // ========== 4. THEME TOGGLING ==========
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const storedTheme = localStorage.getItem('theme');

        const sunSvg = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        const moonSvg = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

        if (storedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.innerHTML = sunSvg;
        }

        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.innerHTML = moonSvg;
                showToast('Switched to Dark Mode 🌙');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.innerHTML = sunSvg;
                showToast('Switched to Light Mode ☀️');
            }
        });

        // ========== 5. MOBILE MENU ==========
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navAnchors.forEach(a => {
            a.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // ========== 6. ROTATING TITLE TYPING EFFECT ==========
        const roles = [
            'Full Stack Developer',
            'UI/UX Designer',
            'BCA Student',
            'Problem Solver',
            'AI Tools Explorer'
        ];
        const typingEl = document.getElementById('typingRole');
        let rIndex = 0, cIndex = 0, isDeleting = false;

        function typeLoop() {
            const currentRole = roles[rIndex];
            if (isDeleting) {
                typingEl.textContent = currentRole.substring(0, cIndex - 1);
                cIndex--;
            } else {
                typingEl.textContent = currentRole.substring(0, cIndex + 1);
                cIndex++;
            }

            let speed = isDeleting ? 45 : 95;
            if (!isDeleting && cIndex === currentRole.length) {
                speed = 2200;
                isDeleting = true;
            } else if (isDeleting && cIndex === 0) {
                isDeleting = false;
                rIndex = (rIndex + 1) % roles.length;
                speed = 400;
            }
            setTimeout(typeLoop, speed);
        }
        typeLoop();

        // ========== 7. INTERACTIVE STARFIELD CONSTELLATION CANVAS ==========
        const canvas = document.getElementById('starfield');
        const ctx = canvas.getContext('2d');
        let stars = [];
        let mouse = { x: null, y: null, maxDist: 120 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 100);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: Math.random() * 1.6 + 0.6
                });
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function animateStarfield() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const starColor = isLight ? 'rgba(37, 99, 235, 0.4)' : 'rgba(59, 130, 246, 0.6)';
            const lineColor = isLight ? 'rgba(37, 99, 235, ' : 'rgba(59, 130, 246, ';

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.x += s.vx;
                s.y += s.vy;

                if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
                if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = starColor;
                ctx.fill();

                // Mouse connection
                if (mouse.x !== null) {
                    const dx = s.x - mouse.x;
                    const dy = s.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = lineColor + (1 - dist / mouse.maxDist) * 0.25 + ')';
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Star-to-star connection
                for (let j = i + 1; j < stars.length; j++) {
                    const s2 = stars[j];
                    const dx = s.x - s2.x;
                    const dy = s.y - s2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 85) {
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(s2.x, s2.y);
                        ctx.strokeStyle = lineColor + (1 - dist / 85) * 0.12 + ')';
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateStarfield);
        }
        animateStarfield();

        // ========== 8. 3D CARD TILT EFFECT ==========
        if (window.innerWidth >= 1024) {
            document.querySelectorAll('.tilt-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                });
            });
        }

        // ========== 9. CODE PLAYGROUND TAB SWITCHER ==========
        const tabBtns = document.querySelectorAll('.tab-btn');
        const codeDisplay = document.getElementById('codeDisplay');

        const codeSnippets = {
            taskflow: `<div><span class="c-kw">interface</span> <span class="c-fn">ProjectEngine</span> {</div>
<div>&nbsp;&nbsp;<span class="c-prop">title</span>: <span class="c-str">"TaskFlow Workspace"</span>;</div>
<div>&nbsp;&nbsp;<span class="c-prop">lead</span>: <span class="c-str">"Akash Bhuniya"</span>;</div>
<div>&nbsp;&nbsp;<span class="c-prop">techStack</span>: [<span class="c-str">"Node"</span>, <span class="c-str">"MySQL"</span>, <span class="c-str">"WebSockets"</span>];</div>
<div>&nbsp;&nbsp;<span class="c-prop">completion</span>: <span class="c-num">0.70</span>;</div>
<div>&nbsp;&nbsp;<span class="c-fn">deploy</span>(): <span class="c-kw">Promise</span>&lt;<span class="c-str">"Production Live"</span>&gt;;</div>
<div>}</div>
<div><span class="c-com">// System initialized &amp; syncing state</span></div>`,
            schema: `<div><span class="c-kw">CREATE TABLE</span> <span class="c-fn">tasks</span> (</div>
<div>&nbsp;&nbsp;<span class="c-prop">id</span> <span class="c-kw">INT PRIMARY KEY AUTO_INCREMENT</span>,</div>
<div>&nbsp;&nbsp;<span class="c-prop">project_id</span> <span class="c-kw">INT NOT NULL</span>,</div>
<div>&nbsp;&nbsp;<span class="c-prop">title</span> <span class="c-kw">VARCHAR</span>(<span class="c-num">255</span>),</div>
<div>&nbsp;&nbsp;<span class="c-prop">status</span> <span class="c-kw">ENUM</span>(<span class="c-str">'todo'</span>, <span class="c-str">'in_progress'</span>, <span class="c-str">'done'</span>),</div>
<div>&nbsp;&nbsp;<span class="c-prop">created_at</span> <span class="c-kw">TIMESTAMP DEFAULT CURRENT_TIMESTAMP</span></div>
<div>);</div>`,
            ai: `<div><span class="c-kw">def</span> <span class="c-fn">generate_sprint_summary</span>(tasks):</div>
<div>&nbsp;&nbsp;<span class="c-prop">prompt</span> = <span class="c-str">f"Summarize completed tasks: {tasks}"</span></div>
<div>&nbsp;&nbsp;<span class="c-prop">response</span> = <span class="c-fn">ai_client</span>.<span class="c-fn">complete</span>(<span class="c-prop">prompt</span>)</div>
<div>&nbsp;&nbsp;<span class="c-kw">return</span> <span class="c-prop">response</span>.<span class="c-fn">strip</span>()</div>
<div><span class="c-com"># Streamlining developer feedback loop</span></div>`
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const key = btn.getAttribute('data-tab');
                codeDisplay.innerHTML = codeSnippets[key] || '';
            });
        });

        // ========== 10. SKILLS FILTERING ==========
        const skillFilterBtns = document.querySelectorAll('.filter-btn');
        const skillBoxes = document.querySelectorAll('.skill-box');

        skillFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                skillFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.getAttribute('data-skill-cat');

                skillBoxes.forEach(box => {
                    if (cat === 'all' || box.getAttribute('data-cat') === cat) {
                        box.style.display = 'block';
                    } else {
                        box.style.display = 'none';
                    }
                });
            });
        });

        // ========== 11. PROJECTS FILTERING ==========
        const projTabs = document.querySelectorAll('.proj-tab');
        const projectCards = document.querySelectorAll('.project-card');

        projTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                projTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // ========== 12. NUMBER COUNTER ANIMATION ==========
        function initNumbersCounter() {
            const statNumbers = document.querySelectorAll('.stat-box strong[data-target]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let current = 0;
                const increment = Math.ceil(target / 25);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
                        clearInterval(timer);
                    } else {
                        stat.textContent = current + (stat.textContent.includes('%') ? '%' : '+');
                    }
                }, 40);
            });
        }

        // ========== 13. PROJECT CASE STUDY MODAL ==========
        const projectModal = document.getElementById('projectModal');
        const projModalTitle = document.getElementById('projModalTitle');
        const projModalContent = document.getElementById('projModalContent');

        const projectDetails = {
            taskflow: {
                title: 'TaskFlow: Full Stack Collaboration Suite',
                tech: 'JavaScript, Node.js, Express, MySQL, WebSockets',
                desc: 'A full-stack collaborative application engineered to simplify agile workflow management for small-to-medium teams. Inspired by tools like Linear and Trello.',
                features: [
                    'Dynamic kanban board with real-time drag-and-drop state syncing.',
                    'MySQL database schema normalized with relational integrity constraints for users, projects, columns, and tasks.',
                    'RESTful API endpoints handling granular task re-ordering, comments, and priority tags.',
                    'Responsive glassmorphic UI with dark/light mode compatibility and zero external heavy UI dependencies.'
                ]
            },
            ecommerce: {
                title: 'NovaCommerce Web Application',
                tech: 'Java, MySQL, HTML5, CSS3, JavaScript',
                desc: 'A robust and secure online shopping application built from scratch to explore object-oriented backend patterns and relational database optimization.',
                features: [
                    'User authentication flow with password hashing and session management.',
                    'Interactive product catalog with category search, price filtering, and pagination.',
                    'Cart management system reflecting real-time stock deductions against the MySQL database.',
                    'Admin interface allowing product creation, price updates, and order shipment tracking.'
                ]
            },
            portfolio: {
                title: 'Akash Bhuniya Portfolio v2',
                tech: 'HTML5, Modern CSS Tokens, Vanilla JS, HTML5 Canvas',
                desc: 'The website you are currently viewing! Built to showcase modern frontend capabilities, optimal Lighthouse performance, and premium aesthetics without bulky framework overhead.',
                features: [
                    'High performance interactive starfield constellation canvas rendering at smooth 60fps.',
                    '3D card perspective tilt responding dynamically to cursor position.',
                    'One-click printable resume modal formatted cleanly with dedicated print media styles.',
                    'Full accessibility compliance, responsive mobile drawer, and dynamic theme switching.'
                ]
            },
            mobileui: {
                title: 'Pulse Mobile App UI/UX Architecture',
                tech: 'Figma, Wireframing, User Research, Design Systems',
                desc: 'A mobile user experience prototype designed to maximize thumb-zone accessibility, reduce checkout drop-off, and present complex product metrics in clean visual summaries.',
                features: [
                    'Custom design system comprising 30+ reusable atomic components and tokens.',
                    'Ergonomic mobile navigation layout keeping primary CTAs in the lower third for easy single-handed reach.',
                    'Interactive high-fidelity prototypes demonstrating micro-animations during payment checkout.',
                    'Comprehensive user journey map verified against 10 target user interviews.'
                ]
            }
        };

        function openProjectModal(key) {
            const data = projectDetails[key];
            if (!data) return;

            projModalTitle.textContent = data.title;
            projModalContent.innerHTML = `
                <div style="margin-bottom: 18px;">
                    <span class="skill-chip" style="color: var(--primary);">${data.tech}</span>
                </div>
                <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">
                    ${data.desc}
                </p>
                <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--text-main); margin-bottom: 14px;">Key Highlights &amp; Architecture</h4>
                <ul style="padding-left: 20px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 30px;">
                    ${data.features.map(f => `<li style="margin-bottom: 8px;">${f}</li>`).join('')}
                </ul>
                <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                    <a href="#contact" onclick="closeProjectModal()" class="btn btn-primary">
                        Discuss This Project
                    </a>
                    <button class="btn btn-glass" onclick="closeProjectModal()">
                        Close
                    </button>
                </div>
            `;
            projectModal.classList.add('open');
        }

        function closeProjectModal() {
            projectModal.classList.remove('open');
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });

        // ========== 14. RESUME MODAL & DOWNLOADS ==========
        const resumeModal = document.getElementById('resumeModal');
        const btnOpenResume = document.getElementById('btnOpenResume');
        const heroResumeTrigger = document.getElementById('heroResumeTrigger');

        function openResumeModal() {
            resumeModal.classList.add('open');
        }

        function closeResumeModal() {
            resumeModal.classList.remove('open');
        }

        btnOpenResume.addEventListener('click', openResumeModal);
        heroResumeTrigger.addEventListener('click', openResumeModal);

        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });

        const resumePlainContent = `AKASH BHUNIYA
Full Stack Developer & UI/UX Designer | BCA Scholar
Email: akash.bhuniya.dev@gmail.com | Location: India
Website: https://akashbhuniya.dev

SUMMARY:
Motivated BCA student and Full Stack Developer with strong foundations in software engineering, frontend UI/UX design, and relational database management. Experienced in building end-to-end web applications with clean code, modern JavaScript, Java, Python, and MySQL.

TECHNICAL SKILLS:
- Languages: JavaScript (ES6+), Java, Python, C++, HTML5, CSS3, SQL
- Frameworks & Web: RESTful APIs, Node.js basics, DOM APIs, Responsive Design
- Databases: MySQL, Relational Database Modeling, Schema Normalization
- Tools & Workflows: Git, GitHub, VS Code, Chrome DevTools, CLI
- Design & AI: UI/UX, Figma, Wireframing, Claude, ChatGPT, Cursor

PROJECTS:
1. TaskFlow - Full Stack Project Management Tool
   - Collaborative kanban dashboard with task assignment and MySQL persistence.
2. NovaCommerce - E-Commerce Web Application
   - Java & MySQL backend with session authentication and cart checkout.
3. Interactive Portfolio v2
   - High-performance glassmorphic web application with interactive canvas background.

EDUCATION:
- Bachelor of Computer Applications (BCA) - Pursuing`;

        function downloadResumeText() {
            const blob = new Blob([resumePlainContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Akash_Bhuniya_Resume.txt';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Downloaded Akash_Bhuniya_Resume.txt 📄');
        }

        // ========== 15. CONTACT FORM & TOASTS ==========
        const contactForm = document.getElementById('contactForm');
        const toastContainer = document.getElementById('toastContainer');

        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; color: #10b981;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>${message}</span>
            `;
            toastContainer.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all fields before sending.');
                return;
            }

            // Success feedback
            showToast(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`);
            contactForm.reset();
            triggerConfetti();
        });

        // ========== 16. EASTER EGG & CONFETTI ==========
        const confettiCanvas = document.getElementById('confettiCanvas');
        const cCtx = confettiCanvas.getContext('2d');
        let confettiParticles = [];

        function resizeConfetti() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeConfetti);
        resizeConfetti();

        function triggerConfetti() {
            confettiParticles = [];
            const colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
            for (let i = 0; i < 120; i++) {
                confettiParticles.push({
                    x: confettiCanvas.width / 2,
                    y: confettiCanvas.height / 2,
                    vx: (Math.random() - 0.5) * 14,
                    vy: (Math.random() - 0.7) * 14,
                    size: Math.random() * 8 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rot: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 10,
                    life: 1
                });
            }
            animateConfetti();
        }

        function animateConfetti() {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            let active = false;

            for (let p of confettiParticles) {
                if (p.life > 0) {
                    active = true;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.28; // gravity
                    p.rot += p.rotSpeed;
                    p.life -= 0.012;

                    cCtx.save();
                    cCtx.translate(p.x, p.y);
                    cCtx.rotate((p.rot * Math.PI) / 180);
                    cCtx.fillStyle = p.color;
                    cCtx.globalAlpha = Math.max(p.life, 0);
                    cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    cCtx.restore();
                }
            }

            if (active) requestAnimationFrame(animateConfetti);
            else cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }

        // Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
        const konamiSequence = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
        let kPos = 0;

        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === konamiSequence[kPos]) {
                kPos++;
                if (kPos === konamiSequence.length) {
                    kPos = 0;
                    triggerConfetti();
                    showToast('🎉 Konami Code Unlocked! Welcome, fellow developer!');
                }
            } else {
                kPos = 0;
            }
        });

        // 5-Clicks on Logo
        let logoClicks = 0;
        document.getElementById('logoClicker').addEventListener('click', () => {
            logoClicks++;
            if (logoClicks >= 5) {
                logoClicks = 0;
                triggerConfetti();
                showToast('🚀 Easter Egg Found! Thanks for exploring my portfolio!');
            }
        });

        // ========== AVATAR TOGGLE (3D vs Real Photo) ==========
        const heroProfileImg = document.getElementById('heroProfileImg');
        const avatarToggleBtn = document.getElementById('avatarToggleBtn');
        const avatarToggleLabel = document.getElementById('avatarToggleLabel');
        let is3DAvatar = true;

        if (avatarToggleBtn && heroProfileImg) {
            avatarToggleBtn.addEventListener('click', () => {
                is3DAvatar = !is3DAvatar;
                heroProfileImg.style.opacity = '0';
                heroProfileImg.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (is3DAvatar) {
                        heroProfileImg.src = 'avatar-3d.png';
                        heroProfileImg.alt = 'Akash Bhuniya - 3D Developer Avatar';
                        avatarToggleLabel.textContent = '📷 Switch to Real Photo';
                        showToast('Switched to 3D Avatar 🎭');
                    } else {
                        heroProfileImg.src = 'profile.png';
                        heroProfileImg.alt = 'Akash Bhuniya - Real Photo';
                        avatarToggleLabel.textContent = '🎭 Switch to 3D Avatar';
                        showToast('Switched to Real Photo 📷');
                    }
                    heroProfileImg.style.opacity = '1';
                    heroProfileImg.style.transform = 'scale(1)';
                }, 200);
            });
        }

        // ========== 17. ANIMATION ENGINE (Scroll Reveal, Magnetic, Spotlight, Ripples) ==========
        // Scroll Reveal Observer
        const revealElements = document.querySelectorAll(
            '.section-header, .service-card, .about-photo-card, .about-content, .workspace-card, .skill-box, .project-card, .timeline-card, .testimonial-card, .blog-card, .contact-info-panel, .contact-form-panel'
        );

        revealElements.forEach((el) => {
            el.classList.add('reveal-on-scroll');
            const parent = el.parentElement;
            if (parent) {
                const idx = Array.from(parent.children).indexOf(el);
                if (idx > 0 && idx < 6) {
                    el.style.transitionDelay = `${(idx % 4) * 0.12}s`;
                }
            }
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Spotlight Mouse Position Tracking on Cards
        document.querySelectorAll('.service-card, .project-card, .skill-box, .testimonial-card, .blog-card, .workspace-card, .contact-info-panel, .contact-form-panel').forEach(card => {
            card.classList.add('spotlight-card');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });

        // Magnetic Interactive Buttons
        if (window.innerWidth >= 1024) {
            document.querySelectorAll('.btn, .btn-resume-nav, .btn-nav-action, .avatar-toggle-btn, .social-btn').forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        }

        // Click Micro-Ripple Effect
        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'click-ripple';
            ripple.style.left = `${e.clientX}px`;
            ripple.style.top = `${e.clientY}px`;
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        // Floating Code Glyphs Background
        const glyphs = ['{ }', '</>', '01', 'λ', '⚡', 'git', 'ts', 'java', 'sql', 'npm'];
        function createFloatingGlyphs() {
            for (let i = 0; i < 10; i++) {
                const glyph = document.createElement('div');
                glyph.className = 'floating-glyph';
                glyph.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
                glyph.style.left = `${Math.random() * 95}vw`;
                glyph.style.animationDuration = `${14 + Math.random() * 12}s`;
                glyph.style.animationDelay = `${Math.random() * 10}s`;
                document.body.appendChild(glyph);
            }
        }
        createFloatingGlyphs();

        // Timeline Dynamic Fill on Scroll
        const timelineWrap = document.querySelector('.timeline-wrapper');
        const timelineProgressLine = document.getElementById('timelineProgressLine');

        if (timelineWrap && timelineProgressLine) {
            window.addEventListener('scroll', () => {
                const rect = timelineWrap.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const totalHeight = rect.height;
                    const scrolledInto = windowHeight - rect.top;
                    const pct = Math.max(0, Math.min(100, (scrolledInto / totalHeight) * 100));
                    timelineProgressLine.style.height = pct + '%';
                }
            });
        }

        // ========== CONSOLE BRANDING ==========
        console.log('%c🚀 Welcome to Akash Bhuniya\'s Portfolio!', 'color: #3b82f6; font-size: 20px; font-weight: 800; font-family: sans-serif;');
        console.log('%cCrafted with passion, vanilla tech stack, and attention to detail.', 'color: #94a3b8; font-size: 13px;');
        console.log('%cLet\'s build something together: akash.bhuniya.dev@gmail.com', 'color: #06b6d4; font-size: 13px; font-weight: bold;');

        // ========== 18. AI CHATBOT ASSISTANT LOGIC ==========
        const chatbotTrigger = document.getElementById('chatbotTrigger');
        const chatbotWindow = document.getElementById('chatbotWindow');
        const chatbotCloseBtn = document.getElementById('chatbotCloseBtn');
        const chatbotBody = document.getElementById('chatbotBody');
        const chatbotForm = document.getElementById('chatbotForm');
        const chatInput = document.getElementById('chatInput');

        if (chatbotTrigger && chatbotWindow) {
            chatbotTrigger.addEventListener('click', () => {
                chatbotWindow.classList.toggle('open');
                if (chatbotWindow.classList.contains('open')) {
                    chatInput.focus();
                }
            });

            if (chatbotCloseBtn) {
                chatbotCloseBtn.addEventListener('click', () => {
                    chatbotWindow.classList.remove('open');
                });
            }
        }

        function appendChatMessage(sender, htmlContent) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${sender}`;
            msgDiv.innerHTML = `<div class="chat-bubble">${htmlContent}</div>`;
            chatbotBody.appendChild(msgDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot';
            typingDiv.id = 'activeTypingIndicator';
            typingDiv.innerHTML = `
                <div class="chat-bubble">
                    <div class="typing-indicator-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            chatbotBody.appendChild(typingDiv);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }

        function removeTypingIndicator() {
            const ind = document.getElementById('activeTypingIndicator');
            if (ind) ind.remove();
        }

        const chatbotKnowledgeBase = [
            {
                keywords: ['hi', 'hello', 'hey', 'greetings', 'who are you', 'bot'],
                reply: `Hello! 👋 I'm <strong>Akash's AI Assistant</strong>. I can answer questions about Akash's skills, projects, education, and how to hire or contact him! What would you like to know?`
            },
            {
                keywords: ['who is akash', 'about', 'background', 'bio', 'who'],
                reply: `<strong>Akash Bhuniya</strong> is a passionate BCA student, Full Stack Developer, and UI/UX designer based in India. He specializes in building modern web apps using HTML/CSS, JavaScript, Java, Python, and MySQL.`
            },
            {
                keywords: ['project', 'work', 'taskflow', 'novacommerce', 'portfolio', 'built'],
                reply: `Akash has built several impressive projects including:<br>
                • <strong>TaskFlow</strong>: Full-stack Kanban management app<br>
                • <strong>NovaCommerce</strong>: Java + MySQL E-Commerce platform<br>
                • <strong>Interactive Portfolio v2</strong>: Glassmorphic web app with 3D avatars<br><br>
                <button class="chat-action-btn" onclick="openProjectModal('taskflow')">View TaskFlow Case Study</button>`
            },
            {
                keywords: ['skill', 'stack', 'technology', 'language', 'code', 'know', 'java', 'python', 'js', 'react'],
                reply: `Akash's core toolkit includes:<br>
                • <strong>Frontend:</strong> HTML5, CSS3, Modern JavaScript (ES6+), Responsive Design<br>
                • <strong>Backend:</strong> Java (OOP), Python, C++<br>
                • <strong>Databases:</strong> MySQL, Relational SQL Modeling<br>
                • <strong>Tools &amp; AI:</strong> Git, GitHub, VS Code, Figma, Claude, Cursor, ChatGPT.`
            },
            {
                keywords: ['contact', 'email', 'hire', 'reach', 'social', 'linkedin', 'github', 'job', 'internship'],
                reply: `You can reach Akash directly at:<br>
                📧 <strong>akash.bhuniya.dev@gmail.com</strong><br>
                📍 Location: India (Open to Remote Roles)<br><br>
                <a href="#contact" class="chat-action-btn" onclick="document.getElementById('chatbotWindow').classList.remove('open')">Go to Contact Form</a>`
            },
            {
                keywords: ['resume', 'cv', 'download', 'pdf', 'education', 'bca'],
                reply: `Akash is currently pursuing his <strong>Bachelor of Computer Applications (BCA)</strong>. You can view or print his full professional resume right here:<br><br>
                <button class="chat-action-btn" onclick="openResumeModal()">📄 Open Interactive Resume</button>`
            }
        ];

        function getChatbotReply(userQuery) {
            const q = userQuery.toLowerCase();
            for (let kb of chatbotKnowledgeBase) {
                if (kb.keywords.some(k => q.includes(k))) {
                    return kb.reply;
                }
            }
            return `I'm happy to help! Akash is a Full Stack Developer skilled in JavaScript, Java, Python, and MySQL. You can ask me about his <strong>projects</strong>, <strong>skills</strong>, <strong>resume</strong>, or <strong>contact info</strong>!`;
        }

        function handleUserChatSubmit(queryText) {
            if (!queryText.trim()) return;
            appendChatMessage('user', queryText);

            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                const reply = getChatbotReply(queryText);
                appendChatMessage('bot', reply);
            }, 550);
        }

        function sendSuggestedQuery(text) {
            handleUserChatSubmit(text);
        }

        if (chatbotForm && chatInput) {
            chatbotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = chatInput.value;
                chatInput.value = '';
                handleUserChatSubmit(val);
            });
        }

