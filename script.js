/* --- ГЛОБАЛНИ ПРОМЕНЛИВИ --- */
let currentUser = null;
let currentLang = localStorage.getItem('lang') || 'bg';
let map;
window.selG = null;
window.h = 1;

const translations = {
    bg: {
        'lang-auth-title': "Влез в My Parking",
        'btn-auth-main': "ВХОД",
        'btn-reg-main': "РЕГИСТРАЦИЯ",
        'btn-guest': "Влез като Гост",
        'nav-map': "Карта",
        'nav-profile': "Профил",
        'nav-settings': "Настройки",
        'lang-settings-title': "Настройки",
        'btn-logout': "Изход",
        'btn-book': "Резервирай",
        'lang-price-label': "ЦЕНА",
        'btn-nav-draw': "🚗 Навигация"
    },
    en: {
        'lang-auth-title': "Login to My Parking",
        'btn-auth-main': "LOGIN",
        'btn-reg-main': "REGISTER",
        'btn-guest': "Guest Login",
        'nav-map': "Map",
        'nav-profile': "Profile",
        'nav-settings': "Settings",
        'lang-settings-title': "Settings",
        'btn-logout': "Logout",
        'btn-book': "Book Now",
        'lang-price-label': "PRICE",
        'btn-nav-draw': "🚗 Navigation"
    }
};

window.onload = function() {
    map = L.map('map', { zoomControl: false }).setView([42.6977, 23.3219], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const garages = [
        { lat: 42.6791, lng: 23.3215, title: "Паркинг Арсеналски", addr: "бул. Арсеналски 2", price: 3 },
        { lat: 42.6965, lng: 23.3260, title: "Паркомясто Център", addr: "пл. Княз Александър I", price: 2 }
    ];

    garages.forEach(g => {
        L.marker([g.lat, g.lng]).addTo(map).on('click', () => {
            window.selG = g;
            window.h = 1;
            document.getElementById('gTitle').innerText = g.title;
            document.getElementById('gAddress').innerText = g.addr;
            document.getElementById('bookingSheet').classList.add('active');
            updateUI();
        });
    });
    applyLang();
};

/* --- УПРАВЛЕНИЕ НА КОЛИ --- */
window.addNewCarField = function() {
    const list = document.getElementById('cars-list');
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'edit-group';
    div.style.display = 'flex';
    div.style.gap = '10px';
    div.style.marginBottom = '10px';
    div.innerHTML = `
        <input type="text" placeholder="Рег. номер (СВ1234АВ)" style="flex:1; padding:10px; border-radius:8px; border:1px solid #ddd;">
        <button onclick="this.parentElement.remove()" style="background:#ff4444; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer;">X</button>
    `;
    list.appendChild(div);
};

/* --- ОСНОВНИ ФУНКЦИИ --- */
window.nav = function(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id + '-screen');
    if (target) target.style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (id !== 'map') window.closeBookingSheet();
};

window.closeBookingSheet = function() {
    document.getElementById('bookingSheet').classList.remove('active');
};

window.loginAsGuest = function() { 
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('profile-locked').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
};

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
};

function updateUI() {
    if(!window.selG) return;
    document.getElementById('hLabel').innerText = window.h + "ч";
    document.getElementById('gPrice').innerText = (window.selG.price * window.h).toFixed(2) + " лв.";
}

function applyLang() {
    const t = translations[currentLang];
    Object.keys(t).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[id];
    });
}
