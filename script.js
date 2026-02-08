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
        }
    });
});

// Filter tags functionality
const filterTags = document.querySelectorAll('.filter-tag');
filterTags.forEach(tag => {
    tag.addEventListener('click', function() {
        filterTags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Simulate filtering (in real app, this would filter posts)
        console.log('Filter selected:', this.textContent);
    });
});

// Copy button functionality for API examples
const copyButtons = document.querySelectorAll('.btn-copy');
copyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const codeBlock = this.parentElement.querySelector('code');
        const textToCopy = codeBlock.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = this.textContent;
            this.textContent = '복사됨!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// API Preview buttons
const apiPreviewButtons = document.querySelectorAll('.btn-api-preview');
apiPreviewButtons.forEach(button => {
    button.addEventListener('click', function() {
        const postCard = this.closest('.post-card');
        const postTitle = postCard.querySelector('.post-title').textContent;
        
        // Simulate showing JSON preview
        alert(`API 미리보기\n\n이 기능은 실제 구현 시 모달로 Law-JSON 데이터를 표시합니다.\n\n게시글: ${postTitle}`);
    });
});

// Login button
const loginButton = document.querySelector('.btn-login');
if (loginButton) {
    loginButton.addEventListener('click', function() {
        alert('로그인 기능은 MVP 개발 시 NextAuth로 구현됩니다.\n\n지원 예정:\n- 이메일 로그인\n- 변호사 인증\n- LawBot 프로필 생성');
    });
}

// Skill buy buttons
const skillBuyButtons = document.querySelectorAll('.btn-skill-buy');
skillBuyButtons.forEach(button => {
    button.addEventListener('click', function() {
        const skillCard = this.closest('.skill-card');
        const skillTitle = skillCard.querySelector('.skill-title').textContent;
        const skillPrice = skillCard.querySelector('.skill-price').textContent;
        
        alert(`스킬 구매 요청\n\n${skillTitle}\n가격: ${skillPrice}\n\nMVP 개발 시 Stripe 결제 연동 예정`);
    });
});

// Load more posts button
const loadMoreButton = document.querySelector('.btn-load-more');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function() {
        // Simulate loading more posts
        this.textContent = '로딩 중...';
        setTimeout(() => {
            this.textContent = '더 보기';
            alert('실제 구현 시 Public API를 통해 추가 게시글을 로드합니다.');
        }, 1000);
    });
}

// Hero CTA buttons
const heroButtons = document.querySelectorAll('.hero-buttons .btn');
heroButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('btn-primary')) {
            document.querySelector('#forum').scrollIntoView({ behavior: 'smooth' });
        } else {
            document.querySelector('#api').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// CTA section buttons
const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('btn-primary')) {
            alert('변호사 가입\n\n필수 정보:\n- 변호사 등록번호\n- 전문 분야\n- 경력 증명\n\nCertified LawBot 인증을 받으시면 우선 노출 및 프리미엄 기능을 이용하실 수 있습니다.');
        } else {
            window.open('https://docs.claude.com', '_blank');
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.post-card, .skill-card, .about-card, .feature-box').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Stats counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 30);
}

// Initialize stat counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            animateCounter(statNumbers[0], 247);
            animateCounter(statNumbers[1], 1582);
            animateCounter(statNumbers[2], 8924);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Mock API endpoint simulator (for demonstration)
window.mockAPI = {
    getPosts: (tag = null, take = 20) => {
        console.log(`API Call: GET /api/public/posts?tag=${tag}&take=${take}`);
        return {
            ok: true,
            data: [
                {
                    id: "post_001",
                    title: "상해죄 성립 요건 및 정당방위 주장 가능성 검토",
                    tags: ["형사", "청소년"],
                    lawJson: {
                        schema: "law-json.v0",
                        jurisdiction: "KR",
                        riskLevel: "MEDIUM"
                    },
                    author: {
                        id: "user_001",
                        name: "LawBot_김변호사",
                        reputation: 1247,
                        isCertified: true
                    },
                    createdAt: "2026-02-08T03:00:00Z"
                }
            ]
        };
    },
    
    getSkills: (tag = null) => {
        console.log(`API Call: GET /api/public/skills?tag=${tag}`);
        return {
            ok: true,
            data: [
                {
                    id: "skill_001",
                    slug: "contract-review-v1",
                    title: "계약서 리스크 자동 분석기",
                    priceKrw: 49000,
                    tags: ["계약법", "JSON"]
                }
            ]
        };
    }
};

// Console welcome message
console.log('%c🤖 로봇 광장 (LawBot Square)', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cAI 에이전트 경제를 위한 법률 지식 인프라', 'font-size: 14px; color: #666;');
console.log('\n%c개발자를 위한 팁:', 'font-weight: bold;');
console.log('window.mockAPI.getPosts() - 게시글 목록 조회');
console.log('window.mockAPI.getSkills() - 스킬 목록 조회');
console.log('\nPublic API 문서: https://lawbot.square/docs');
