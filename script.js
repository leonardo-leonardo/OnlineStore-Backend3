// ================= FIREBASE DATABASE INITIALIZATION =================
const firebaseConfig = {
    apiKey: "AIzaSyAvBEyvpAt9_pM9Q6xkb8j8GCBEwrjwwiI",
    authDomain: "aero-glass-store.firebaseapp.com",
    databaseURL: "https://aero-glass-store-default-rtdb.firebaseio.com/",
    projectId: "aero-glass-store",
    storageBucket: "aero-glass-store.firebasestorage.app",
    messagingSenderId: "61127659322",
    appId: "1:61127659322:web:2d9fcd40d1fcf318b5ca03"
};

// Initialize Firebase using compatibility layer
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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

    if (sectionId === 'history-page') {
        loadOrderHistory();
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
                <button onclick="addToCart(\`${item.name}\`, ${item.price}, event)" style="margin-top:15px; background: linear-gradient(#ffffff, #b2cceb);">✨ Add to Cart</button>
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

// ================= PERFORMANCE CONFIGURATION CONFIG ENGINE =================
function applyTransparencySettings() {
    const toggle = document.getElementById('transparencyToggle');
    const statusDisplay = document.getElementById('statusDisplay');
    const settingThemeTitle = document.getElementById('settingThemeTitle');
    
    if (localStorage.getItem('aeroTransparency') === 'disabled') {
        if (toggle) toggle.checked = false;
        document.body.classList.add('disable-transparency');
        if (statusDisplay) statusDisplay.textContent = 'Theme Mode: Aero Basic';
        if (settingThemeTitle) settingThemeTitle.textContent = 'Theme Mode: Aero Basic';
    } else {
        if (toggle) toggle.checked = true;
        document.body.classList.remove('disable-transparency');
        if (statusDisplay) statusDisplay.textContent = 'Theme Mode: Aero';
        if (settingThemeTitle) settingThemeTitle.textContent = 'Theme Mode: Aero';
    }
}

function updateCartTotals() {
    total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("cartCount").innerText = totalCount;
    document.getElementById("taskbarTotal").innerText = total;
    
    const detailedList = document.getElementById("detailedCartList");
    if (detailedList) {
        detailedList.innerHTML = cart.length === 0 ? "<p style='color:#000000;'>Your cart is currently empty.</p>" : "";
        cart.forEach((item, index) => {
            detailedList.innerHTML += `
                <div class="cart-item-row" style="color: #000000;">
                    <span style="font-weight:600; width:40%; text-align:left; color: #000000;">${item.name}</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span class="qty-val" style="color: #000000;">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                    <span style="font-weight:600; min-width:80px; text-align:right; color: #000000;">NT$${item.price * item.qty}</span>
                    <button onclick="removeItem(${index})" style="background:linear-gradient(#ff9999, #cc0000); color:#ffffff !important; font-weight:bold; border:1px solid #7a0000; box-shadow:0 1px 3px rgba(0,0,0,0.5);">X</button>
                </div>`;
        });
        document.getElementById("detailedTotal").innerText = total;
        document.getElementById("paymentRule").innerText = total >= 500 ? "Cash Before Delivery" : "Cash Only";
    }
    localStorage.setItem("aero_cart", JSON.stringify(cart));
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCartTotals();
}

// ================= AUTHENTICATION CORES (FIREBASE REALTIME UPGRADE) =================
function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById("reg-user").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const pass = document.getElementById("reg-pass").value;
    const confirm = document.getElementById("reg-confirm-pass").value;
    const msg = document.getElementById("registerMessage");

    if (pass.length < 6) { return showAuthMsg(msg, "Password must be at least 6 characters!", "red"); }
    if (pass !== confirm) { return showAuthMsg(msg, "Passwords do not match!", "red"); }

    database.ref("users/" + user).once("value", (snapshot) => {
        if (snapshot.exists()) {
            return showAuthMsg(msg, "Username already taken!", "red");
        }

        database.ref("users/" + user).set({
            username: user,
            email: email,
            password: btoa(pass)
        }, (error) => {
            if (error) {
                showAuthMsg(msg, "Database write failure!", "red");
            } else {
                showAuthMsg(msg, "Registration Successful! Redirecting...", "green");
                setTimeout(() => {
                    document.getElementById("real-register-form").reset();
                    showSection('login-page');
                    msg.innerText = "";
                }, 1500);
            }
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value;
    const msg = document.getElementById("loginMessage");

    database.ref("users/" + user).once("value", (snapshot) => {
        const foundUser = snapshot.val();

        if (foundUser && foundUser.password === btoa(pass)) {
            currentUser = foundUser.username;
            localStorage.setItem("aero_logged_in", currentUser);
            
            showAuthMsg(msg, "Login successful! Welcome back.", "green");
            setTimeout(() => {
                document.getElementById("real-login-form").reset();
                syncAuthState();
                showSection('store-layer');
                msg.innerText = "";
            }, 1200);
        } else {
            return showAuthMsg(msg, "Invalid username or password!", "red");
        }
    });
}

function logout() {
    localStorage.removeItem("aero_logged_in");
    currentUser = null;
    syncAuthState();
    showSection('store-layer');
}

// ================= AUTHENTICATION CORES SYNC =================
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

// ================= CHECKOUT INTEGRATION WITH CLOUD PERSISTENCE =================
function checkout() {
    if (cart.length === 0) return alert("Cart is empty!🥲");
    
    const clientName = currentUser ? currentUser : prompt("Enter your name as Guest:");
    if (!clientName) return;

    const orderDetails = cart.map(i => `${i.name} × ${i.qty} = NT$${i.price * i.qty}`).join("\n");
    const overlay = document.getElementById("checkout-overlay");
    const loaderText = document.getElementById("loader-text");
    
    loaderText.innerText = "Encrypting Pipeline data...";
    overlay.style.display = "flex";

    const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const orderData = {
        customer: clientName,
        items: cart,
        totalAmount: total,
        date: timestamp
    };

    // Push structured purchase logs into global cloud architecture node
    database.ref("orders").push(orderData)
        .then(() => {
            loaderText.innerText = "Transmitting to EmailJS Gateways...";
            
            return emailjs.send("service_nb7uhuv", "template_2upy0gm", {
                name: clientName,
                product: orderDetails,
                price: total
            });
        })
        .then(() => {
            loaderText.innerHTML = "<span style='color: #00ff88;'>✅ Order Dispatched!</span>";
            
            setTimeout(() => {
                overlay.style.display = "none";
                alert("✅ Order sent and saved successfully!😄");
                cart = [];
                updateCartTotals();
                showSection('store-layer');
            }, 1000);
        })
        .catch((err) => {
            overlay.style.display = "none";
            console.error("Order error:", err);
            alert("❌ Failed to complete complete history sync sequence.");
        });
}

// ================= CLOUD ORDER HISTORY PARSER PORTAL =================
function loadOrderHistory() {
    const container = document.getElementById("historyLogsContainer");
    if (!container) return;

    container.innerHTML = `<p style="color:#000;">Syncing cloud receipt indexes...</p>`;

    database.ref("orders").once("value", (snapshot) => {
        container.innerHTML = "";
        let hasOrders = false;

        snapshot.forEach((childSnapshot) => {
            const order = childSnapshot.val();

            // Admins (Leonardo) see everything; standard users see only matching custom account matches
            const isOwner = currentUser && currentUser.toLowerCase() === "leonardo";
            const isCurrentCustomer = order.customer && currentUser && order.customer.toLowerCase() === currentUser.toLowerCase();
            const isGuestMatch = !currentUser && order.customer && order.customer.toLowerCase().includes("guest");

            if (isOwner || isCurrentCustomer || isGuestMatch) {
                hasOrders = true;

                let itemsHTML = "";
                if (Array.isArray(order.items)) {
                    order.items.forEach(i => {
                        itemsHTML += `<li style="margin-left: 15px; font-size: 0.9em; color:#222;">${i.name} (×${i.qty}) - NT$${i.price * i.qty}</li>`;
                    });
                }

                // Safely convert items to a URL-safe string that supports emojis perfectly
                const safeItemsJson = encodeURIComponent(JSON.stringify(order.items));

                container.innerHTML += `
                    <div style="background: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.6); padding: 15px; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); color:#000; margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 8px; border-bottom: 1px dashed rgba(0,0,0,0.1); padding-bottom: 5px;">
                            <strong>👤 Customer: ${order.customer} ${isOwner ? "<span style='color:#0055cc; font-size:0.85em;'>(Admin View)</span>" : ""}</strong>
                            <span style="font-size: 0.85em; color: #444;">🕒 ${order.date}</span>
                        </div>
                        <ul style="margin: 5px 0 10px 0; padding: 0; list-style-type: square;">
                            ${itemsHTML}
                        </ul>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold; margin-top: 5px;">
                            <span>Original Total: <span style="color:#005500;">NT$${order.totalAmount}</span></span>
                            <button onclick="reorderWithDiscount('${safeItemsJson}')" style="background: linear-gradient(#b2cceb, #ffffff); border: 1px solid #707070; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.85em; color: #000; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">🔄 Order Again (20% OFF)</button>
                        </div>
                    </div>`;
            }
        });

        if (!hasOrders) {
            container.innerHTML = `<p style="color:#000000; font-style: italic;">No verified cloud purchase history records match your profile context.</p>`;
        }
    });
}

// ================= REORDER INTERACTION PIPELINE ENGINE =================
function reorderWithDiscount(encodedItems) {
    try {
        // Decode the URL-safe data back into a structured array
        const pastItems = JSON.parse(decodeURIComponent(encodedItems));
        
        if (!pastItems || pastItems.length === 0) return;

        pastItems.forEach(pastItem => {
            // Apply 20% discount directly to individual item calculations
            const discountedPrice = Math.round(pastItem.price * 0.8);
            
            // Check if item is already present inside current checkout array session
            const existing = cart.find(i => i.name === pastItem.name);
            if (existing) {
                existing.qty += pastItem.qty;
            } else {
                cart.push({
                    name: pastItem.name,
                    price: discountedPrice,
                    qty: pastItem.qty
                });
            }
        });

        // Sync and refresh display engines
        updateCartTotals();
        
        // Play audio feedback cue to confirm tracking load pipeline sequence
        const sound = document.getElementById("dingSound");
        if (sound) sound.play();

        alert("🛒 Items loaded into your cart with a 20% discount applied!");
        showSection('cart-page');

    } catch (error) {
        console.error("Reorder tracking pipeline failure:", error);
        alert("❌ Failed to load past receipt records back into cart memory.");
    }
}

// ================= INITIALIZATION =================
window.onload = function() {
    const savedCart = localStorage.getItem("aero_cart");
    if (savedCart) cart = JSON.parse(savedCart);
    syncAuthState();
    updateCartTotals();
    applyTransparencySettings();
    
    const toggle = document.getElementById('transparencyToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            if (!this.checked) {
                localStorage.setItem('aeroTransparency', 'disabled');
            } else {
                localStorage.setItem('aeroTransparency', 'enabled');
            }
            applyTransparencySettings();
        });
    }
    
    document.getElementById('store-layer').style.display = 'block';
    document.getElementById('itemsContainer').style.display = 'flex';
    
    renderItems();
};
