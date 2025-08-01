// AI Assistant - Rule-Based Chat System
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.messageHistory = [];
        this.isTyping = false;
        
        // Portfolio data for responses
        this.portfolioData = {
            name: "Omari Nyarko",
            role: "Software Engineer",
            company: "BigOrders",
            education: "Calvin University - Computer Science & Computer Engineering",
            skills: {
                languages: ["Python", "Java", "Kotlin", "C++", "JavaScript", "TypeScript"],
                technologies: ["Github", "Jira", "Apache Cassandra", "AWS", "Linux", "Kafka", ".NET", "Django", "TensorFlow", "React", "Terraform", "TestNG", "XCode", "Regex", "Docker", "MySQL"],
                softSkills: ["Product Management", "Entrepreneurial skills", "Communication", "Leadership"]
            },
            projects: {
                "Socialize": {
                    description: "Social networking platform using Flask and Bootstrap 5",
                    role: "Web App Developer",
                    tech: ["Flask", "Python", "Bootstrap"],
                    github: "https://github.com/omarionnn/socialize",
                    achievements: ["30% improvement in page load times", "25% increase in user engagement", "40% boost in mobile user satisfaction", "50% rise in user activity"]
                },
                "BigOrders": {
                    description: "Group food ordering web application",
                    role: "Web App Developer", 
                    tech: ["Flask", "Python", "JavaScript", "SQLite", "Gunicorn"],
                    github: "https://github.com/omarionnn/mosu",
                    achievements: ["40% reduction in order processing time", "30% increase in user trust", "25% reduction in billing errors"]
                },
                "Saafi DevOps Platform": {
                    description: "Multi-cloud infrastructure provisioning platform",
                    role: "Full Stack Developer",
                    tech: ["TypeScript", "Next.js", "Express", "Supabase", "Terraform", "Pulumi", "AWS", "GCP"],
                    github: "https://github.com/omarionnn/Saafi_Devops",
                    achievements: ["Developer-first self-service platform", "GitHub integration", "PR-triggered environment provisioning", "Cost/usage tracking"]
                },
                "AI Recruiter": {
                    description: "AI-powered phone screening system",
                    role: "Full Stack Developer",
                    tech: ["TypeScript", "Next.js", "Tailwind CSS", "shadcn/ui", "AI Integration", "Voice APIs"],
                    github: "https://github.com/omarionnn/interview",
                    achievements: ["Automated first-round interviews", "Structured call logs", "Operator console", "API endpoints for call management"]
                }
            },
            experience: {
                "Open Source Contributor": {
                    company: "Zulip Open Source Project",
                    duration: "August 2024 – Present",
                    location: "Remote",
                    achievements: ["25% reduction in server response times", "15% reduction in error rates", "Efficient caching strategies"]
                },
                "Software Developer": {
                    company: "Big Orders",
                    duration: "March 2024 – Present", 
                    location: "Remote",
                    achievements: ["30% increase in group order participation", "40% reduction in menu access time", "25% improvement in user satisfaction"]
                },
                "Teaching Assistant": {
                    company: "Calvin University Engineering Department",
                    duration: "September 2023 – December 2023",
                    location: "Grand Rapids, MI",
                    achievements: ["Assisted 25+ students", "12% increase in lab performance", "95% successful lab project completion"]
                },
                "Software Development Engineer Intern": {
                    company: "Amazon Web Services",
                    duration: "May 2023 – August 2023",
                    location: "Bellevue, WA",
                    achievements: ["100% service availability", "17% improvement in customer satisfaction", "Throttling mechanism development"]
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.createAvatar();
        this.bindEvents();
        this.addWelcomeMessage();
    }
    
    createAvatar() {
        // Create avatar HTML
        const avatarHTML = `
            <div class="ai-assistant" id="aiAssistant">
                <div class="avatar-container" id="avatarContainer">
                    <div class="avatar-image">
                        <i class="fas fa-comments" style="font-size: 24px; color: white;"></i>
                    </div>
                    <div class="avatar-status">Click to chat!</div>
                </div>
                
                <div class="chat-modal" id="chatModal">
                                    <div class="chat-header">
                    <h3>🤖 AI Portfolio Assistant</h3>
                    <button class="close-chat" id="closeChat">×</button>
                </div>
                    <div class="chat-messages" id="chatMessages">
                        <!-- Messages will be added here -->
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chatInput" class="chat-input" placeholder="Ask me about Omari's skills, projects, or experience...">
                        <button id="sendMessage" class="send-button">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', avatarHTML);
    }
    
    bindEvents() {
        // Avatar click with proper event handling
        const avatarContainer = document.getElementById('avatarContainer');
        avatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Chat button clicked');
            this.toggleChat();
        });
        
        // Close chat button
        const closeChat = document.getElementById('closeChat');
        closeChat.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Close button clicked');
            this.closeChat();
        });
        
        // Send message
        const sendButton = document.getElementById('sendMessage');
        sendButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sendMessage();
        });
        
        // Enter key
        const chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('chatModal');
            const avatar = document.getElementById('avatarContainer');
            
            if (this.isOpen && !modal.contains(e.target) && !avatar.contains(e.target)) {
                this.closeChat();
            }
        });
        
        // Prevent chat modal clicks from bubbling
        const chatModal = document.getElementById('chatModal');
        chatModal.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    toggleChat() {
        console.log('Toggle chat called, current state:', this.isOpen);
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        console.log('Opening chat');
        this.isOpen = true;
        const modal = document.getElementById('chatModal');
        const avatar = document.getElementById('avatarContainer');
        
        // Hide avatar with fade out
        avatar.style.opacity = '0';
        avatar.style.transform = 'scale(0.8)';
        
        // Show chat interface
        modal.style.display = 'flex';
        modal.classList.add('chat-open');
        
        // Focus on input after animation
        setTimeout(() => {
            const chatInput = document.getElementById('chatInput');
            chatInput.focus();
        }, 300);
    }
    
    closeChat() {
        console.log('Closing chat');
        this.isOpen = false;
        const modal = document.getElementById('chatModal');
        const avatar = document.getElementById('avatarContainer');
        
        // Hide chat interface
        modal.classList.remove('chat-open');
        
        // Show avatar with fade in
        setTimeout(() => {
            avatar.style.opacity = '1';
            avatar.style.transform = 'scale(1)';
            modal.style.display = 'none';
        }, 300);
    }
    
    addWelcomeMessage() {
        const welcomeHTML = `
            <div class="message assistant">
                <div class="message-content">
                    <div class="welcome-message">
                        <h4>🤖 Hi! I'm your AI Portfolio Assistant</h4>
                        <p>I can help you learn about Omari's:</p>
                        <p>• Skills & Technologies</p>
                        <p>• Projects & Achievements</p>
                        <p>• Work Experience</p>
                        <p>• Education & Background</p>
                        <p>Just ask me anything!</p>
                    </div>
                </div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        
        document.getElementById('chatMessages').innerHTML = welcomeHTML;
    }
    
    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response
        const response = await this.generateResponse(message);
        
        // Hide typing indicator and show response
        this.hideTypingIndicator();
        this.addMessage('assistant', response);
    }
    
    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageHTML = `
            <div class="message ${sender}">
                <div class="message-content">${content}</div>
                <div class="message-time">${this.getCurrentTime()}</div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in history
        this.messageHistory.push({ sender, content, time: this.getCurrentTime() });
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatMessages');
        const typingHTML = `
            <div class="typing-indicator show">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async generateResponse(userQuestion) {
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const question = userQuestion.toLowerCase();
        
        // Check for specific project questions
        for (const [projectName, project] of Object.entries(this.portfolioData.projects)) {
            if (question.includes(projectName.toLowerCase()) || 
                question.includes(projectName.replace(/\s+/g, '').toLowerCase())) {
                return this.getProjectResponse(projectName, project);
            }
        }
        
        // Check for experience questions
        for (const [role, experience] of Object.entries(this.portfolioData.experience)) {
            if (question.includes(experience.company.toLowerCase()) || 
                question.includes(role.toLowerCase())) {
                return this.getExperienceResponse(role, experience);
            }
        }
        
        // Check for skill questions
        if (this.containsAny(question, ['skill', 'technology', 'tech', 'programming', 'language', 'framework'])) {
            return this.getSkillsResponse();
        }
        
        // Check for project questions
        if (this.containsAny(question, ['project', 'build', 'create', 'develop', 'work'])) {
            return this.getProjectsResponse();
        }
        
        // Check for experience questions
        if (this.containsAny(question, ['experience', 'work', 'job', 'internship', 'amazon', 'company'])) {
            return this.getExperienceResponse();
        }
        
        // Check for education questions
        if (this.containsAny(question, ['education', 'school', 'university', 'degree', 'calvin', 'graduate'])) {
            return this.getEducationResponse();
        }
        
        // Check for general questions
        if (this.containsAny(question, ['who', 'what', 'tell me about', 'about'])) {
            return this.getGeneralResponse();
        }
        
        // Default response
        return this.getDefaultResponse();
    }
    
    getProjectResponse(projectName, project) {
        return `🎯 <strong>${projectName}</strong><br><br>
        <strong>Role:</strong> ${project.role}<br>
        <strong>Description:</strong> ${project.description}<br>
        <strong>Technologies:</strong> ${project.tech.join(', ')}<br><br>
        <strong>Key Achievements:</strong><br>
        ${project.achievements.map(achievement => `• ${achievement}`).join('<br>')}<br><br>
        <a href="${project.github}" target="_blank" style="color: #667eea; text-decoration: none;">🔗 View on GitHub</a>`;
    }
    
    getSkillsResponse() {
        const skills = this.portfolioData.skills;
        return `💻 <strong>Omari's Technical Skills</strong><br><br>
        <strong>Programming Languages:</strong><br>
        ${skills.languages.join(', ')}<br><br>
        <strong>Technologies & Tools:</strong><br>
        ${skills.technologies.join(', ')}<br><br>
        <strong>Soft Skills:</strong><br>
        ${skills.softSkills.join(', ')}<br><br>
        Omari is experienced in both frontend and backend development, cloud infrastructure, and AI integration!`;
    }
    
    getProjectsResponse() {
        const projects = this.portfolioData.projects;
        let response = `🚀 <strong>Omari's Projects</strong><br><br>`;
        
        for (const [name, project] of Object.entries(projects)) {
            response += `<strong>${name}</strong> - ${project.description}<br>
            <em>Role:</em> ${project.role}<br>
            <em>Tech:</em> ${project.tech.join(', ')}<br><br>`;
        }
        
        response += `Each project demonstrates different aspects of Omari's technical capabilities and problem-solving skills!`;
        return response;
    }
    
    getExperienceResponse() {
        const experiences = this.portfolioData.experience;
        let response = `💼 <strong>Omari's Work Experience</strong><br><br>`;
        
        for (const [role, exp] of Object.entries(experiences)) {
            response += `<strong>${role}</strong><br>
            <em>${exp.company}</em> | ${exp.duration}<br>
            <em>Location:</em> ${exp.location}<br>
            <em>Achievements:</em><br>
            ${exp.achievements.map(achievement => `• ${achievement}`).join('<br>')}<br><br>`;
        }
        
        return response;
    }
    
    getEducationResponse() {
        return `🎓 <strong>Education</strong><br><br>
        <strong>${this.portfolioData.education}</strong><br><br>
        <strong>Relevant Coursework:</strong><br>
        Applied Computing, Data Structures, Protocol Development, Engineering Design, Networking, Machine Learning, Network Security, Cloud Security, NLP, Object Oriented Programming, Distributed Computing Systems, Web Technologies, Cloud Computing<br><br>
        Omari graduated with a strong foundation in both computer science and engineering principles!`;
    }
    
    getGeneralResponse() {
        return `👋 <strong>About Omari Nyarko</strong><br><br>
        Omari is a ${this.portfolioData.role} at ${this.portfolioData.company} and a recent Computer Engineering graduate from Calvin University.<br><br>
        He's passionate about learning, playing basketball, and running. He also shares his knowledge through Leetcode tutorials on his YouTube channel.<br><br>
        <strong>Contact:</strong> omariij24@gmail.com<br><br>
        Feel free to ask me about his skills, projects, experience, or education!`;
    }
    
    getDefaultResponse() {
        const responses = [
            "I'm here to help! Ask me about Omari's skills, projects, experience, or education.",
            "Not sure about that, but I can tell you about Omari's technical skills, projects, work experience, or education!",
            "I'd be happy to help! Try asking about Omari's programming skills, projects he's built, his work experience, or his education background.",
            "Let me know if you'd like to learn about Omari's technical abilities, projects, professional experience, or academic background!"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

// Initialize AI Assistant when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
}); 