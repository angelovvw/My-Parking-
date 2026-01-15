let map;
window.selG = null;
window.h = 1;

window.onload = function() {
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
};

/* --- НАВИГАЦИЯ --- */
window.nav = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (id !== 'map') {
        document.getElementById(id + '-screen').classList.add('active');
        window.closeBookingSheet();
    }
};

window.handleAuth = function() { document.getElementById('login-screen').classList.remove('active'); };
window.handleRegister = function() { document.getElementById('register-screen').classList.add('active'); };
window.closeRegister = function() { document.getElementById('register-screen').classList.remove('active'); };
window.loginAsGuest = function() { document.getElementById('login-screen').classList.remove('active'); };

/* --- КОЛИ --- */
window.addNewCarField = function() {
    const list = document.getElementById('cars-list');
    const div = document.createElement('div');
    div.className = 'car-item';
    div.innerHTML = `
        <input type="text" placeholder="Рег. номер (напр. СВ1234АВ)">
        <button onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(div);
};

/* --- ГАРАЖ --- */
window.closeBookingSheet = function() { 
    document.getElementById('bookingSheet').classList.remove('active');
    document.getElementById('navOptions').style.display = 'none';
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

window.showNavOptions = function() {
    const opts = document.getElementById('navOptions');
    opts.style.display = (opts.style.display === 'flex') ? 'none' : 'flex';
};

window.openMap = function(type) {
    if (!window.selG) return;
    const url = type === 'google' 
        ? `https://www.google.com/maps/dir/?api=1&destination=${window.selG.lat},${window.selG.lng}`
        : `https://waze.com/ul?ll=${window.selG.lat},${window.selG.lng}&navigate=yes`;
    window.open(url, '_blank');
};

window.toggleDarkMode = function() { document.body.classList.toggle('dark-theme'); };
window.logout = function() { location.reload(); };
window.sendBookingRequest = function() { alert("Резервацията е успешна!"); window.closeBookingSheet(); };
window.sendLenderRequest = function() { alert("Заявката е изпратена!"); };
