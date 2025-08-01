// Skill Map Interactive JavaScript
class SkillMap {
    constructor() {
        this.map = document.getElementById('skillMap');
        this.modal = document.getElementById('projectModal');
        this.scale = 1;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        this.projectData = {
            'socialize': {
                title: 'Socialize',
                role: 'Web App Developer',
                description: 'Engineered a social networking platform using Flask and Bootstrap 5, achieving a 30% improvement in page load times and a 25% increase in user engagement through real-time interactions. Designed a responsive interface compatible with various devices, resulting in a 40% boost in mobile user satisfaction. Integrated anonymous user profiles, post creation, likes, retweets, and messaging features, leading to a 50% rise in user activity and a 35% growth in user retention.',
                techStack: ['Flask', 'Python', 'Bootstrap', 'JavaScript', 'CSS'],
                github: 'https://github.com/omarionnn/socialize',
                demo: null
            },
            'bigorders': {
                title: 'BigOrders',
                role: 'Web App Developer',
                description: 'Developed BigOrders, a web-based platform that streamlines group food ordering, enabling multiple users to collaboratively create and manage orders in real-time, resulting in a 40% reduction in order processing time. Implemented secure user authentication with session management, ensuring user-specific data isolation and enhancing platform security, leading to a 30% increase in user trust and engagement. Designed a comprehensive receipt generation system that groups items by user, calculates individual subtotals, and provides a total for the group order, simplifying the payment process and reducing billing errors by 25%.',
                techStack: ['Flask', 'Python', 'JavaScript', 'SQLite', 'Gunicorn', 'HTML/CSS'],
                github: 'https://github.com/omarionnn/mosu',
                demo: null
            },
            'saafi': {
                title: 'Saafi DevOps Platform',
                role: 'Full Stack Developer',
                description: 'Developed Saafi, a developer-first self-service DevOps platform for fast, secure, multi-cloud infrastructure provisioning (AWS & GCP) with GitHub integration. Implemented a monorepo structure with a Next.js frontend, Express backend, and infrastructure automation using Terraform/Pulumi. Integrated Supabase for authentication and database, enabling user-specific environment management and blueprint marketplace features. Enabled PR-triggered environment provisioning, secrets management, and cost/usage tracking for modern DevOps workflows.',
                techStack: ['TypeScript', 'Next.js', 'Express', 'Supabase', 'Terraform', 'Pulumi', 'AWS', 'GCP'],
                github: 'https://github.com/omarionnn/Saafi_Devops',
                demo: null
            },
            'ai-recruiter': {
                title: 'AI Recruiter',
                role: 'Full Stack Developer',
                description: 'Developed an AI-powered phone screening system to automate first-round candidate interviews, enabling recruiters to initiate calls and review structured call logs through an operator console. Implemented an AI agent with scripted dialogue that conducts screening questions covering role interest, years of experience, tech stack familiarity, and work authorization status. Built a comprehensive operator console with call initiation forms, call logs table view, and detailed transcript review functionality for efficient candidate evaluation. Designed and implemented API endpoints for call management, transcript storage, and call log retrieval, ensuring scalable and maintainable architecture.',
                techStack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'AI Integration', 'Voice APIs'],
                github: 'https://github.com/omarionnn/interview',
                demo: null
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupControls();
        this.setupMiniMap();
        this.animateNodes();
    }
    
    setupEventListeners() {
        // Map pan and zoom
        this.map.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Touch events for mobile
        this.map.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        
        // Wheel zoom
        this.map.addEventListener('wheel', this.handleWheel.bind(this));
        
        // Project node clicks
        document.querySelectorAll('.project-node').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = node.dataset.project;
                this.openProjectModal(projectId);
            });
        });
        
        // Region hover effects
        document.querySelectorAll('.region').forEach(region => {
            region.addEventListener('mouseenter', this.handleRegionHover.bind(this));
            region.addEventListener('mouseleave', this.handleRegionLeave.bind(this));
        });
        
        // Mini-map node clicks
        document.querySelectorAll('.mini-node').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = node.dataset.project;
                this.focusOnProject(projectId);
            });
        });
        
        // Modal close
        document.getElementById('closeModal').addEventListener('click', this.closeModal.bind(this));
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }
    
    setupControls() {
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
    }
    
    setupMiniMap() {
        // Mini-map interaction
        const miniMap = document.querySelector('.mini-map');
        miniMap.addEventListener('click', (e) => {
            const rect = miniMap.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // Convert mini-map coordinates to main map coordinates
            this.panTo(x * 100, y * 100);
        });
    }
    
    startDrag(e) {
        this.isDragging = true;
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        this.startX = clientX - this.translateX;
        this.startY = clientY - this.translateY;
        
        e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        this.translateX = clientX - this.startX;
        this.translateY = clientY - this.startY;
        
        this.updateTransform();
        e.preventDefault();
    }
    
    endDrag() {
        this.isDragging = false;
    }
    
    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(delta);
    }
    
    zoom(factor) {
        this.scale *= factor;
        this.scale = Math.max(0.5, Math.min(3, this.scale));
        this.updateTransform();
    }
    
    updateTransform() {
        this.map.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }
    
    resetView() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }
    
    panTo(x, y) {
        const mapRect = this.map.getBoundingClientRect();
        const centerX = mapRect.width / 2;
        const centerY = mapRect.height / 2;
        
        this.translateX = centerX - (x * mapRect.width / 100);
        this.translateY = centerY - (y * mapRect.height / 100);
        this.updateTransform();
    }
    
    focusOnProject(projectId) {
        const node = document.querySelector(`[data-project="${projectId}"]`);
        if (node) {
            const rect = node.getBoundingClientRect();
            const mapRect = this.map.getBoundingClientRect();
            
            const x = (rect.left + rect.width / 2 - mapRect.left) / mapRect.width * 100;
            const y = (rect.top + rect.height / 2 - mapRect.top) / mapRect.height * 100;
            
            this.panTo(x, y);
            this.scale = 1.5;
            this.updateTransform();
            
            // Highlight the node
            node.classList.add('active');
            setTimeout(() => node.classList.remove('active'), 2000);
        }
    }
    
    handleRegionHover(e) {
        const region = e.currentTarget;
        const regionType = region.dataset.region;
        
        // Highlight related projects
        document.querySelectorAll('.project-node').forEach(node => {
            const projectId = node.dataset.project;
            const project = this.projectData[projectId];
            
            if (this.isProjectInRegion(project, regionType)) {
                node.style.transform = 'scale(1.2)';
                node.style.zIndex = '200';
            }
        });
        
        // Highlight connection lines
        document.querySelectorAll('.connection-line').forEach(line => {
            line.classList.add('active');
        });
    }
    
    handleRegionLeave() {
        // Reset all nodes
        document.querySelectorAll('.project-node').forEach(node => {
            node.style.transform = '';
            node.style.zIndex = '';
        });
        
        // Reset connection lines
        document.querySelectorAll('.connection-line').forEach(line => {
            line.classList.remove('active');
        });
    }
    
    isProjectInRegion(project, regionType) {
        const regionTechs = {
            'frontend': ['Bootstrap', 'Next.js', 'React', 'TypeScript'],
            'backend': ['Flask', 'Python', 'Express', 'Node.js'],
            'database': ['SQLite', 'Supabase', 'MongoDB', 'PostgreSQL'],
            'cloud': ['AWS', 'GCP', 'Terraform', 'Docker'],
            'ai': ['AI Integration', 'Machine Learning', 'Voice APIs']
        };
        
        return project.techStack.some(tech => 
            regionTechs[regionType].includes(tech)
        );
    }
    
    openProjectModal(projectId) {
        const project = this.projectData[projectId];
        if (!project) return;
        
        // Update modal content
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').innerHTML = `
            <h4>Role: ${project.role}</h4>
            <p>${project.description}</p>
        `;
        
        document.getElementById('modalTechStack').innerHTML = `
            <h4>Tech Stack</h4>
            <div class="tech-stack-tags">
                ${project.techStack.map(tech => `<span>${tech}</span>`).join('')}
            </div>
        `;
        
        const linksHtml = `
            <a href="${project.github}" target="_blank">
                <i class="fab fa-github"></i>
                View on GitHub
            </a>
        `;
        
        if (project.demo) {
            linksHtml += `
                <a href="${project.demo}" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                </a>
            `;
        }
        
        document.getElementById('modalLinks').innerHTML = linksHtml;
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    animateNodes() {
        // Animate connection lines
        setTimeout(() => {
            document.querySelectorAll('.connection-line').forEach((line, index) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                }, index * 200);
            });
        }, 1000);
    }
}

// Initialize the skill map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SkillMap();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '+':
        case '=':
            e.preventDefault();
            document.getElementById('zoomIn').click();
            break;
        case '-':
            e.preventDefault();
            document.getElementById('zoomOut').click();
            break;
        case 'Escape':
            document.getElementById('closeModal').click();
            break;
        case '0':
            e.preventDefault();
            document.getElementById('resetView').click();
            break;
    }
}); 