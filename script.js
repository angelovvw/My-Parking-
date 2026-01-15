let map;
window.selG = null;
window.h = 1;

window.onload = function() {
    // Инициализация на картата
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
};

/* --- НАВИГАЦИЯ МЕЖДУ ЕКРАНИТЕ --- */
window.nav = function(id, btn) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id + '-screen');
    if (target) target.style.display = 'block';
    
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    if (id === 'map') window.closeBookingSheet();
};

/* --- РЕЗЕРВАЦИЯ --- */
window.changeH = function(v) {
    window.h = Math.max(1, window.h + v);
    updateUI();
};

function updateUI() {
    if(!window.selG) return;
    document.getElementById('hLabel').innerText = window.h + "ч";
    document.getElementById('gPrice').innerText = (window.selG.price * window.h).toFixed(2) + " лв.";
}

window.closeBookingSheet = function() {
    document.getElementById('bookingSheet').classList.remove('active');
};

window.showNavOptions = function() {
    const opts = document.getElementById('navOptions');
    opts.style.display = (opts.style.display === 'none') ? 'grid' : 'none';
};

window.openMap = function(type) {
    if (!window.selG) return;
    const url = type === 'google' 
        ? `https://www.google.com/maps/dir/?api=1&destination=${window.selG.lat},${window.selG.lng}`
        : `https://waze.com/ul?ll=${window.selG.lat},${window.selG.lng}&navigate=yes`;
    window.open(url, '_blank');
};

/* --- ПОТРЕБИТЕЛИ --- */
window.handleAuth = function() {
    document.getElementById('login-screen').style.display = 'none';
};

window.handleRegister = function() {
    document.getElementById('register-screen').style.display = 'block';
};

window.closeRegister = function() {
    document.getElementById('register-screen').style.display = 'none';
};

window.loginAsGuest = function() {
    document.getElementById('login-screen').style.display = 'none';
};

window.logout = function() {
    location.reload();
};

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
};

/* --- КОЛИ И ПЛАЩАНЕ --- */
window.addNewCarField = function() {
    const list = document.getElementById('cars-list');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '10px';
    div.style.marginBottom = '10px';
    div.innerHTML = `
        <input type="text" placeholder="Рег. номер" style="flex:1;">
        <button onclick="this.parentElement.remove()" style="color:red; background:none; border:none; font-size:20px;">×</button>
    `;
    list.appendChild(div);
};

window.sendBookingRequest = function() {
    document.getElementById('car-selector-modal').style.display = 'flex';
};

window.closeCarModal = function() {
    document.getElementById('car-selector-modal').style.display = 'none';
};

window.startPayment = function() {
    alert("Плащането е успешно! Резервацията ви е потвърдена.");
    window.closeCarModal();
    window.closeBookingSheet();
};

window.processNewRegistration = function() {
    alert("Регистрацията е успешна!");
    window.closeRegister();
};

window.sendLenderRequest = function() {
    alert("Вашата заявка за Lender е изпратена за преглед.");
};
