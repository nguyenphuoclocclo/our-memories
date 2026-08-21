// ==========================================
// 1. CẤU HÌNH THỜI GIAN BẮT ĐẦU YÊU
// ==========================================
const startDate = new Date(2023, 1, 14, 0, 0, 0);

const memoryModalEl = document.getElementById('memoryModal');
const modalTitleEl = document.getElementById('modalTitle');
const modalImgEl = document.getElementById('modalImg');
const modalTextEl = document.getElementById('modalText');
const btnBlowEl = document.getElementById('btnBlow');
const btnCutEl = document.getElementById('btnCut');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');


// ==========================================
// COMMON FUNCTION
function withTryCatch(fn, onError = undefined, shouldThrowError = false) {
    return function (...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            if (typeof onError === "function") {
                onError(error, args);
            }

            console.error(`❌ Error In Function [${fn.name || 'Anonymous'}]:`, error);

            if (shouldThrowError) throw error;
        }
    };
}


function isInvalidArray(targetArray, onInvalid, checkEmpty = true) {
    const isInvalid = !Array.isArray(targetArray) || (checkEmpty && targetArray.length === 0);

    if (isInvalid) {
        if (typeof onInvalid === 'function') {
            onInvalid(targetArray);
        } else {
            console.warn(`Lỗi: Mảng ${targetArray} không hợp lệ hoặc bị rỗng.`);
        }
    }

    return isInvalid;
}

function isInvalidIndexInArray(index, arrayLength, onInvalid) {
    const isInvalidType =
        index === null ||
        index === undefined ||
        typeof index === 'boolean' ||
        (typeof index === 'string' && index.trim() === '');

    const safeIndex = Number(index);

    const isInvalid =
        isInvalidType ||
        !Number.isInteger(safeIndex) ||
        isNaN(arrayLength) ||
        safeIndex < 0 ||
        safeIndex >= arrayLength;

    if (isInvalid) {
        if (typeof onInvalid === 'function') {
            onInvalid(index, safeIndex);
        } else {
            console.warn(`Lỗi: Index (${index}) không hợp lệ.`);
        }
    }

    return isInvalid;
}

function updateModalContent(data = null, options = {}) {
    if (!memoryModalEl) {
        console.error("Lỗi: Không tìm thấy phần tử DOM #memoryModal");
        return;
    }

    if (data && typeof data === 'object') {
        const { title = '', img = '', text = '' } = data ?? {};
        if (modalTitleEl) modalTitleEl.innerText = title;
        if (modalImgEl) modalImgEl.src = img;
        if (modalTextEl) modalTextEl.innerText = text;
    }

    const { className = 'active', action = null, active = null } = options;
    if (typeof active !== 'boolean' && !action) return;

    if (typeof active === 'boolean') {
        memoryModalEl.classList.toggle(className, active);
    } else if (action === 'add') {
        memoryModalEl.classList.add(className);
    } else if (action === 'remove') {
        memoryModalEl.classList.remove(className);
    } else if (action === 'toggle') {
        memoryModalEl.classList.toggle(className);
    }
}
// ==========================================

const updateTimer = withTryCatch(
    function updateTimer() {
        if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) return;

        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }
);
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
        this.element.innerHTML = `<div class="orb-inner">${data.icon} ${data.label}</div>`;

        // Vị trí xuất phát ngẫu nhiên
        const padding = 60; // Lùi vào 60px từ các mép màn hình (để quả cầu không bị mép màn hình che mất)
        const headerOffset = 220; // Chừa lại 220px tính từ đỉnh màn hình xuống (tránh việc quả cầu xuất hiện đè lên thanh Tiêu đề / Header của trang web)

        // Kích thước ước tính của quả cầu
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
                openMemoryModal(this.index);
            }
        });

        floatingArea.appendChild(this.element);

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
        const validOffset = Number.isFinite(sinOffset) ? sinOffset : 0;
        this.element.style.transform = `translate3d(${this.x}px, ${this.y + validOffset}px, 0)`;
    }

    // Hàm này xử lý hiệu ứng quả cầu nổ tung (pháo hoa hạt, phóng to, mờ dần) và tự xóa khỏi giao diện (DOM) khi được thu thập
    popExplode() {
        // Nếu quả cầu đã bị nổ/thu thập trước đó hoặc phần tử không tồn tại thì không thực thi gì cả
        if (this.isCollected || !this.element) return;

        this.isCollected = true;

        // Chặn tương tác chuột ngay lập tức trong 0.4s diễn ra hiệu ứng nổ
        this.element.style.pointerEvents = 'none';

        // Tạo hiệu ứng hạt nổ
        createBurstParticles?.(this.x + 80, this.y + 20, 25, ['#ff4b8b', '#ff7eb3', '#ffd700', '#ffffff']);

        // Thiết lập hiệu ứng CSS biến mất mượt mà
        this.element.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

        // Đảm bảo không bị nối scale(1.6) trùng lặp nhiều lần
        if (!this.element.style.transform.includes('scale')) {
            this.element.style.transform += ' scale(1.6)';
        }
        this.element.style.opacity = '0';

        // Xóa khỏi DOM sau khi hiệu ứng 0.4s kết thúc
        setTimeout(() => {
            if (this.element && typeof this.element.remove === 'function') {
                this.element.remove();
            }
            else if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 400);
    }
}

// Khởi tạo (hoặc reset làm mới) toàn bộ các quả cầu lơ lửng trên trang web
function initFloatingOrbs() {
    if (!floatingArea) {
        console.error("Lỗi: Không tìm thấy phần tử #floating-area trong DOM!");
        return;
    }

    if (isInvalidArray(
        memoriesData,
        () => {
            floatingArea.innerHTML = '';
            floatingOrbs = [];
            collectedCount = 0;
            updateTrackerUI();
        }
    )) {
        return;
    }


    floatingArea.innerHTML = '';

    floatingOrbs = memoriesData?.filter(data => data && typeof data === 'object').map((data, index) => new FloatingOrb(data, index));

    collectedCount = 0;

    updateTrackerUI();
}

let orbAnimationId = null;
let isOrbAnimating = false;

const startAnimateOrbs = withTryCatch(
    function startAnimateOrbs() {
        if (!isOrbAnimating) {
            isOrbAnimating = true;
            animateOrbs();
        }
    }
);

const stopAnimateOrbs = withTryCatch(
    function stopAnimateOrbs() {
        if (orbAnimationId) {
            cancelAnimationFrame(orbAnimationId);
            orbAnimationId = null;
        }

        isOrbAnimating = false;
    }
);

// animateOrbs là vòng lặp hoạt họa (Animation Loop) chịu trách nhiệm cập nhật chuyển động liên tục (60fps+) cho tất cả các quả cầu lơ lửng (floatingOrbs) trên giao diện web
const animateOrbs = withTryCatch(
    function animateOrbs() {
        if (isInvalidArray(floatingOrbs, stopAnimateOrbs)) return;

        floatingOrbs.forEach(orb => {
            if (orb) {
                orb?.update();
            }
        });

        orbAnimationId = requestAnimationFrame(animateOrbs);
    }
);

// Hàm này là cập nhật con số và thanh phần trăm tiến độ thu thập ký ức hiển thị trên giao diện người dùng (UI)
const updateTrackerUI = withTryCatch(
    function updateTrackerUI() {
        const collectedCountEl = document.getElementById('collectedCount');
        const totalCountEl = document.getElementById('totalCount');
        const progressFillEl = document.getElementById('progressFill');

        const total = (Array.isArray(memoriesData) && memoriesData.length > 0) ? memoriesData.length : 0;

        const safeCollected = Math.max(0, Number(collectedCount) || 0);

        if (collectedCountEl) collectedCountEl.innerText = safeCollected;
        if (totalCountEl) totalCountEl.innerText = total;

        let pct = 0;
        if (total > 0) {
            const rawPct = (safeCollected / total) * 100;
            pct = Math.min(100, Math.max(0, rawPct));
        }

        if (progressFillEl) {
            progressFillEl.style.width = `${pct}%`;
        }
    }
);

// ==========================================
// 4. XỬ LÝ MODAL & THU THẬP KÝ ỨC
// ==========================================
// Hàm mở Modal xem nội dung chi tiết mảnh ký ức
const openMemoryModal = withTryCatch(
    function openMemoryModal(index) {
        if (isInvalidArray(memoriesData)) return;

        if (isInvalidIndexInArray(index, memoriesData.length)) return;

        const safeIndex = Number(index);
        const data = memoriesData[safeIndex];
        if (!data || typeof data !== 'object') return;

        updateModalContent(data);

        // Cập nhật chỉ số ký ức đang xem để hàm closeMemoryModal xử lý nổ quả cầu
        activeMemoryIndex = safeIndex;

        memoryModalEl.classList.add('active');
    }
);

let stageTransitionTimer = null;

function cancelStageTransition() {
    if (stageTransitionTimer !== null) {
        clearTimeout(stageTransitionTimer);
        stageTransitionTimer = null;
    }
}

// Hàm đóng Modal xem nội dung chi tiết mảnh ký ức
const closeMemoryModal = withTryCatch(
    function closeMemoryModal() {
        updateModalContent(null, { action: 'remove' });

        // Lưu chỉ số hiện tại và reset activeMemoryIndex ngay để chống click trùng / gọi hàm lặp lại
        const currentIndex = activeMemoryIndex;
        activeMemoryIndex = null;

        if (isInvalidIndexInArray(currentIndex, floatingOrbs?.length || 0)) return;

        const orb = floatingOrbs[currentIndex];
        // Chỉ xử lý nếu quả cầu tồn tại và chưa được thu thập
        if (orb && !orb.isCollected) {
            orb.popExplode?.();
            collectedCount++;
            updateTrackerUI?.();

            // Nếu đã thu thập hết tất cả mảnh ký ức
            if (collectedCount >= memoriesData.length) {
                // Hủy bất kỳ timer nào đang chạy dở dở trước đó
                cancelStageTransition();

                stageTransitionTimer = setTimeout(() => {
                    showToast("✨ Tuyệt vời! Bạn đã mở khóa tất cả các mảnh ký ức! ✨");
                    createConfetti();

                    stageTransitionTimer = setTimeout(() => {
                        goToStage(2);
                        stageTransitionTimer = null;
                    }, 1800);
                }, 500);
            }
        }
    },
    () => { activeMemoryIndex = null; }
);

// ==========================================
// 5. TRỨNG PHỤC SINH: BẤM 5 LẦN TRÁI TIM
// ==========================================
let heartClickCount = 0;

const secretHeartEl = document.getElementById('secretHeart');
if (secretHeartEl) {
    // Khi người dùng nhấp 5 lần liên tiếp vào biểu tượng trái tim bí mật, ứng dụng sẽ tạo hiệu ứng bắn hạt pháo hoa hồng và mở một Modal chứa thông điệp đặc biệt
    secretHeartEl.addEventListener('click', () => {
        // Nếu Modal đã được hiển thị rồi thì không thực thi nữa
        if (memoryModalEl && memoryModalEl.classList.contains('active')) return;

        heartClickCount++;

        const clickX = e.clientX || window.innerWidth / 2;
        const clickY = e.clientY || 100;

        // Bắn hạt ngay tại vị trí con trỏ chuột/ngón tay click
        createBurstParticles?.(
            clickX,
            clickY,
            15,
            ['#ff4b8b', '#ff7eb3']
        );

        const data = {
            title: "💌 Lời Nhắn Bí Mật Cực Lớn!",
            img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
            text: "Chúc mừng bạn đã tìm thấy Trứng Phục Sinh bí mật! Cảm ơn vì đã luôn ở bên cạnh, cùng nhau sẻ chia và yêu thương từng khoảnh khắc. Yêu bạn nhiều lắm! 💖✨"
        };

        if (heartClickCount === 5) {
            updateModalContent?.(data, { action: "add" });
            activeMemoryIndex = null; // Không tính thu thập orb
            heartClickCount = 0;
        }
    });
}

// ==========================================
// 6. GIAI ĐOẠN 2: BÁNH KEM & THỔI NẾN INTERACTIVE
// ==========================================
// Biến candlesBlown: Là một mảng lưu trạng thái của 3 ngọn nến, mặc định khởi tạo là [false, false, false]
// - false: Ngọn nến đang cháy
// - true: Ngọn nến đã bị thổi tắt
let candlesBlown = [false, false, false];

// Cờ đánh dấu đã hoàn thành cắt bánh
let isCakeCut = false;

// Cờ đánh dấu đã hoàn thành thổi nến
let isAllCandlesBlown = false;

const blowCandleSingle = withTryCatch(
    function blowCandleSingle(index) {
        if (isInvalidArray(candlesBlown)) return;

        if (isInvalidIndexInArray(index, candlesBlown.length)) return;

        // Nếu nến này đã tắt rồi thì không xử lý lại
        if (candlesBlown[index]) return;

        // Đánh dấu nến đã bị thổi tắt
        candlesBlown[index] = true;

        const flameItem = document.querySelector(`.flame-${index}`);

        // Ẩn/dập ngọn lửa
        if (flameItem) flameItem.classList.add('extinguished');

        // Tọa độ tương ứng của 3 ngọn nến
        const candleCoords = [
            { x: 65, y: 14 },
            { x: 100, y: 8 },
            { x: 135, y: 14 }
        ];

        const targetCoord = candleCoords[index];
        if (targetCoord) {
            // Tạo hiệu ứng khói tại đúng đỉnh ngọn nến vừa tắt
            createSmokePuff?.(targetCoord.x, targetCoord.y);
        }

        checkAllCandlesBlown?.();
    }
);

const blowCandlesAll = withTryCatch(
    // Hàm này dùng để dập tắt tất cả 3 ngọn nến trên bánh sinh nhật cùng một lúc
    function blowCandlesAll() {
        if (isAllCandlesBlown) return;

        if (isInvalidArray(candlesBlown)) return;

        candlesBlown.forEach((_, index) => blowCandleSingle(index));
    }
);

// - Kiểm tra xem tất cả các ngọn nến trên chiếc bánh sinh nhật đã được thổi tắt hết hay chưa
// - Khi toàn bộ nến đã tắt, hàm sẽ tự động kích hoạt chuỗi hiệu ứng ăn mừng (thông báo lời chúc, bắn hiệu ứng pháo hoa/kim tuyến), khóa nút thổi nến để tránh bấm lại, và gửi tín hiệu kiểm tra xem người dùng đã đủ điều kiện mở khóa video kỷ niệm hay chưa
const checkAllCandlesBlown = withTryCatch(
    function checkAllCandlesBlown() {
        // Nếu đã hoàn thành thổi nến rồi thì không chạy lại (tránh trùng lặp hiệu ứng)
        if (isAllCandlesBlown) return;

        if (isInvalidArray(candlesBlown)) return;

        if (candlesBlown.every(b => b)) {
            isAllCandlesBlown = true;

            showToast("🌟 Ngọn nến đã tắt! Lời ước nguyện của bạn sẽ thành hiện thực! ✨");

            // Gọi hàm tạo hiệu ứng kim tuyến/pháo hoa nổ tung tóe đầy màu sắc rơi khắp màn hình để tạo cảm giác bất ngờ và phấn khích
            createConfetti?.();

            if (btnBlowEl) {
                btnBlowEl.innerText = "✨ Đã Thổi Nến & Ước";
                btnBlowEl.disabled = true;
            }

            checkUnlockVideo?.();
        }
    }
);

const cutCake = withTryCatch(
    function cutCake() {
        // Nếu đã hoàn thành cắt bánh rồi thì không chạy lại (tránh trùng lặp hiệu ứng)
        if (isCakeCut) return;

        isCakeCut = true;

        const cakeSvgEl = document.getElementById('cakeSvg')

        if (cakeSvgEl) cakeSvgEl.classList.add('cake-sliced');

        createBurstParticles?.(
            window.innerWidth / 2,
            window.innerHeight / 2,
            40,
            ['#ff7eb3', '#ffd700', '#ffffff']
        );

        showToast("🍰 Cắt bánh thành công! Chúc mừng sinh nhật tràn ngập niềm vui! 🎉");

        if (btnCutEl) {
            btnCutEl.innerText = "🍰 Đã Cắt Bánh";
            btnCutEl.disabled = true;
        }

        checkUnlockVideo?.();
    }
);

const checkUnlockVideo = withTryCatch(
    function checkUnlockVideo() {
        // Đảm bảo người dùng đã thổi tắt tất cả 3 ngọn nến sinh nhật và đã nhấn cắt bánh sinh nhật
        if (isAllCandlesBlown && isCakeCut) {
            const btnGoVideo = document.getElementById('btnGoVideo');
            if (btnGoVideo) {
                btnGoVideo.style.display = 'flex';
                btnGoVideo.classList.add('pulse');
            }
        }
    }
);

const createSmokePuff = withTryCatch(
    // Hàm này dùng để tạo hiệu ứng các làn khói mờ bốc lên tại vị trí đầu ngọn nến khi nến trên chiếc bánh sinh nhật bị thổi tắt
    function createSmokePuff(svgX, svgY) {
        const cakeContainer = document.querySelector('.cake-container');
        if (!cakeContainer) return;

        const cakeBox = cakeContainer.getBoundingClientRect();
        if (!cakeBox) return;

        if (typeof svgX !== 'number' || typeof svgY !== 'number' || Number.isNaN(svgX) || Number.isNaN(svgY)) return;

        // Ngọn nến có tọa độ (svgX, svgY) nằm trong khung vẽ đồ họa SVG có kích thước cố định là 200 x 180. Nhưng hạt khói lại là một thẻ HTML được dán trực tiếp lên toàn bộ màn hình

        // Cách tính quy đổi (posX) (Áp dụng tương tự cho posY)
        // - 1) (svgX / 200): Tính xem ngọn nến chiếm bao nhiêu % chiều rộng của khung SVG
        // - 2) * cakeBox.width: Nhân % đó với chiều rộng thực tế của chiếc bánh trên màn hình
        // - 3) + cakeBox.left: Cộng thêm khoảng cách từ mép trái màn hình đến chiếc bánh

        // Ví dụ dễ hiểu: Giả sử chiếc bánh SVG có chiều rộng cố định là 200. Ngọn nến nằm ở vị trí svgX = 100 (đúng chính giữa chiếc bánh). Khi hiển thị trên điện thoại, chiếc bánh phóng to ra rộng 400px và nằm cách mép trái màn hình 20px:
        // - Tỷ lệ: 100 / 200 = 0.5 (nằm ở 50% chiếc bánh).
        // - Vị trí ngọn nến trên điện thoại: 20 + (0.5 * 400) = 220px
        const posX = cakeBox.left + (svgX / 200) * cakeBox.width;
        const posY = cakeBox.top + (svgY / 180) * cakeBox.height;

        for (let i = 0; i < 4; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';

            // Giúp 4 hạt khói không bị chồng khít lên nhau tại 1 điểm duy nhất, mà bị lệch nhẹ sang trái/phải ngẫu nhiên xung quanh ngọn nến
            smoke.style.left = (posX + (Math.random() - 0.5) * 15) + 'px';

            smoke.style.top = posY + 'px';
            document.body.appendChild(smoke);

            setTimeout(() => smoke.remove(), 1500);
        }
    }
);

// ==========================================
// 7. GIAI ĐOẠN 3 & CHUYỂN STAGE
// ==========================================
function goToStage(stageNum) {
    // Hủy các timer chuyển stage đang đếm ngược ngầm nếu người dùng chủ động chuyển stage
    cancelStageTransition();

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

let lastReactionTime = 0;

const sendHeartReaction = withTryCatch(
    function sendHeartReaction() {
        const now = Date.now();

        // Nếu thời gian giữa 2 lần bấm < 150ms thì bỏ qua
        if (now - lastReactionTime < 150) return;
        lastReactionTime = now;

        // Tọa độ X (window.innerWidth / 2): Phát ra hạt từ chính giữa màn hình theo chiều ngang
        // Tọa độ Y (window.innerHeight - 100): Phát ra hạt tại vị trí cách mép dưới màn hình 100px (ngay khu vực người dùng vừa bấm nút Thả tim)

        createBurstParticles(window.innerWidth / 2, window.innerHeight - 100, 30, ['#ff4b8b', '#ff7eb3', '#ffffff']);
        showToast("💖 Đã gửi ngàn trái tim yêu thương!");
    }
);

const replayVideo = withTryCatch(
    function replayVideo() {
        const video = document.getElementById('memoryVideo');
        if (!video || !(video instanceof HTMLMediaElement)) return;

        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined && playPromise !== null) {
            playPromise.catch(error => console.warn('[replayVideo] Không thể tự động phát lại video:', error.name, error.message));
        }
    }
)

let toastTimerId = null;

const showToast = withTryCatch(
    function showToast(msg) {
        const toast = document.getElementById('toastMsg');
        if (!toast) return;

        if (msg === null || msg === undefined) {
            msg = '';
        } else if (typeof msg !== 'string') {
            msg = String(msg);
        }

        // Limit maximum length to prevent UI overflow
        const MAX_LENGTH = 300;
        if (msg.length > MAX_LENGTH) {
            msg = msg.substring(0, MAX_LENGTH) + '...';
        }

        // Use textContent to prevent HTML/XSS injection
        toast.textContent = msg;
        toast.classList.add('show');

        if (toastTimerId) clearTimeout(toastTimerId);

        toastTimerId = setTimeout(() => {
            toast.classList.remove('show');
            toastTimerId = null;
        }, 3500);
    }
)

// ==========================================
// 8. CANVAS PARTICLE SYSTEM (Pháo hoa, Sao & Tim)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];

const resizeCanvas = withTryCatch(
    function resizeCanvas() {
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
);

if (canvas) {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}

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

// Hàm này có nhiệm vụ tạo ra một hiệu ứng bùng nổ hạt (Particle Burst / Explosion Effect) tại một vị trí tọa độ (x, y) xác định trên màn hình (HTML5 Canvas)
// Mỗi khi hàm này được gọi (ví dụ: khi người dùng nhấp chuột, hoàn thành nhiệm vụ, mở hiệu ứng chúc mừng...), nó sẽ sinh ra một loạt các hạt nhỏ với màu sắc ngẫu nhiên và thêm chúng vào mảng quản lý hạt particles
function createBurstParticles(x, y, count = 20, colors = ['#ff4b8b', '#ffd700', '#ffffff']) {
    if (!Array.isArray(particles)) return;

    if (typeof x !== 'number' || typeof y !== 'number' || Number.isNaN(x) || Number.isNaN(y)) return;

    if (isInvalidArray(colors)) return;

    // GIỚI HẠN TỐI ĐA để tránh lag
    const safeCount = Math.min(Math.max(0, Math.floor(count) || 0), 100);
    if (safeCount <= 0) return;

    for (let i = 0; i < safeCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        // Mỗi hạt khi khởi tạo sẽ tự gán cho mình một vận tốc ngẫu nhiên vx (ngang) và vy (dọc) để khi vẽ ra, các hạt sẽ bay tỏa ra mọi hướng tạo thành hiệu ứng "bùng nổ" (burst)
        particles.push(new Particle(x, y, color));
    }
}

// Hàm này có nhiệm vụ tạo ra một cơn mưa hoa giấy/pháo giấy (Confetti Burst) bao gồm 80 mảnh pháo giấy với nhiều màu sắc rực rỡ, xuất hiện ngẫu nhiên ở phía trên cùng màn hình và bồng bềnh rơi xuống dưới
const createConfetti = withTryCatch(
    function createConfetti() {
        if (!canvas || !ctx || isInvalidArray(particles, undefined, false)) return;

        if (particles.length > 400) return;

        const colors = ['#ff4b8b', '#ff7eb3', '#ffd700', '#60a5fa', '#a7f3d0', '#ffffff'];
        const width = canvas.width || window.innerWidth;

        for (let i = 0; i < 80; i++) {
            // Tọa độ X ngẫu nhiên trải dài toàn màn hình
            const x = Math.random() * width;

            // Tọa độ Y bắt đầu ẩn ở phía trên đỉnh màn hình (10px bên ngoài viewport)
            // Các hạt bắt đầu ở vị trí bên ngoài tầm mắt phía trên màn hình. Khi rơi xuống, người dùng sẽ thấy hoa giấy xuất hiện tự nhiên từ trên trời rơi xuống chứ không đột ngột hiện ra giữa màn hình
            const y = -10;

            const p = new Particle(
                x,
                y,
                colors[Math.floor(Math.random() * colors.length)]
            );

            // Gán các thông số vật lý tùy chỉnh cho hiệu ứng pháo giấy rơi

            // - Vận tốc rơi xuống theo trục dọc từ 3px đến 8px/frame
            // - Giá trị vy dương giúp hạt ngay lập tức rơi xuống dưới
            // - Hạt rơi nhanh, hạt rơi chậm tạo nên chiều sâu chuyển động
            p.vy = Math.random() * 5 + 3;

            // - Vận tốc dạt ngang từ -2px đến +2px/frame
            // - Nếu vx < 0: Hạt sẽ bị dạt sang trái
            // - Nếu vx > 0: Hạt sẽ bị dạt sang phải
            // - Giúp hoa giấy rơi theo đường chéo nghiêng nhẹ tự nhiên như có gió thổi
            p.vx = (Math.random() - 0.5) * 4;

            // - Trọng lực siêu nhẹ (giúp bồng bềnh)
            // - Giảm gia tốc rơi, giúp mảnh giấy rơi bồng bềnh, chầm chậm đúng chất pháo giấy nhẹ thay vì rơi như đá chìm
            p.gravity = 0.05;

            // - Tốc độ mờ dần rất chậm (~2 giây mới biến mất)
            // - Độ mờ alpha bắt đầu từ 1.0
            // - Mỗi khung hình (frame), alpha giảm đi 0.008
            // - Ở 60fps, hạt sẽ tồn tại trong khoảng 2.08 giây, vừa đủ thời gian để hoa giấy rơi từ đỉnh màn hình xuống gần đáy màn hình trước khi tan biến
            p.decay = 0.008;

            particles.push(p);
        }
    }
);

let particleAnimationFrameId = null;

const renderParticles = withTryCatch(
    function renderParticles() {
        if (!ctx || !canvas) return;

        // Xóa toàn bộ nội dung của Canvas ở khung hình (frame) cũ
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Lỗi bỏ sót phần tử (Skipping Element Bug) khi dùng splice trong forEach. Khi bạn xóa phần tử ở chỉ số index bằng splice(index, 1), các phần tử phía sau sẽ bị dồn lên trước (chỉ số của chúng giảm đi 1).
        // Tuy nhiên, vòng lặp forEach vẫn sẽ chuyển sang chỉ số tiếp theo index + 1. Kết quả là phần tử nằm ngay sau phần tử vừa bị xóa sẽ bị bỏ qua (không được update() và draw() ở khung hình đó), dẫn đến hiện tượng hạt bị giật hoặc nhấp nháy

        // Duyệt ngược từ cuối mảng về đầu mảng để an toàn khi splice (Để khi xóa phần tử ở cuối mảng, chỉ số của các phần tử phía trước không bị xáo trộn)
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            if (!p || typeof p.update !== 'function' || typeof p.draw !== 'function') {
                particles.splice(i, 1);
                continue;
            }

            p.update();
            p.draw();

            // Nếu hạt đã mờ hoàn toàn xóa hạt khỏi mảng
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        if (particles?.length > 0) {
            particleAnimationFrameId = requestAnimationFrame(renderParticles);
        }
    }
);

const stopParticles = withTryCatch(
    function stopParticles() {
        if (particleAnimationFrameId) {
            cancelAnimationFrame(particleAnimationFrameId);
            particleAnimationFrameId = null;
        }
    }
);

// ==========================================
// 9. NỀN VŨ TRỤ SAO LẤP LÁNH
// ==========================================
const starsContainer = document.getElementById('stars-container');
if (starsContainer) {
    // Đoạn code này tạo hiệu ứng "Nền vũ trụ sao lấp lánh"
    for (let i = 0; i < 45; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;

        // Đặt vị trí của ngôi sao theo trục nằm ngang (X), rải đều ngẫu nhiên từ mép cực trái đến mép cực phải
        star.style.left = Math.random() * 100 + '%';

        // Đặt vị trí của ngôi sao theo trục dọc (Y), rải đều ngẫu nhiên từ đỉnh trên cùng xuống đáy dưới cùng
        star.style.top = Math.random() * 100 + '%';

        // Giúp các ngôi sao nhấp nháy lệch pha nhau (sao mờ nhanh, sao mờ chậm), tránh hiện tượng tất cả 45 ngôi sao cùng sáng/tối đồng loạt nhìn rất đơ
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';

        starsContainer.appendChild(star);
    }
}

// KÍCH HOẠT KHỞI TẠO
window.addEventListener('DOMContentLoaded', () => {
    initFloatingOrbs();
    startAnimateOrbs();
    renderParticles();
});