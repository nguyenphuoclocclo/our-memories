// ==========================================
// 1. CẤU HÌNH THỜI GIAN BẮT ĐẦU YÊU
// ==========================================
const startDate = new Date(2023, 1, 14, 0, 0, 0);

function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}
setInterval(updateTimer, 1000);
updateTimer();

// ==========================================
// 2. DỮ LIỆU CÁC MẢNH KÝ ỨC
// ==========================================
const memoriesData = [
    {
        id: 0,
        title: "Lần Đầu Gặp Mặt 🌸",
        icon: "✨",
        label: "Lần đầu gặp mặt",
        img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
        text: "Hôm đó trời mưa nhẹ, ai đó mặc áo màu xám bước vào. Ấn tượng đầu tiên là: 'Ủa sao nhìn lạnh lùng dữ vậy?', ai ngờ đâu sau này bám người ta dữ lắm!"
    },
    {
        id: 1,
        title: "Món Ăn Cãi Nhau Nhiều Nhất 🍜",
        icon: "🍕",
        label: "Món ăn cãi nhau nhiều nhất",
        img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
        text: "Hỏi 'Hôm nay ăn gì?' luôn là câu hỏi hóc búa nhất thế giới. Kết quả 90% lần nào cũng chốt bằng... Bún Đậu / Mì Cay!"
    },
    {
        id: 2,
        title: "Chuyến Đi Đáng Nhớ 🌄",
        icon: "🌙",
        label: "Chuyến đi đáng nhớ",
        img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80",
        text: "Lần đầu tiên cùng nhau đi xa, lạc đường giữa đêm nhưng lại nhìn thấy bầu trời ngàn sao đẹp nhất từ trước đến nay."
    },
    {
        id: 3,
        title: "Bài Hát Của Chúng Mình 🎧",
        icon: "🎶",
        label: "Bài hát của 2 đứa",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80",
        text: "Mỗi khi giai điệu này vang lên, tự nhiên bao nhiêu mệt mỏi đều tan biến hết. Vì đó là bài hát chỉ cần nghe là nhớ tới người kia."
    },
    {
        id: 4,
        title: "Thói Quen Bị Phát Hiện 🤫",
        icon: "🙈",
        label: "Thói quen xấu bị bóc phốt",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
        text: "Chuyên gia hứa '10 phút nữa ngủ/xong', nhưng thực tế là 2 tiếng sau vẫn thấy sáng đèn online! Đã bị phát hiện nhé!"
    }
];

// ==========================================
// 3. ENGINE CÁC QUẢ CẦU BAY LƠ LỬNG (PHYSICS FLOATING)
// ==========================================
let floatingOrbs = [];
let collectedCount = 0;
let activeMemoryIndex = null;
const floatingArea = document.getElementById('floating-area');

// Class này chịu tránh nhiệm sinh ra một quả cầu kỷ niệm lơ lửng trên màn hình
class FloatingOrb {
    // data: Chứa thông tin kỷ niệm
    // index: Thứ tự của quả cầu này trong danh sách
    constructor(data, index) {
        this.data = data;
        this.index = index;

        this.element = document.createElement('div');
        this.element.className = 'floating-orb';

        // Chèn nội dung HTML vào trong quả cầu
        // Example:
        // <div class="floating-orb">
        // <div class="orb-inner">🎈 Sinh nhật 20 tuổi</div>
        // </div>
        this.element.innerHTML = `<div class="orb-inner">${data.icon} ${data.label}</div>`;

        // Vị trí xuất phát ngẫu nhiên
        const padding = 60; // Lùi vào 60px từ các mép màn hình (để quả cầu không bị mép màn hình che mất)
        const headerOffset = 220; // Chừa lại 220px tính từ đỉnh màn hình xuống (tránh việc quả cầu xuất hiện đè lên thanh Tiêu đề / Header của trang web)

        // Kích thước ước tính của quả cầu (rộng 180px, cao 45px)
        this.width = 180;
        this.height = 45;

        // - Giả sử màn hình máy tính rộng window.innerWidth = 1000px
        // - Vùng chiều rộng an toàn còn lại = 1000 - 180 - (60*2) = 700
        // - Math.random() trả về 1 số ngẫu nhiên từ 0.0 đến 1.0 (ví dụ: 0.5)
        // - Tọa độ X = 60 + (0.5 * 700) = 410
        // => Kết quả: Quả cầu xuất hiện ở vị trí X = 410px (rất an toàn, không bị chèn ra ngoài lề trái hay lề phải)
        this.x = padding + Math.random() * Math.max(50, (window.innerWidth - this.width - padding * 2));

        // - Giả sử chiều cao màn hình window.innerHeight = 800px
        // - Vùng chiều cao an toàn còn lại = 800 - 220 - 45 - 60 = 475
        // - Math.random() trả về 1 số ngẫu nhiên từ 0.0 đến 1.0 (ví dụ: 0.2)
        // - Tọa độ Y = 220 + 0.2 * 475 = 315
        // => Kết quả: Quả cầu nằm ở vị trí Y = 315px (nằm bên dưới Header 220px và không bị lọt xuống dưới cùng)
        this.y = headerOffset + Math.random() * Math.max(50, (window.innerHeight - headerOffset - this.height - padding));

        // Tạo vận tốc di chuyển & Pha dao động lơ lửng
        // Math.random() trả về từ 0.0 đến 1.0
        // Trừ 0.5 giúp giá trị thành từ -0.5 đến +0.5 (âm nghĩa là trôi sang trái/lên trên, dương là trôi sang phải/xuống dưới)
        // Nhân 1.5 để tăng dải tốc độ lên khoảng [-0.75px, +0.75px] mỗi khung hình
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;

        // + Xử lý trường hợp vận tốc quá chậm
        // - Tại sao cần đoạn này? Nếu Math.random() vô tình sinh ra vx = 0.01, quả cầu sẽ đứng gần như bất động
        // - Đoạn code kiểm tra nếu độ lớn tốc độ < 0.4, nó sẽ ép tốc độ tối thiểu lên 0.5 (hoặc -0.5 tùy ngẫu nhiên). Nhờ vậy quả cầu nào cũng trôi động nhẹ nhàng chứ không bị "băng hà" đứng yên
        if (Math.abs(this.vx) < 0.4) this.vx = 0.5 * (Math.random() > 0.5 ? 1 : -1);
        if (Math.abs(this.vy) < 0.4) this.vy = 0.5 * (Math.random() > 0.5 ? 1 : -1);

        // Tạo một góc pha (phase) ngẫu nhiên từ 0 đến 2π (0 đến 360 độ). Góc này dùng cho hàm nhấp nhô hình Sin (Math.sin), giúp các quả cầu không bị lắc bồng bềnh cùng một lúc mà mỗi quả có nhịp sóng riêng biệt
        this.phase = Math.random() * Math.PI * 2;

        // Đã được thu thập/người dùng click xem chưa ?
        this.isCollected = false;

        // Người dùng có đang rê chuột lên nó không ?
        this.isHovered = false;

        // Lắng nghe khi người dùng rê chuột vào (mouseenter), rê chuột ra (mouseleave) hoặc chạm ngón tay vào màn hình (touchstart)
        // Trong vòng lặp chạy hàm update(), nếu isHovered === true thì quả cầu sẽ đứng yên tạm thời, giúp người dùng dễ dàng bấm vào mà không bị tình trạng đang bấm thì quả cầu trôi mất tay
        this.element.addEventListener('mouseenter', () => { this.isHovered = true; });
        this.element.addEventListener('mouseleave', () => { this.isHovered = false; });
        this.element.addEventListener('touchstart', () => { this.isHovered = true; }, { passive: true });

        // Bắt sự kiện khi người dùng click vào quả cầu:
        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.index !== null && this.index !== undefined) {
                // Gọi hàm mở hộp thoại Pop-up (modal) để hiển thị chi tiết bức ảnh/kỷ niệm của quả cầu thứ this.index
                openMemoryModal(this.index);
            }
        });

        // Chính thức chèn thẻ <div> quả cầu vào khung chứa floatingArea trên giao diện HTML thật. Bây giờ quả cầu đã xuất hiện trên màn hình
        floatingArea.appendChild(this.element);

        // Gọi ngay hàm vẽ vị trí để áp dụng tọa độ (X, Y) vừa tính ở trên lên thuộc tính CSS transform: translate3d(x, y, 0) giúp quả cầu nhảy ngay tới vị trí cần đứng
        this.updatePosition();
    }

    update() {
        if (this.isCollected) return;

        // Tạm dừng di chuyển khi rê chuột vào -> Mượt mà tuyệt đối
        if (!this.isHovered) {
            this.x += this.vx;
            this.y += this.vy;
            this.phase += 0.03;
        }

        const sinOffset = Math.sin(this.phase) * 0.5;

        // Bật nảy khi chạm mép màn hình
        const minY = 160; // Ngay dưới header
        const maxY = Math.max(minY + 50, window.innerHeight - 60);
        const minX = 15;
        const maxX = Math.max(minX + 50, window.innerWidth - this.element.offsetWidth - 15);

        if (this.x <= minX) { this.x = minX; this.vx *= -1; }
        if (this.x >= maxX) { this.x = maxX; this.vx *= -1; }
        if (this.y <= minY) { this.y = minY; this.vy *= -1; }
        if (this.y >= maxY) { this.y = maxY; this.vy *= -1; }

        this.updatePosition(sinOffset);
    }

    // Hàm này chịu trách nhiệm vẽ (render) lại vị trí thực tế của quả cầu lên màn hình (DOM) dựa trên tọa độ (X, Y) và hiệu ứng nhấp nhô sóng Sin (sinOffset)
    updatePosition(sinOffset = 0) {
        // Tại sao dùng translate3d(...) mà không dùng top/left? Dùng translate3d giúp trình duyệt kích hoạt tăng tốc phần cứng GPU. Khi quả cầu di chuyển liên tục 60fps/120fps,
        // GPU sẽ xử lý cực mượt mà không gây giật lag hay bắt trình duyệt phải tính toán lại bố cục toàn trang

        // transform thay đổi vị trí hiển thị của element mà không làm thay đổi layout của document, nên phù hợp cho animation/movement liên tục

        // Nếu sinOffset là một số hữu hạn (kể cả số âm), giữ nguyên giá trị.
        // Nếu không phải số hữu hạn như null, undefined, NaN, Infinity... thì dùng 0
        const validOffset = Number.isFinite(sinOffset) ? sinOffset : 0;
        this.element.style.transform = `translate3d(${this.x}px, ${this.y + validOffset}px, 0)`;
    }

    popExplode() {
        this.isCollected = true;
        createBurstParticles(this.x + 80, this.y + 20, 25, ['#ff4b8b', '#ff7eb3', '#ffd700', '#ffffff']);
        this.element.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        this.element.style.transform += ' scale(1.6)';
        this.element.style.opacity = '0';
        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 400);
    }
}

function initFloatingOrbs() {
    floatingArea.innerHTML = '';
    floatingOrbs = memoriesData.map((data, index) => new FloatingOrb(data, index));
    collectedCount = 0;
    updateTrackerUI();
}

function animateOrbs() {
    floatingOrbs.forEach(orb => orb.update());
    requestAnimationFrame(animateOrbs);
}

function updateTrackerUI() {
    document.getElementById('collectedCount').innerText = collectedCount;
    document.getElementById('totalCount').innerText = memoriesData.length;
    const pct = (collectedCount / memoriesData.length) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
}

// ==========================================
// 4. XỬ LÝ MODAL & THU THẬP KÝ ỨC
// ==========================================
function openMemoryModal(index) {
    activeMemoryIndex = index;
    const data = memoriesData[index];
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalImg').src = data.img;
    document.getElementById('modalText').innerText = data.text;
    document.getElementById('memoryModal').classList.add('active');
}

function closeMemoryModal() {
    document.getElementById('memoryModal').classList.remove('active');

    if (activeMemoryIndex !== null && floatingOrbs[activeMemoryIndex] && !floatingOrbs[activeMemoryIndex].isCollected) {
        const orb = floatingOrbs[activeMemoryIndex];
        orb.popExplode();
        collectedCount++;
        updateTrackerUI();

        // Nếu đã thu thập hết 5/5
        if (collectedCount >= memoriesData.length) {
            setTimeout(() => {
                showToast("✨ Tuyệt vời! Bạn đã mở khóa tất cả các mảnh ký ức! ✨");
                createConfetti();
                setTimeout(() => {
                    goToStage(2);
                }, 1800);
            }, 500);
        }
    }
    activeMemoryIndex = null;
}

// ==========================================
// 5. TRỨNG PHỤC SINH: BẤM 5 LẦN TRÁI TIM
// ==========================================
let heartClickCount = 0;
document.getElementById('secretHeart').addEventListener('click', () => {
    heartClickCount++;
    createBurstParticles(window.innerWidth / 2, 100, 15, ['#ff4b8b', '#ff7eb3']);
    if (heartClickCount === 5) {
        document.getElementById('modalTitle').innerText = "💌 Lời Nhắn Bí Mật Cực Lớn!";
        document.getElementById('modalImg').src = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80";
        document.getElementById('modalText').innerText = "Chúc mừng bạn đã tìm thấy Trứng Phục Sinh bí mật! Cảm ơn vì đã luôn ở bên cạnh, cùng nhau sẻ chia và yêu thương từng khoảnh khắc. Yêu bạn nhiều lắm! 💖✨";
        activeMemoryIndex = null; // Không tính thu thập orb
        document.getElementById('memoryModal').classList.add('active');
        heartClickCount = 0;
    }
});

// ==========================================
// 6. GIAI ĐOẠN 2: BÁNH KEM & THỔI NẾN INTERACTIVE
// ==========================================
let candlesBlown = [false, false, false];
let isCakeCut = false;

function blowCandleSingle(index) {
    if (candlesBlown[index]) return;
    candlesBlown[index] = true;
    document.querySelector(`.flame-${index}`).classList.add('extinguished');

    // Tọa độ nến tương ứng
    const candleCoords = [
        { x: 65, y: 14 }, { x: 100, y: 8 }, { x: 135, y: 14 }
    ];
    createSmokePuff(candleCoords[index].x, candleCoords[index].y);

    checkAllCandlesBlown();
}

function blowCandlesAll() {
    [0, 1, 2].forEach(i => blowCandleSingle(i));
}

function checkAllCandlesBlown() {
    if (candlesBlown.every(b => b)) {
        showToast("🌟 Ngọn nến đã tắt! Lời ước nguyện của bạn sẽ thành hiện thực! ✨");
        createConfetti();
        document.getElementById('btnBlow').innerText = "✨ Đã Thổi Nến & Ước";
        document.getElementById('btnBlow').disabled = true;
        checkUnlockVideo();
    }
}

function cutCake() {
    if (isCakeCut) return;
    isCakeCut = true;
    document.getElementById('cakeSvg').classList.add('cake-sliced');
    createBurstParticles(window.innerWidth / 2, window.innerHeight / 2, 40, ['#ff7eb3', '#ffd700', '#ffffff']);
    showToast("🍰 Cắt bánh thành công! Chúc mừng sinh nhật tràn ngập niềm vui! 🎉");
    document.getElementById('btnCut').innerText = "🍰 Đã Cắt Bánh";
    document.getElementById('btnCut').disabled = true;
    checkUnlockVideo();
}

function checkUnlockVideo() {
    if (candlesBlown.every(b => b) || isCakeCut) {
        const btnGoVideo = document.getElementById('btnGoVideo');
        btnGoVideo.style.display = 'flex';
        btnGoVideo.classList.add('pulse');
    }
}

function createSmokePuff(svgX, svgY) {
    const cakeBox = document.querySelector('.cake-container').getBoundingClientRect();
    const posX = cakeBox.left + (svgX / 200) * cakeBox.width;
    const posY = cakeBox.top + (svgY / 180) * cakeBox.height;

    for (let i = 0; i < 4; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.left = (posX + (Math.random() - 0.5) * 15) + 'px';
        smoke.style.top = posY + 'px';
        document.body.appendChild(smoke);
        setTimeout(() => smoke.remove(), 1500);
    }
}

// ==========================================
// 7. GIAI ĐOẠN 3 & CHUYỂN STAGE
// ==========================================
function goToStage(stageNum) {
    document.querySelectorAll('.stage').forEach(s => s.classList.remove('active'));
    document.getElementById(`stage-${stageNum}`).classList.add('active');

    if (stageNum === 3) {
        const video = document.getElementById('memoryVideo');
        video.play().catch(() => {
            // Autoplay restriction policy handle
        });
        createConfetti();
    } else {
        const video = document.getElementById('memoryVideo');
        if (video) video.pause();
        if (stageNum === 1 && collectedCount >= memoriesData.length) {
            initFloatingOrbs(); // Reset lại các quả cầu nếu về lại Stage 1
        }
    }
}

function sendHeartReaction() {
    createBurstParticles(window.innerWidth / 2, window.innerHeight - 100, 30, ['#ff4b8b', '#ff7eb3', '#ffffff']);
    showToast("💖 Đã gửi ngàn trái tim yêu thương!");
}

function replayVideo() {
    const video = document.getElementById('memoryVideo');
    video.currentTime = 0;
    video.play();
}

function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ==========================================
// 8. CANVAS PARTICLE SYSTEM (Pháo hoa, Sao & Tim)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 6 + 3;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.gravity = 0.15;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createBurstParticles(x, y, count = 20, colors = ['#ff4b8b', '#ffd700', '#ffffff']) {
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

function createConfetti() {
    const colors = ['#ff4b8b', '#ff7eb3', '#ffd700', '#60a5fa', '#a7f3d0', '#ffffff'];
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * canvas.width;
        const y = -10;
        const p = new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]);
        p.vy = Math.random() * 5 + 3;
        p.vx = (Math.random() - 0.5) * 4;
        p.gravity = 0.05;
        p.decay = 0.008;
        particles.push(p);
    }
}

function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(renderParticles);
}

// ==========================================
// 9. NỀN VŨ TRỤ SAO LẤP LÁNH
// ==========================================
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 45; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.width = Math.random() * 3 + 1 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    starsContainer.appendChild(star);
}

// KÍCH HOẠT KHỞI TẠO
window.addEventListener('DOMContentLoaded', () => {
    initFloatingOrbs();
    animateOrbs();
    renderParticles();
});