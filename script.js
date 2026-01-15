/* --- 1. ГЛОБАЛНИ ПРОМЕНЛИВИ --- */
let currentUser = null;
let currentLang = localStorage.getItem('lang') || 'bg';
let map;
let selG = null;
let h = 1;

/* --- 2. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАРЕЖДАНЕ --- */
window.onload = function() {
    if (typeof emailjs !== 'undefined') emailjs.init("NFzu5SLvhCtMIR1db");

    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        completeLogin(currentUser);
    }

    // Инициализация на картата
    map = L.map('map', { zoomControl: false, tap: false }).setView([42.6977, 23.3219], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const garages = [
        { lat: 42.6791, lng: 23.3215, title: "Паркинг Арсеналски", addr: "бул. Арсеналски 2", price: 3 },
        { lat: 42.6965, lng: 23.3260, title: "Паркомясто Център", addr: "пл. Княз Александър I", price: 2 }
    ];

    garages.forEach(g => {
        const icon = L.divIcon({
            className: 'custom-p',
            html: `<div class="p-marker"><span>P</span></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        L.marker([g.lat, g.lng], {icon}).addTo(map).on('click', () => {
            window.selG = g;
            window.h = 1;
            document.getElementById('gTitle').innerText = g.title;
            document.getElementById('gAddress').innerText = g.addr;
            document.getElementById('bookingSheet').classList.add('active');
            updateUI();
        });
    });
}; 

/* --- 3. ФУНКЦИИ ЗА ВХОД И РЕГИСТРАЦИЯ --- */
window.handleAuth = function() {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || "[]");
    const user = allUsers.find(u => u.email === email && u.password === pass);

    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        completeLogin(user);
    } else {
        alert("Грешен имейл или парола!");
    }
};

function completeLogin(user) {
    currentUser = user;
    document.getElementById('login-screen').style.display = 'none';
    
    const locked = document.getElementById('profile-locked');
    const content = document.getElementById('profile-content');
    if (locked) locked.style.display = 'none';
    if (content) content.style.display = 'block';

    // ПОПЪЛВАНЕ НА НАСТРОЙКИТЕ (Това, което добавихме)
    if (document.getElementById('edit-name')) document.getElementById('edit-name').value = user.name || "";
    if (document.getElementById('edit-email')) document.getElementById('edit-email').value = user.email || "";
    if (document.getElementById('edit-phone')) document.getElementById('edit-phone').value = user.phone || "";

    // Зареждане на колите
    const list = document.getElementById('cars-list');
    if (list) {
        list.innerHTML = "";
        if (user.cars && user.cars.length > 0) {
            user.cars.forEach(car => window.addNewCarField(car.model, car.plate));
        }
    }
    if (map) setTimeout(() => map.invalidateSize(), 200);
}

/* --- 4. НОВАТА ФУНКЦИЯ ЗА ЗАПАЗИ (НАСТРОЙКИ) --- */
window.updateFullProfile = function() {
    if (!currentUser) return;
    
    currentUser.name = document.getElementById('edit-name').value;
    currentUser.email = document.getElementById('edit-email').value;
    currentUser.phone = document.getElementById('edit-phone').value;

    localStorage.setItem('loggedUser', JSON.stringify(currentUser));
    
    let allUsers = JSON.parse(localStorage.getItem('allUsers') || "[]");
    const idx = allUsers.findIndex(u => u.password === currentUser.password);
    if(idx !== -1) {
        allUsers[idx] = currentUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
    alert("Профилът е обновен успешно!");
};

/* --- 5. КОЛИ И РЕЗЕРВАЦИИ --- */
window.addNewCarField = function(m = "", p = "") {
    const container = document.getElementById('cars-list');
    const div = document.createElement('div');
    div.className = "car-item-block";
    div.innerHTML = `
        <input type="text" class="car-model-input" value="${m}" placeholder="Марка/Модел">
        <input type="text" class="car-plate-input" value="${p}" placeholder="Рег. Номер">
        <button onclick="window.saveCarData()">💾</button>
        <button onclick="this.parentElement.remove(); window.saveCarData();">✕</button>`;
    container.appendChild(div);
};

window.saveCarData = function() {
    let cars = [];
    document.querySelectorAll('.car-item-block').forEach(node => {
        const model = node.querySelector('.car-model-input').value;
        const plate = node.querySelector('.car-plate-input').value;
        if(model || plate) cars.push({ model, plate });
    });
    currentUser.cars = cars;
    localStorage.setItem('loggedUser', JSON.stringify(currentUser));
};

/* --- 6. НАВИГАЦИЯ И ДРУГИ --- */
window.nav = function(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    document.getElementById(id + '-screen').style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if(btn) btn.classList.add('active');
    if(id === 'map' && map) setTimeout(() => map.invalidateSize(), 200);
};

window.logout = function() { localStorage.removeItem('loggedUser'); location.reload(); };
window.changeH = function(v) { window.h = Math.max(1, window.h + v); updateUI(); };
function updateUI() { 
    document.getElementById('hLabel').innerText = window.h + "ч"; 
    document.getElementById('gPrice').innerText = (window.selG.price * window.h).toFixed(2) + " лв."; 
}