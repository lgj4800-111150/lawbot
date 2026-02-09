// Smooth scrolling
function scrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        scrollTo(this.getAttribute('href'));
    });
});

// Filter System (Ralph-style)
const filterButtons = document.querySelectorAll('.filter-btn');
const agentCards = document.querySelectorAll('.agent-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Toggle active state within the same filter group
        const filterGroup = this.closest('.filter-group');
        const groupButtons = filterGroup.querySelectorAll('.filter-btn');
        
        groupButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Apply filters
        applyFilters();
    });
});

function applyFilters() {
    const activeTier = document.querySelector('[data-tier].active')?.dataset.tier || 'all';
    const activePermission = document.querySelector('[data-permission].active')?.dataset.permission || 'all';
    const activeField = document.querySelector('[data-field].active')?.dataset.field || 'all';
    
    console.log('Filters applied:', { tier: activeTier, permission: activePermission, field: activeField });
    
    // In real implementation, this would filter agent cards
    // For demo, just log the filters
    agentCards.forEach(card => {
        // Filtering logic would go here
        card.style.display = 'block'; // Show all for demo
    });
}

// Sandbox Buttons
const sandboxButtons = document.querySelectorAll('.btn-sandbox');
sandboxButtons.forEach(button => {
    button.addEventListener('click', function() {
        const agentCard = this.closest('.agent-card');
        const agentName = agentCard.querySelector('.agent-name').textContent;
        
        // Scroll to sandbox section
        scrollTo('#sandbox');
        
        // Show notification
        setTimeout(() => {
            alert(`샌드박스 테스트 시작\n\n에이전트: ${agentName}\n\n실제 구현 시 가상 환경에서 에이전트가 실행되며,\n실시간 보안 로그를 확인할 수 있습니다.`);
        }, 500);
    });
});

// Deploy Buttons
const deployButtons = document.querySelectorAll('.btn-deploy');
deployButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('disabled')) {
            alert('⚠️ 승인 필요\n\n이 에이전트는 무한 실행 권한이 필요합니다.\nL3 변호사 승인 후 배포 가능합니다.');
            return;
        }
        
        const agentCard = this.closest('.agent-card');
        const agentName = agentCard.querySelector('.agent-name').textContent;
        
        if (confirm(`${agentName}을(를) 배포하시겠습니까?\n\n배포 후 OpenClaw에서 즉시 사용 가능합니다.`)) {
            // Simulate deployment
            this.textContent = '⏳ 배포 중...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = '✓ 배포 완료';
                this.style.background = '#10b981';
                
                setTimeout(() => {
                    this.textContent = '⚡ 즉시 배포';
                    this.disabled = false;
                    this.style.background = '';
                }, 2000);
            }, 1500);
        }
    });
});

// Skill Add Buttons
const skillAddButtons = document.querySelectorAll('.btn-skill-add');
skillAddButtons.forEach(button => {
    button.addEventListener('click', function() {
        const skillItem = this.closest('.skill-item');
        const skillName = skillItem.querySelector('h5').textContent;
        
        this.textContent = '✓ 추가됨';
        this.style.background = '#10b981';
        this.disabled = true;
        
        setTimeout(() => {
            alert(`스킬 추가 완료\n\n"${skillName}"이(가) 에이전트에 추가되었습니다.\n\nOpenClaw 재시작 후 사용 가능합니다.`);
            
            setTimeout(() => {
                this.textContent = '+ 내 에이전트에 추가';
                this.style.background = '';
                this.disabled = false;
            }, 2000);
        }, 500);
    });
});

// Terminal Log Animation
function simulateTerminalLog() {
    const terminalBody = document.querySelector('.terminal-body');
    if (!terminalBody) return;
    
    const logs = [
        { time: '15:42:01', type: 'success', msg: '✓ Agent "Criminal Case Analyzer" initialized' },
        { time: '15:42:03', type: 'info', msg: '→ Loading evidence files from sandboxed directory' },
        { time: '15:42:05', type: 'success', msg: '✓ Security policy applied: READ-ONLY mode' },
        { time: '15:42:07', type: 'blocked', msg: '🛡️ BLOCKED: Attempted to access /Users/*/Library/Keychains' },
        { time: '15:42:09', type: 'success', msg: '✓ Analysis complete: 0 violations detected' },
        { time: '15:42:10', type: 'info', msg: '→ 1Password: SAFE - No access attempts recorded' }
    ];
    
    let currentLog = 0;
    
    setInterval(() => {
        const newLog = logs[currentLog % logs.length];
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${newLog.type}`;
        logEntry.innerHTML = `
            <span class="timestamp">[${newLog.time}]</span>
            <span class="message">${newLog.msg}</span>
        `;
        
        terminalBody.appendChild(logEntry);
        
        // Keep only last 10 logs
        const allLogs = terminalBody.querySelectorAll('.log-entry');
        if (allLogs.length > 10) {
            allLogs[0].remove();
        }
        
        terminalBody.scrollTop = terminalBody.scrollHeight;
        currentLog++;
    }, 3000);
}

// Security Metrics Animation
function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric, index) => {
        const targetValue = metric.textContent;
        
        if (targetValue.includes('%')) {
            const target = parseInt(targetValue);
            animateCounter(metric, target, '%');
        } else {
            const target = parseInt(targetValue);
            animateCounter(metric, target, '');
        }
    });
}

function animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = Math.ceil(target / 30);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = current + suffix;
        }
    }, 30);
}

// Copy Button Functionality
const copyButtons = document.querySelectorAll('.btn-copy');
copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const codeBlock = this.parentElement.querySelector('code');
        const textToCopy = codeBlock.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = this.textContent;
            this.textContent = '✓ 복사됨';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// Login Button
const loginButton = document.querySelector('.btn-login');
if (loginButton) {
    loginButton.addEventListener('click', function() {
        alert('로그인 기능\n\n회원 유형:\n- 변호사 (에이전트 등록 가능)\n- 개발자 (API 키 발급)\n- 일반 사용자 (에이전트 다운로드)\n\nMVP 개발 시 구현 예정');
    });
}

// Sandbox Action Buttons
const sandboxDeploy = document.querySelector('.sandbox-actions .btn-primary');
if (sandboxDeploy) {
    sandboxDeploy.addEventListener('click', function() {
        if (confirm('샌드박스 테스트가 성공적으로 완료되었습니다.\n\n이 에이전트를 내 PC에 배포하시겠습니까?')) {
            alert('✓ 배포 완료\n\nOpenClaw에서 즉시 사용 가능합니다.\n\n실행 명령어:\n$ openclaw run criminal-analyzer');
        }
    });
}

const sandboxRetest = document.querySelector('.sandbox-actions .btn-secondary');
if (sandboxRetest) {
    sandboxRetest.addEventListener('click', function() {
        const terminalBody = document.querySelector('.terminal-body');
        if (terminalBody) {
            terminalBody.innerHTML = '';
            alert('🔄 샌드박스 재시작\n\n에이전트를 처음부터 다시 테스트합니다.');
            simulateTerminalLog();
        }
    });
}

const sandboxStop = document.querySelector('.sandbox-actions .btn-danger');
if (sandboxStop) {
    sandboxStop.addEventListener('click', function() {
        if (confirm('⛔ 샌드박스 실행을 중단하시겠습니까?')) {
            const statusBadge = document.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = '⚫ 중단됨';
                statusBadge.classList.remove('running');
                statusBadge.style.background = '#fee2e2';
                statusBadge.style.color = '#991b1b';
            }
        }
    });
}

// Terminal Expand Button
const terminalExpand = document.querySelector('.btn-terminal-expand');
if (terminalExpand) {
    terminalExpand.addEventListener('click', function() {
        const terminal = document.querySelector('.terminal');
        terminal.classList.toggle('fullscreen');
        this.textContent = terminal.classList.contains('fullscreen') ? '축소' : '전체화면';
    });
}

// Hero Stats Counter Animation
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.hero .stat-number');
            if (statNumbers.length > 0) {
                animateCounter(statNumbers[0], 247, '');
                animateCounter(statNumbers[1], 1582, '');
                statNumbers[2].textContent = '100%';
            }
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Animate Cards on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.agent-card, .skill-category, .sandbox-panel').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(simulateTerminalLog, 1000);
    
    const sandboxSection = document.querySelector('#sandbox');
    if (sandboxSection) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateMetrics();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        metricsObserver.observe(sandboxSection);
    }
});

// Mock API for demonstration
window.LawBotAPI = {
    agents: {
        list: (filters = {}) => {
            console.log('API Call: GET /api/agents', filters);
            return {
                ok: true,
                data: [
                    {
                        id: 'criminal-analyzer',
                        name: 'Criminal Case Analyzer',
                        version: 'v2.3.1',
                        tier: 'l3',
                        permission: 'limited',
                        field: 'criminal'
                    }
                ]
            };
        }
    },
    
    skills: {
        search: (category) => {
            console.log('API Call: GET /api/skills', { category });
            return {
                ok: true,
                data: [
                    {
                        id: 'inheritance-division',
                        name: 'inheritance_division.md',
                        category: '상속',
                        type: 'md'
                    }
                ]
            };
        }
    },
    
    sandbox: {
        deploy: (agentId, policy = 'read-only') => {
            console.log('API Call: POST /api/sandbox/deploy', { agentId, policy });
            return {
                ok: true,
                vmId: 'vm-' + Math.random().toString(36).substr(2, 9),
                status: 'running'
            };
        }
    }
};

// Console welcome
console.log('%c🤖 로봇 광장 (LawBot Square)', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%c법률 기술 저장소 - OpenClaw Compatible', 'font-size: 14px; color: #666;');
console.log('\n%c개발자 API:', 'font-weight: bold;');
console.log('window.LawBotAPI.agents.list() - 에이전트 목록');
console.log('window.LawBotAPI.skills.search("상속") - 스킬 검색');
console.log('window.LawBotAPI.sandbox.deploy("agent-id") - 샌드박스 배포');
console.log('\n📚 API 문서: https://lawbotsquare.com/docs');
