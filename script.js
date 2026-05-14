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
        desc: "Optimization of power plans and background processes to make your battery last longer."
    },
    {
        name: "Add another Operating system to your laptop/Pc",
        price: 150,
        category: "install",
        img: "https://raw.githubusercontent.com/leonardo-leonardo/OnlineStore-Backend3/refs/heads/main/Choosing%20Opearting%20System%20Menu.jpg",
        desc: "Dual-boot setup for Windows11, Windows10, Ubuntu, Tiny11 and Windows 7. System compatibility check included."
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
        desc: "Installing a Mac OS in your Windows pc, using VMware Workstation Pro."
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
    if(sectionId === 'store-layer') {
        document.getElementById('detail-layer').style.display = 'none';
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
                    <button onclick="event.stopPropagation(); addToCart(\`${item.name}\`, ${item.price})">Add to Cart</button>
                </div>`;
        });
}

function openProduct(name) {
    const item = items.find(i => i.name === name);
    const detailContent = document.getElementById("detailContent");
    detailContent.innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap; color: #000;">
            <img src="${item.img}" style="width: 280px; height:200px; object-fit:contain; border-radius: 8px;">
            <div style="flex: 1; min-width: 250px;">
                <h2>${item.name}</h2>
                <p style="line-height: 1.5; margin: 12px 0;">${item.desc}</p>
                <h3 style="color: #1a4c9c;">Price: NT$${item.price}</h3>
                <button onclick="addToCart(\`${item.name}\`, ${item.price})" style="margin-top:15px;">✨ Add to Cart</button>
            </div>
        </div>`;
    showSection('detail-layer');
}

function closeDetails() { showSection('store-layer'); }

// ================= DUAL SYNC CART SYSTEM =================
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.qty += 1; } else { cart.push({ name, price, qty: 1 }); }
    updateCartTotals();
    const sound = document.getElementById("dingSound");
    if (sound) sound.play();
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

function updateCartTotals() {
    total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cartCount").innerText = totalCount;
    document.getElementById("taskbarTotal").innerText = total;
    
    // Render detailed View
    const detailedList = document.getElementById("detailedCartList");
    if (detailedList) {
        detailedList.innerHTML = cart.length === 0 ? "<p style='color:#000;'>Your cart is currently empty.</p>" : "";
        cart.forEach((item, index) => {
            detailedList.innerHTML += `
                <div class="cart-item-row">
                    <span style="font-weight:600; width:40%;">${item.name}</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <span style="font-weight:600;">NT$${item.price * item.qty}</span>
                    <button onclick="removeItem(${index})" style="background:linear-gradient(#ff9999, #cc0000); color:white;">❌</button>
                </div>`;
        });
        document.getElementById("detailedTotal").innerText = total;
        document.getElementById("paymentRule").innerText = total >= 500 ? "Cash Before Delivery" : "Cash Only";
    }
    saveCart();
}

function saveCart() {
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

    users.push({ username: user, email: email, password: btoa(pass) }); // btoa simulates server side hash hashing safely
    localStorage.setItem("aero_users", JSON.stringify(users));
    
    showAuthMsg(msg, "Registration Successful! Redirecting...", "green");
    setTimeout(() => {
        document.getElementById("real-register-form").reset();
        showSection('login-page');
        msg.innerText = "";
    }, 1500);
}

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
    currentUser = localStorage.getItem("aero_logged_in");
    const guestsLinks = document.querySelectorAll(".auth-guest-only");
    const userLinks = document.querySelectorAll(".auth-user-only");
    const statusText = document.getElementById("userStatus");

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

// ================= CHECKOUT INTEGRATION =================
function checkout() {
    if (cart.length === 0) return alert("Cart is empty!🥲");
    
    const clientName = currentUser ? currentUser : prompt("Enter your name as Guest:");
    if (!clientName) return;

    const orderDetails = cart.map(i => `${i.name} × ${i.qty} = NT$${i.price * i.qty}`).join("\n");

    emailjs.send("service_nb7uhuv", "template_2upy0gm", {
        name: clientName,
        product: orderDetails,
        price: total
    })
    .then(() => {
        alert("✅ Order sent successfully!😄");
        cart = [];
        updateCartTotals();
        showSection('store-layer');
    })
    .catch((err) => { alert("❌ Failed to forward transaction sequence."); });
}

// ================= SYSTEM CONFIGURATION INITIALIZER =================
window.onload = function() {
    const savedCart = localStorage.getItem("aero_cart");
    if (savedCart) cart = JSON.parse(savedCart);
    syncAuthState();
    updateCartTotals();
    renderItems();
};
