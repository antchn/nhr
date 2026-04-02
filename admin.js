// Bảo vệ đường dẫn
if (!localStorage.getItem('loggedInUser')) {
    alert("Vui lòng đăng nhập bằng tài khoản admin!");
    window.location.href = 'login.html';
}

// Global state
let currentDistance = 'hm';
let adminData = { '5k': [], '10k': [], 'hm': [], 'fm': [] };
let eventsData = [];

// Hàm tải dữ liệu từ Server Python
async function loadDataFromServer() {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            const data = await response.json();
            adminData = data.leaderboard || adminData;
            eventsData = data.events || eventsData;
        }
    } catch (e) {
        console.warn("Không kết nối được server, dùng dữ liệu mẫu", e);
    }
    renderAdminTable();
    renderAdminEvents();
}

// Đẩy dữ liệu lên Server Python
async function saveToDB() {
    try {
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leaderboard: adminData, events: eventsData })
        });
    } catch (e) {
        console.error("Lỗi khi lưu DB:", e);
    }
}

// Dom Elements - Tabs
const navLeaderboard = document.getElementById('nav-leaderboard');
const navEvents = document.getElementById('nav-events');
const viewLeaderboard = document.getElementById('view-leaderboard');
const viewEvents = document.getElementById('view-events');

const tableBody = document.getElementById('admin-table-body');
const distFilter = document.getElementById('distance-filter');
const searchInput = document.getElementById('runner-search');

// Elements modal
const modal = document.getElementById('record-modal');
const btnOpenModal = document.getElementById('open-add-modal');
const btnCloseModal = document.getElementById('close-modal');
const recordForm = document.getElementById('record-form');

// Inputs
const inputDist = document.getElementById('modal-distance');
const inputName = document.getElementById('modal-name');
const inputTime = document.getElementById('modal-time');
const inputAvatar = document.getElementById('modal-avatar');
const avatarPreviewContainer = document.getElementById('avatar-preview-container');

// Global state for uploaded avatar
let currentAvatarData = null;

// Hàm nén ảnh
function compressImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Chất lượng 0.8 cho file jpeg/webp (ảnh sẽ convert qua jpeg)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            callback(dataUrl);
        };
    };
}

// Bắt sự kiện chọn ảnh
if (inputAvatar) {
    inputAvatar.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                alert("Vui lòng chọn file hình ảnh!");
                return;
            }
            compressImage(file, 150, 150, function(dataUrl) {
                currentAvatarData = dataUrl;
                avatarPreviewContainer.innerHTML = `<img src="${dataUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
            });
        }
    });
}

// Modal Sự Kiện
const eventModal = document.getElementById('event-modal');
const btnOpenEventModal = document.getElementById('open-event-modal');
const btnCloseEventModal = document.getElementById('close-event-modal');
const eventForm = document.getElementById('event-form');
const eventTableBody = document.getElementById('admin-events-body');

// Inputs Sự Kiện
const inputEventTitle = document.getElementById('event-title');
const inputEventImage = document.getElementById('event-image');
const inputEventInfo1 = document.getElementById('event-info1');
const inputEventInfo2 = document.getElementById('event-info2');
const inputEventInfo3 = document.getElementById('event-info3');
const inputEventStatus = document.getElementById('event-status');

let editingRecord = null; // Trạng thái lưu trữ khi edit record
let editingEventIndex = null; // Trạng thái khi edit event

// Hàm Render Bảng
function renderAdminTable() {
    tableBody.innerHTML = '';
    let data = adminData[currentDistance];
    
    // Lọc theo tên VĐV
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (searchTerm) {
        data = data.filter(r => r.name.toLowerCase().includes(searchTerm));
    }

    // Sắp xếp
    const sortedData = [...data].sort((a, b) => a.time.localeCompare(b.time));

    sortedData.forEach((runner, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><strong>${runner.name}</strong></td>
            <td>${runner.time}</td>
            <td>${runner.pace}</td>
            <td>
                <button class="btn-icon edit" onclick="editRecord('${runner.name}', '${runner.time}')" style="margin-right: 5px; color: #3b82f6;">Sửa</button>
                <button class="btn-icon delete" onclick="deleteRecord('${runner.name}', '${runner.time}')">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Bắt sự kiện lọc cự ly
distFilter.addEventListener('change', (e) => {
    currentDistance = e.target.value;
    renderAdminTable();
});

// Bắt sự kiện tìm kiếm tên
if (searchInput) {
    searchInput.addEventListener('input', () => {
        renderAdminTable();
    });
}

// Hàm Sửa Record
window.editRecord = function(name, time) {
    // Find record to get full details including avatar
    const record = adminData[currentDistance].find(r => r.name === name && r.time === time);
    editingRecord = { originalName: name, originalTime: time, distance: currentDistance };
    document.getElementById('modal-title').textContent = "Chỉnh sửa kết quả";
    inputDist.value = currentDistance;
    inputName.value = name;
    inputTime.value = time;
    
    // Preview Avatar
    if (record && record.avatar) {
        currentAvatarData = record.avatar;
        avatarPreviewContainer.innerHTML = `<img src="${record.avatar}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        currentAvatarData = null;
        avatarPreviewContainer.innerHTML = `<span style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">Trống</span>`;
    }
    inputAvatar.value = ''; // Reset input file

    modal.classList.add('active');
}

// Hàm Xóa Record
window.deleteRecord = function(name, time) {
    if(confirm(`Bạn có chắc muốn xóa kết quả của ${name}?`)) {
        adminData[currentDistance] = adminData[currentDistance].filter(
            r => !(r.name === name && r.time === time)
        );
        saveAndRender();
    }
}

// Utils tính Pace
function calculatePace(timeStr, distanceKey) {
    // timeStr format HH:MM:SS or MM:SS
    const parts = timeStr.trim().split(':');
    let totalSeconds = 0;
    
    if (parts.length === 3) { // HH:MM:SS
        totalSeconds = parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
    } else if (parts.length === 2) { // MM:SS
        totalSeconds = parseInt(parts[0])*60 + parseInt(parts[1]);
    } else {
        return "0:00";
    }

    let km = 0;
    if(distanceKey==='5k') km = 5;
    if(distanceKey==='10k') km = 10;
    if(distanceKey==='hm') km = 21.1;
    if(distanceKey==='fm') km = 42.195;

    if(km === 0) return "0:00";

    const paceSeconds = totalSeconds / km;
    const paceMin = Math.floor(paceSeconds / 60);
    const paceSec = Math.floor(paceSeconds % 60); // Math.round might be better

    return `${paceMin}:${paceSec < 10 ? '0'+paceSec : paceSec}`;
}

// Khi form submit (Thêm dữ liệu / Lưu chỉnh sửa)
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selDist = inputDist.value;
    const name = inputName.value.trim();
    let time = inputTime.value.trim();
    
    if (time.length < 5) return alert("Vui lòng nhập định dạng thời gian đúng (Ví dụ: 00:20:00)");

    // Chuẩn hóa, nếu thiếu giờ (cho HM/FM)
    if(time.split(':').length === 2 && (selDist === 'hm' || selDist === 'fm')) {
        time = "00:" + time;
    }

    const pace = calculatePace(time, selDist);
    
    // Nếu đang trong trạng thái sửa thì xóa record cũ trước
    if (editingRecord) {
        adminData[editingRecord.distance] = adminData[editingRecord.distance].filter(
            r => !(r.name === editingRecord.originalName && r.time === editingRecord.originalTime)
        );
    }

    adminData[selDist].push({
        name: name,
        time: time,
        pace: pace,
        avatar: currentAvatarData
    });

    editingRecord = null; // Reset trạng thái
    currentAvatarData = null;
    saveAndRender();
    closeModal();
});

async function saveAndRender() {
    localStorage.setItem('ninhHiepRunners_Data', JSON.stringify(adminData));
    await saveToDB(); // Gọi API lưu
    if(inputDist.value !== currentDistance) {
        // Switch view if adding to different distance
        currentDistance = inputDist.value;
        distFilter.value = currentDistance;
    }
    renderAdminTable();
}

// Modal Toggle
btnOpenModal.addEventListener('click', () => { 
    editingRecord = null;
    currentAvatarData = null;
    document.getElementById('modal-title').textContent = "Thêm kết quả mới";
    recordForm.reset();
    avatarPreviewContainer.innerHTML = `<span style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">Trống</span>`;
    inputDist.value = currentDistance; // default to current view
    modal.classList.add('active'); 
});
function closeModal() { 
    editingRecord = null;
    currentAvatarData = null;
    modal.classList.remove('active'); 
}
btnCloseModal.addEventListener('click', closeModal);

// === LOGIC QUẢN LÝ SỰ KIỆN ===

function renderAdminEvents() {
    eventTableBody.innerHTML = '';
    eventsData.forEach((event, index) => {
        const row = document.createElement('tr');
        const statusText = event.status === 'active' ? 'Sắp diễn ra' : (event.status === 'opening' ? 'Đang mở đăng ký' : 'Đã kết thúc');
        
        row.innerHTML = `
            <td><img src="${event.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
            <td><strong>${event.title}</strong></td>
            <td>
                <div style="font-size: 0.85rem; color: #64748b;">
                    ${event.info1}<br>${event.info2}
                </div>
            </td>
            <td><span class="badge ${event.status}">${statusText}</span></td>
            <td>
                <button class="btn-icon edit" onclick="editEvent(${index})" style="margin-right: 5px; color: #3b82f6;">Sửa</button>
                <button class="btn-icon delete" onclick="deleteEvent(${index})">Xóa</button>
            </td>
        `;
        eventTableBody.appendChild(row);
    });
}

// Điều hướng Sidebar
navLeaderboard.addEventListener('click', (e) => {
    e.preventDefault();
    navLeaderboard.classList.add('active');
    navEvents.classList.remove('active');
    viewLeaderboard.style.display = 'block';
    viewEvents.style.display = 'none';
    renderAdminTable();
});

navEvents.addEventListener('click', (e) => {
    e.preventDefault();
    navEvents.classList.add('active');
    navLeaderboard.classList.remove('active');
    viewEvents.style.display = 'block';
    viewLeaderboard.style.display = 'none';
    renderAdminEvents();
});

// Modal Sự Kiện
btnOpenEventModal.addEventListener('click', () => {
    editingEventIndex = null;
    document.getElementById('event-modal-title').textContent = "Thêm sự kiện mới";
    eventForm.reset();
    eventModal.classList.add('active');
});

function closeEventModal() {
    editingEventIndex = null;
    eventModal.classList.remove('active');
}
btnCloseEventModal.addEventListener('click', closeEventModal);

// Submit Form Sự Kiện
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newEvent = {
        title: inputEventTitle.value.trim(),
        image: inputEventImage.value.trim(),
        info1: inputEventInfo1.value.trim(),
        info2: inputEventInfo2.value.trim(),
        info3: inputEventInfo3.value.trim(),
        status: inputEventStatus.value,
        link: "#"
    };

    if (editingEventIndex !== null) {
        eventsData[editingEventIndex] = newEvent;
    } else {
        eventsData.push(newEvent);
    }

    localStorage.setItem('ninhHiepRunners_Events', JSON.stringify(eventsData));
    saveToDB(); // Gọi API lưu Sự Kiện
    renderAdminEvents();
    closeEventModal();
});

// Hàm Sửa/Xóa Sự Kiện (Global)
window.editEvent = function(index) {
    editingEventIndex = index;
    const ev = eventsData[index];
    document.getElementById('event-modal-title').textContent = "Chỉnh sửa sự kiện";
    
    inputEventTitle.value = ev.title;
    inputEventImage.value = ev.image;
    inputEventInfo1.value = ev.info1;
    inputEventInfo2.value = ev.info2;
    inputEventInfo3.value = ev.info3;
    inputEventStatus.value = ev.status;
    
    eventModal.classList.add('active');
}

window.deleteEvent = function(index) {
    if(confirm(`Bạn có chắc muốn xóa sự kiện "${eventsData[index].title}"?`)) {
        eventsData.splice(index, 1);
        localStorage.setItem('ninhHiepRunners_Events', JSON.stringify(eventsData));
        saveToDB(); // Gọi API lưu Sự Kiện
        renderAdminEvents();
    }
}

// Khởi chạy mặc định
loadDataFromServer();

// Sự kiện đăng xuất (dành riêng cho Sidebar vì Admin có File JS riêng)
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    if(confirm('Bạn có thực sự muốn đăng xuất?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }
});
