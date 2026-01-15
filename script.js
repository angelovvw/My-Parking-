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
    // EmailJS инициализация (ако имаш ключ)
    if(typeof emailjs !== 'undefined') emailjs.init("NFzu5SLvhCtMIR1db");
    
    // Карта
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

/* --- НАВИГАЦИЯ МЕЖДУ ЕКРАНИ --- */
window.nav = function(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id + '-screen');
    if (target) target.style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    // Скриваме менюто на гаража, ако сменим екрана
    if (id !== 'map') window.closeBookingSheet();
};

/* --- УПРАВЛЕНИЕ НА ГАРАЖА --- */
window.closeBookingSheet = function() {
    document.getElementById('bookingSheet').classList.remove('active');
    document.getElementById('navOptions').style.display = 'none';
};

window.showNavOptions = function() {
    const opts = document.getElementById('navOptions');
    opts.style.display = (opts.style.display === 'none' || opts.style.display === '') ? 'grid' : 'none';
};

window.openMap = function(type) {
    if (!window.selG) return;
    const url = type === 'google' 
        ? `https://www.google.com/maps/dir/?api=1&destination=${window.selG.lat},${window.selG.lng}`
        : `https://waze.com/ul?ll=${window.selG.lat},${window.selG.lng}&navigate=yes`;
    window.open(url, '_blank');
};

window.changeH = function(v) {
    window.h = Math.max(1, window.h + v);
    updateUI();
};

function updateUI() {
    if(!window.selG) return;
    document.getElementById('hLabel').innerText = window.h + "ч";
    document.getElementById('gPrice').innerText = (window.selG.price * window.h).toFixed(2) + " лв.";
}

/* --- АУТЕНТИКАЦИЯ --- */
window.handleRegister = function() {
    document.getElementById('register-screen').style.display = 'block';
};

window.closeRegister = function() {
    document.getElementById('register-screen').style.display = 'none';
};

window.loginAsGuest = function() { 
    document.getElementById('login-screen').style.display = 'none';
    currentUser = { role: 'guest', name: 'Гост' };
    alert("Влязохте като гост.");
};

window.handleAuth = function() {
    const email = document.getElementById('authEmail').value;
    if(email) {
        document.getElementById('login-screen').style.display = 'none';
        currentUser = { email: email, role: 'user' };
        document.getElementById('profile-locked').style.display = 'none';
        document.getElementById('profile-content').style.display = 'block';
    } else {
        alert("Моля въведете имейл");
    }
};

/* --- РЕЗЕРВАЦИЯ --- */
window.sendBookingRequest = function() {
    document.getElementById('car-selector-modal').style.display = 'flex';
};

window.closeCarModal = function() {
    document.getElementById('car-selector-modal').style.display = 'none';
};

window.startPayment = function() {
    alert("Симулация на плащане... Резервацията за " + window.selG.title + " е успешна!");
    window.closeCarModal();
    window.closeBookingSheet();
};

/* --- НАСТРОЙКИ --- */
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
};

window.changeLang = function() {
    currentLang = document.getElementById('langSelect').value;
    localStorage.setItem('lang', currentLang);
    applyLang();
};

function applyLang() {
    const t = translations[currentLang];
    Object.keys(t).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[id];
    });
}

window.logout = function() {
    location.reload();
};
