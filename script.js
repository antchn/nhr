// Mock Data cho Leaderboard
const initialLeaderboardData = {
    '5k': [
        { name: "Nguyễn Văn Dũng", time: "00:18:30", pace: "3:42" },
        { name: "Nguyễn Thị Oanh", time: "00:19:15", pace: "3:51" },
        { name: "Bùi Minh Cường", time: "00:20:00", pace: "4:00" },
        { name: "Nguyễn Văn Hoàn", time: "00:21:10", pace: "4:14" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Như Trường", time: "00:23:05", pace: "4:30" },
        { name: "Nguyễn Văn Đại", time: "00:22:05", pace: "4:25" },
        { name: "Nguyễn Đăng Chung", time: "00:22:05", pace: "4:25" }
    ],
    '10k': [
        { name: "Nguyễn Như Ngọc", time: "00:38:45", pace: "3:52" },
        { name: "Nguyễn Hoàng Dương", time: "00:40:12", pace: "4:01" },
        { name: "Nguyễn Tất Hùng", time: "00:42:30", pace: "4:15" },
        { name: "Nguyễn Văn Thoại", time: "00:44:00", pace: "4:24" },
        { name: "Nguyễn Ngọc Tuấn", time: "00:45:10", pace: "4:31" }
    ],
    'hm': [ // Half Marathon 21.1km
        { name: "Bùi Minh Trường", time: "01:25:30", pace: "4:03" },
        { name: "Bạch Văn Huân", time: "01:28:15", pace: "4:11" },
        { name: "Nguyễn Văn Tú", time: "01:31:00", pace: "4:19" },
        { name: "Nguyễn Văn Quân", time: "01:35:45", pace: "4:32" },
        { name: "Nguyễn Văn Thắng", time: "01:38:20", pace: "4:40" }
    ],
    'fm': [ // Full Marathon 42.195km
        { name: "Bùi Minh Trường", time: "02:55:10", pace: "4:09" },
        { name: "Bạch Văn Huân", time: "02:59:45", pace: "4:16" },
        { name: "Nguyễn Văn Tú", time: "03:15:30", pace: "4:38" },
        { name: "Nguyễn Văn Quân", time: "03:22:15", pace: "4:48" },
        { name: "Nguyễn Văn Thắng", time: "03:28:00", pace: "4:56" }

    ]
};

// Mock Data cho Sự kiện
const initialEventsData = [
    {
        title: "Lễ Hội Chạy Bộ Mùa Xuân 2026",
        image: "assets/nhr_gallery.png",
        info1: "📅 Thời gian: 15/05/2026",
        info2: "📍 Địa điểm: Khu di tích Ninh Hiệp",
        info3: "🏃 Cự ly: 5K, 10K, Half Marathon",
        status: "active", // active (Sắp diễn ra), opening (Đang mở đăng ký), ended (Đã kết thúc)
        link: "#"
    },
    {
        title: "Ninh Hiệp Ekiden Challenge 2026",
        image: "assets/nhr_gallery.png",
        info1: "📅 Thời gian: 25/08/2026",
        info2: "📍 Địa điểm: Công viên Trung Tâm",
        info3: "🏃 Thể thức: Chạy tiếp sức đội 4 người",
        status: "opening",
        link: "#"
    },
    {
        title: "Giải Chạy Kỷ Niệm 5 Năm Thành Lập CLB",
        image: "assets/nhr_hero.jfif",
        info1: "📅 Thời gian: 10/12/2025",
        info2: "📍 Địa điểm: Quảng trường chính",
        info3: "🏃 300+ VĐV tham dự",
        status: "ended",
        link: "#"
    }
];

// Khởi tạo hoặc lấy dữ liệu từ localStorage
let leaderboardData = JSON.parse(localStorage.getItem('ninhHiepRunners_Data'));
if (!leaderboardData) {
    leaderboardData = initialLeaderboardData;
    localStorage.setItem('ninhHiepRunners_Data', JSON.stringify(leaderboardData));
}

let eventsData = JSON.parse(localStorage.getItem('ninhHiepRunners_Events'));
if (!eventsData) {
    eventsData = initialEventsData;
    localStorage.setItem('ninhHiepRunners_Events', JSON.stringify(eventsData));
}

// Hàm Render Sự kiện trên events.html
function renderEventsPage() {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = '';

    eventsData.forEach(event => {
        const badgeText = event.status === 'active' ? 'Sắp diễn ra' : (event.status === 'opening' ? 'Đang mở đăng ký' : 'Đã kết thúc');
        const badgeClass = event.status === 'active' ? 'badge-active' : (event.status === 'opening' ? 'badge-opening' : 'badge-ended');
        const btnClass = event.status === 'ended' ? 'btn-glass' : 'btn-outline-gold';
        const btnText = event.status === 'ended' ? 'Xem lại khoảnh khắc' : 'Chi tiết & Đăng ký';

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
                <div class="event-badge ${badgeClass}">${badgeText}</div>
            </div>
            <div class="event-content">
                <h3>${event.title}</h3>
                <div class="event-info">
                    <p>${event.info1}</p>
                    <p>${event.info2}</p>
                    <p>${event.info3}</p>
                </div>
                <a href="${event.link}" class="btn ${btnClass}" style="width: 100%; margin-top: 16px; text-align: center; display: inline-block;">${btnText}</a>
            </div>
        `;
        eventsGrid.appendChild(card);
    });
}

// Hàm Render Leaderboard
const leaderboardList = document.getElementById('leaderboard-list');
const tabs = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('runner-search');
let currentDistance = 'hm';

function renderLeaderboard(distance, searchTerm = '') {
    if (!leaderboardList) return;
    const data = leaderboardData[distance];
    leaderboardList.innerHTML = ''; // Xóa dữ liệu cũ

    // Sắp xếp tự động theo thành tích từ thấp đến cao (thời gian ngắn nhất xếp trên)
    const sortedData = [...data].sort((a, b) => a.time.localeCompare(b.time));

    // Gán hạng ban đầu trước khi filter
    const mappedData = sortedData.map((runner, index) => ({
        ...runner,
        rank: index + 1
    }));

    // Lọc theo từ khóa tìm kiếm
    const filteredData = mappedData.filter(runner =>
        runner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredData.length === 0) {
        leaderboardList.innerHTML = '<div style="padding: 24px; text-align: center; grid-column: 1 / -1; color: var(--color-text-muted);">Không tìm thấy runner nào phù hợp.</div>';
        return;
    }

    filteredData.forEach((runner, index) => {
        const row = document.createElement('div');
        row.className = `lb-row top-${runner.rank}`;

        // Tạo avatar từ 2 chữ cái đầu hoặc dùng ảnh đã tải lên
        const initials = runner.name.substring(0, 2).toUpperCase();
        const avatarContent = runner.avatar 
            ? `<img src="${runner.avatar}" alt="${runner.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
            : `${initials}`;

        row.innerHTML = `
            <div class="rank">#${runner.rank}</div>
            <div class="runner-name" onclick="openRunnerProfile('${runner.name.replace(/'/g, "\\'")}')">
                <div class="avatar">${avatarContent}</div>
                ${runner.name}
            </div>
            <div class="runner-time">${runner.time}</div>
            <div class="runner-pace">${runner.pace}</div>
        `;

        // Thêm animation delay cho từng row
        row.style.animationDelay = `${index * 0.1}s`;

        leaderboardList.appendChild(row);
    });
}

// Lắng nghe sự kiện chuyển Tab
if (tabs) {
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            e.target.classList.add('active');

            // Render data based on tab
            currentDistance = e.target.getAttribute('data-tab');
            renderLeaderboard(currentDistance, searchInput ? searchInput.value : '');
        });
    });
}

// Lắng nghe sự kiện tìm kiếm
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderLeaderboard(currentDistance, e.target.value);
    });
}

// Profile Modal Logic
const runnerProfileModal = document.getElementById('runnerProfileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModal');
const profileAvatarDisplay = document.getElementById('profile-avatar-display');
const profileNameDisplay = document.getElementById('profile-name');
const profileStatsGrid = document.getElementById('profile-stats-grid');

const distanceNames = {
    '5k': '5K',
    '10k': '10K',
    'hm': 'Half Marathon',
    'fm': 'Full Marathon'
};

window.openRunnerProfile = function(runnerName) {
    if (!runnerProfileModal) return;

    // Collect runner data across all distances
    let runnerAvatar = null;
    let statsHTML = '';
    let hasStats = false;

    // Ordered distances
    const distKeys = ['5k', '10k', 'hm', 'fm'];

    distKeys.forEach(key => {
        const records = leaderboardData[key];
        if (records) {
            const runnerData = records.find(r => r.name === runnerName);
            if (runnerData) {
                // Get avatar if we haven't found one yet
                if (!runnerAvatar && runnerData.avatar) {
                    runnerAvatar = runnerData.avatar;
                }
                
                // Build stat card
                hasStats = true;
                statsHTML += `
                    <div class="stat-item">
                        <div class="stat-dist">${distanceNames[key]}</div>
                        <div class="stat-time">${runnerData.time}</div>
                        <div class="stat-pace">Pace: ${runnerData.pace}</div>
                    </div>
                `;
            }
        }
    });

    if (!hasStats) {
        statsHTML = `<div style="grid-column: 1 / -1; color: var(--color-text-muted);">Chưa có thành tích ghi nhận.</div>`;
    }

    // Set Name
    profileNameDisplay.textContent = runnerName;

    // Set Avatar
    if (runnerAvatar) {
        profileAvatarDisplay.innerHTML = `<img src="${runnerAvatar}" alt="${runnerName}">`;
    } else {
        const initials = runnerName.substring(0, 2).toUpperCase();
        profileAvatarDisplay.innerHTML = `${initials}`;
    }

    // Set Stats
    profileStatsGrid.innerHTML = statsHTML;

    // Display Modal
    runnerProfileModal.classList.add('active');
};

function closeRunnerProfile() {
    if (runnerProfileModal) {
        runnerProfileModal.classList.remove('active');
    }
}

if (closeProfileModalBtn) {
    closeProfileModalBtn.addEventListener('click', closeRunnerProfile);
}

// Close when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === runnerProfileModal) {
        closeRunnerProfile();
    }
});

// Khởi tạo mặc định hiển thị Half Marathon và kiểm tra trạng thái đăng nhập
document.addEventListener('DOMContentLoaded', () => {
    renderLeaderboard('hm');
    renderEventsPage();

    // Kiểm tra trạng thái đăng nhập
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // Tìm tất cả nút đăng nhập (hiện đang liên kết tới login.html)
        const loginButtons = document.querySelectorAll('a[href="login.html"]');
        loginButtons.forEach(btn => {
            // Đổi text thành nút vào trang Admin
            btn.innerHTML = `⚙️ Trang quản trị`;
            btn.href = "admin.html"; 
            btn.classList.remove('btn-outline-gold');
            btn.classList.add('btn-gold'); 
        });
    }
});
