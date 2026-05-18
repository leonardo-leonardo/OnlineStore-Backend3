// ================= EMAILJS INIT =================
(function () {
    emailjs.init("w-EA-SaRhXquiCgRI");
})();

// ================= DATA REPOSITORY =================
const items = [
    {
        name: "Flappy Bird Game",
        price: 5,
        category: "games",
        img: "https://tse1.mm.bing.net/th/id/OIP.rsI7PGvojKE3hmTpIVr4UwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
        desc: "A classic, easy-to-play side-scroller game. Navigate through the pipes and beat your high score!"
    },
    {
        name: "Making Your Laptop/Pc run fastest+Advanced Tweaks🔥",
        price: 100,
        category: "optimizing",
        img: "https://mirillis.com/blog/wp-content/uploads/2017/10/Increase-PC-Speed-1250x917.jpg",
        desc: "Advanced registry and system tweaks to squeeze every bit of performance out of your hardware🔥."
    },
    {
        name: "Free up your laptop/Pc storage",
        price: 100,
        category: "optimizing",
        img: "https://iphonewired.com/wp-content/uploads/2022/11/1669772263_maxresdefault.jpg",
        desc: "Professional cleaning of cache, windows update leftovers, files that are no longer needed to regain lost space."
    },
    {
        name: "Extend your laptop and Pc's battery life",
        price: 100,
        category: "optimizing",
        img: "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2021/09/battery_saver_hero_3.jpg",
        desc: "Optimization of power plans and background processes to make your battery last longer. Details: CPU-power limit to 6~9watts and reduce GHz.          RAM-Reduce power usage by cleaning up RAM and enabling power-saving mode if acceptable.          Disk-Reduce unnecessary disk activities by stopping unnecessary services like Windows prefetch and search index.          Wi-Fi- Disable auto sample or diagnostics data that sends to Microsoft.          GPU-Use power saving mode with vendor-specific apps, disable dedicated GPU(if acceptable).          NPU-Disable it for better efficiency(If you have one)."
    },
    {
        name: "Add another Operating system to your laptop/Pc",
        price: 150,
        category: "install",
        img: "https://raw.githubusercontent.com/leonardo-leonardo/OnlineStore-Backend3/refs/heads/main/Choosing%20Opearting%20System%20Menu.jpg",
        desc: "Dual-boot setup for Windows11, Windows10, Ubuntu, Tiny11 and Windows 7. System compatibility check included. #I can also install other operating systems if your hardware allows! *Unfortunately, some operating systems can't install because laptops/pc hardware doesn't support."
    },
    {
        name: "Diagnose your laptop/Pc",
        price: 100,
        category: "diagnose",
        img: "https://static1.makeuseofimages.com/wordpress/wp-content/uploads/2017/12/Signs-Computer-Has-Virus-Featured.jpg",
        desc: "Full hardware and software diagnostic report to identify problems and bottlenecks."
    },
    {
        name: "Install A Mac OS in a Windows laptop/pc, with a virtual machine",
        price: 200,
        category: "install",
        img: "https://logos-world.net/wp-content/uploads/2023/03/Mac-Logo.png",
        desc: "Installing a Mac OS in your Windows pc, using VMware Workstation Pro. #I will also maximize the performance of the VM. *The performance may decrease if Mac doesn't support your graphics."
    }
];

let cart = [];
let total = 0;
let currentUser = null;

// ================= ROUTING NAVIGATION ENGINE =================
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';
    
    if (sectionId === 'store-layer') {
        document.getElementById('itemsContainer').style.display = 'flex';
        document.getElementById('detail-layer').style.display = 'none';
    } else {
        document.getElementById('itemsContainer').style.display = 'none';
    }
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// ================= RENDERING MANAGEMENT =================
function renderItems() {
    const container = document.getElementById("itemsContainer");
    if (!container) return;
    container.innerHTML = "";

    const search = document.getElementById("searchBar").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;

    items
        .filter(item => (category === "all" || item.category === category) && item.name.toLowerCase().includes(search))
        .forEach(item => {
            container.innerHTML += `
                <div class="item" onclick="openProduct(\`${item.name}\`)" style="cursor:pointer;">
                    <img src="${item.img}">
                    <h3>${item.name}</h3>
                    <p>NT$${item.price}</p>
                    <button onclick="event.stopPropagation(); addToCart(\`${item.name}\`, ${item.price}, event)">Add to Cart</button>
                </div>`;
        });
}

function openProduct(name) {
    const item = items.find(i => i.name === name);
    const detailContent = document.getElementById("detailContent");
    const detailLayer = document.getElementById("detail-layer");

    detailContent.innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <img src="${item.img}" style="width: 280px; height:200px; object-fit:contain; border-radius: 8px; background: rgba(255,255,255,0.4); padding: 5px;">
            <div style="flex: 1; min-width: 250px;">
                <h2>${item.name}</h2>
                <p style="line-height: 1.6; margin: 12px 0; white-space: pre-wrap;">${item.desc}</p>
                <h3>Price: NT$${item.price}</h3>
                <button onclick="addToCart(\`${item.name}\`, ${item.price}, event)" style="margin-top:15px;">✨ Add to Cart</button>
            </div>
        </div>`;
    
    detailLayer.classList.remove("aero-animate-open");
    void detailLayer.offsetWidth; 
    detailLayer.classList.add("aero-animate-open");
    
    showSection('detail-layer');
}

function closeDetails() { showSection('store-layer'); }

// ================= DUAL SYNC CART ENGINE + ANIMATIONS =================
function addToCart(name, price, event) {
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty += 1; } else { cart.push({ name, price, qty: 1 }); }
    
    const sound = document.getElementById("dingSound");
    if (sound) sound.play();

    const startX = event ? event.clientX : window.innerWidth / 2;
    const startY = event ? event.clientY : window.innerHeight / 2;
    
    const targetCart = document.querySelector(".cart-overview");
    const targetRect = targetCart.getBoundingClientRect();
    const orb = document.getElementById("flying-orb");
    
    orb.style.left = `${startX - 22}px`;
    orb.style.top = `${startY - 22}px`;
    orb.style.display = "block";
    orb.style.transform = "scale(1)";
    orb.style.opacity = "1";

    void orb.offsetWidth; 

    orb.style.left = `${targetRect.left + (targetRect.width / 2) - 10}px`;
    orb.style.top = `${targetRect.top + 5}px`;
    orb.style.transform = "scale(0.4)";
    orb.style.opacity = "0.3";

    setTimeout(() => {
        orb.style.display = "none";
        targetCart.classList.add("cart-bump-active");
        updateCartTotals();
        
        setTimeout(() => {
            targetCart.classList.remove("cart-bump-active");
        }, 300);
    }, 600);
}

function updateQty(index, offset) {
    cart[index].qty += offset;
    if (cart[index].qty <= 0) { cart.splice(index, 1); }
    updateCartTotals();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartTotals();
}

// ================= MULTI-THEME ENGINE LOGIC =================
function applyThemeSettings() {
    const selector = document.getElementById('themeSelector');
    const statusDisplay = document.getElementById('statusDisplay');
    const storeTitle = document.getElementById('store-title');
    const activeTheme = localStorage.getItem('systemTheme') || 'win7';
    
    if (selector) selector.value = activeTheme;

    // Reset base layout flags
    document.body.classList.remove('theme-no-transparency');

    // Remove all previous layout class flags
    document.body.classList.remove(
        'theme-win1', 'theme-win2', 'theme-win30', 'theme-win31', 
        'theme-win95', 'theme-win98', 'theme-winme', 'theme-win2000', 
        'theme-winxp', 'theme-winvista', 'theme-win7', 'theme-win8', 
        'theme-win81', 'theme-win10', 'theme-win11'
    );

    document.body.classList.add(`theme-${activeTheme}`);

    let themeName = '';
    let titleName = '';
    let textColor = '#000000'; // Default light theme text color

    // Determine contrast flags and details
    switch(activeTheme) {
        case 'win1': 
            themeName = 'Windows 1.0 (Retro Mosaic)'; titleName = '📼 Windows 1.0 Tiled Store (1985)'; 
            textColor = '#ffffff'; document.body.classList.add('theme-no-transparency'); break;
        case 'win2': 
            themeName = 'Windows 2.0 (Overlapping Flat)'; titleName = '🗔 Windows 2.0 Interface Store (1987)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win30': 
            themeName = 'Windows 3.0 (Program Manager Classic)'; titleName = '💾 Windows 3.0 Standard Store (1990)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win31': 
            themeName = 'Windows 3.1 (Retro Performance)'; titleName = '💾 Windows 3.1 Performance Store (1992)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win95': 
            themeName = 'Windows 95 (Classic Taskbar)'; titleName = '📟 Windows 95 Revolution Store (1995)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win98': 
            themeName = 'Windows 98 (Active Desktop)'; titleName = '🌐 Windows 98 Web-Integrated Store (1998)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'winme': 
            themeName = 'Windows Me (Millennium Edition)'; titleName = '📀 Windows Me Multimedia Store (2000)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win2000': 
            themeName = 'Windows 2000 (NT Professional)'; titleName = '💼 Windows 2000 Enterprise Store (2000)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'winxp': 
            themeName = 'Windows XP (Luna Minimal)'; titleName = '🎈 Windows XP Minimal Store (2001)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'winvista': 
            themeName = 'Windows Vista (Aero Glass)'; titleName = '🔮 Windows Vista Aero Store (2007)'; 
            textColor = '#ffffff'; break; // Has transparency but uses dark layers
        case 'win7': 
            themeName = 'Windows 7 (Aero Glass)'; titleName = '🛒 Aero Glass Store (Windows 7 Style)'; break;
        case 'win8': 
            themeName = 'Windows 8 (Metro Flat)'; titleName = '🟩 Windows 8 Metro Store (2012)'; 
            document.body.classList.add('theme-no-transparency'); break;
        case 'win81': 
            themeName = 'Windows 8.1 (Blue Modern)'; titleName = '🏁 Windows 8.1 Core Store (2013)'; 
            textColor = '#ffffff'; document.body.classList.add('theme-no-transparency'); break;
        case 'win10': 
            themeName = 'Windows 10 (Modern Solid)'; titleName = '💻 Windows 10 Solid Store (2015)'; 
            textColor = '#ffffff'; document.body.classList.add('theme-no-transparency'); break;
        case 'win11': 
            themeName = 'Windows 11 (Fluent Minimal)'; titleName = '✨ Windows 11 Minimal Store (2021)'; 
            textColor = '#ffffff'; document.body.classList.add('theme-no-transparency'); break;
    }

    // Apply smart contrast text property variables globally
    document.documentElement.style.setProperty('--text-contrast', textColor);

    if (statusDisplay) statusDisplay.textContent = `Theme: ${themeName}`;
    if (storeTitle) storeTitle.textContent = titleName;
}

function updateCartTotals() {
    total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cartCount").innerText = totalCount;
    document.getElementById("taskbarTotal").innerText = total;
    
    const detailedList = document.getElementById("detailedCartList");
    if (detailedList) {
        detailedList.innerHTML = cart.length === 0 ? "<div>Your cart is currently empty.</div>" : "";
        cart.forEach((item, index) => {
            detailedList.innerHTML += `
                <div class="cart-item-row">
                    <span style="font-weight:600; width:40%; text-align:left;">${item.name}</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <span style="font-weight:600; min-width:80px; text-align:right;">NT$${item.price * item.qty}</span>
                    <button onclick="removeItem(${index})" style="background:linear-gradient(#ff9999, #cc0000); color:#ffffff !important; font-weight:bold; border:1px solid #7a0000;">X</button>
                </div>`;
        });
        document.getElementById("detailedTotal").innerText = total;
        document.getElementById("paymentRule").innerText = total >= 500 ? "Cash Before Delivery" : "Cash Only";
    }
    localStorage.setItem("aero_cart", JSON.stringify(cart));
}

// ================= PRODUCTION AUTHENTICATION ENGINE =================
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById("reg-user").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const confirm = document.getElementById("reg-confirm-pass").value;
    const msg = document.getElementById("registerMessage");

    if (pass.length < 6) { return showAuthMsg(msg, "Password must be at least 6 characters!", "red"); }
    if (pass !== confirm) { return showAuthMsg(msg, "Passwords do not match!", "red"); }

    let users = JSON.parse(localStorage.getItem("aero_users")) || [];
    if (users.find(u => u.username.toLowerCase() === user.toLowerCase())) {
        return showAuthMsg(msg, "Username already taken!", "red");
    }

    users.push({ username: user, email: email, password: btoa(pass) }); 
    localStorage.setItem("aero_users", JSON.stringify(users));
    
    showAuthMsg(msg, "Registration Successful! Redirecting...", "green");
    setTimeout(() => {
        document.getElementById("real-register-form").reset();
        showSection('login-page');
        msg.innerText = "";
    }, 1500);
}

// ================= AUTHENTICATION HANDLERS =================
function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const msg = document.getElementById("loginMessage");

    let users = JSON.parse(localStorage.getItem("aero_users")) || [];
    const foundUser = users.find(u => u.username.toLowerCase() === user.toLowerCase() && u.password === btoa(pass));

    if (!foundUser) { return showAuthMsg(msg, "Invalid username or password!", "red"); }

    currentUser = foundUser.username;
    localStorage.setItem("aero_logged_in", currentUser);
    
    showAuthMsg(msg, "Login successful! Welcome back.", "green");
    setTimeout(() => {
        document.getElementById("real-login-form").reset();
        syncAuthState();
        showSection('store-layer');
        msg.innerText = "";
    }, 1200);
}

function logout() {
    localStorage.removeItem("aero_logged_in");
    currentUser = null;
    syncAuthState();
    showSection('store-layer');
}

function syncAuthState() {
    const guestsLinks = document.querySelectorAll(".auth-guest-only");
    const userLinks = document.querySelectorAll(".auth-user-only");
    const statusText = document.getElementById("userStatus");
    currentUser = localStorage.getItem("aero_logged_in");

    if (currentUser) {
        statusText.innerText = `👤 ${currentUser}`;
        guestsLinks.forEach(l => l.style.display = "none");
        userLinks.forEach(l => l.style.display = "block");
    } else {
        statusText.innerText = "👤 Guest";
        guestsLinks.forEach(l => l.style.display = "block");
        userLinks.forEach(l => l.style.display = "none");
    }
}

function showAuthMsg(el, text, color) { el.innerText = text; el.style.color = color; }

// ================= ANIMATED CHECKOUT INTEGRATION =================
function checkout() {
    if (cart.length === 0) return alert("Cart is empty!🥲");
    
    const clientName = currentUser ? currentUser : prompt("Enter your name as Guest:");
    if (!clientName) return;

    const orderDetails = cart.map(i => `${i.name} × ${i.qty} = NT$${i.price * i.qty}`).join("\n");
    const overlay = document.getElementById("checkout-overlay");
    const loaderText = document.getElementById("loader-text");
    
    loaderText.innerText = "Encrypting Pipeline data...";
    overlay.style.display = "flex";

    setTimeout(() => {
        loaderText.innerText = "Transmitting to EmailJS Gateways...";
        
        emailjs.send("service_nb7uhuv", "template_2upy0gm", {
            name: clientName,
            product: orderDetails,
            price: total
        })
        .then(() => {
            loaderText.innerHTML = "<span style='color: #00ff88;'>✅ Order Dispatched!</span>";
            
            setTimeout(() => {
                overlay.style.display = "none";
                alert("✅ Order sent successfully!😄");
                cart = [];
                updateCartTotals();
                showSection('store-layer');
            }, 1000);
        })
        .catch((err) => {
            overlay.style.display = "none";
            alert("❌ Failed to complete transmission sequence.");
        });
    }, 1200);
}

// ================= INITIALIZATION =================
window.onload = function() {
    const savedCart = localStorage.getItem("aero_cart");
    if (savedCart) cart = JSON.parse(savedCart);
    syncAuthState();
    updateCartTotals();
    applyThemeSettings();
    
    const selector = document.getElementById('themeSelector');
    if (selector) {
        selector.addEventListener('change', function() {
            localStorage.setItem('systemTheme', this.value);
            applyThemeSettings();
        });
    }
    
    document.getElementById('store-layer').style.display = 'block';
    document.getElementById('itemsContainer').style.display = 'flex';
    
    renderItems();
};
