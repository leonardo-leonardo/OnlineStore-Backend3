// ================= EMAILJS INIT =================
(function () {
    emailjs.init("w-EA-SaRhXquiCgRI");
})();

// ================= PRODUCTS =================
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
        img: "https://mirillis.com/blog/wp-content/uploads/2017/10/Increase-PC-Speed-1250x917.jpg",
        desc: "Full hardware and software diagnostic report to identify problems and bottlenecks."
    },
     {
        name: "Install A Mac OS in a Windows laptop/pc, with a virtual machine",
        price: 200,
        category: "install",
        img: "https://logos-world.net/wp-content/uploads/2023/03/Mac-Logo.png",
        desc: "Installing a Mac OS in your Windows pc, using VMware Workstation Pro. #I will also maximize the performance of the VM. *The performance may decrease if Mac doesn't support your graphics."
    },
];

// ================= CART =================
let cart = [];
let total = 0;

// ================= RENDER ITEMS =================
function renderItems() {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    const search = document.getElementById("searchBar").value.toLowerCase();
    const category = document.getElementById("categorySelect").value;

    items
        .filter(item =>
            (category === "all" || item.category === category) &&
            item.name.toLowerCase().includes(search)
        )
        .forEach(item => {
            // FIXED: Using backticks inside the function call to handle apostrophes
            container.innerHTML += `
                <div class="item" onclick="openProduct(\`${item.name}\`)" style="cursor:pointer;">
                    <img src="${item.img}">
                    <h3>${item.name}</h3>
                    <p>NT$${item.price}</p>
                    <button onclick="event.stopPropagation(); addToCart(\`${item.name}\`, ${item.price})">
                        Add to Cart
                    </button>
                </div>
            `;
        });
}

// ================= SECOND LAYER LOGIC =================
function openProduct(name) {
    const item = items.find(i => i.name === name);
    const storeLayer = document.getElementById("store-layer");
    const detailLayer = document.getElementById("detail-layer");
    const detailContent = document.getElementById("detailContent");

    detailContent.innerHTML = `
        <div style="display: flex; gap: 20px; align-items: start; color: #000;">
            <img src="${item.img}" style="width: 300px; border-radius: 8px;">
            <div>
                <h2>${item.name}</h2>
                <p style="font-size: 1.1em; margin: 10px 0; line-height: 1.4;">${item.desc || "No description available."}</p>
                <h3 style="color: #0044cc;">Price: NT$${item.price}</h3>
                
                <div style="margin-top: 20px;">
                    <input type="number" id="detail-qty" value="1" min="1" style="width:50px; padding: 5px;">
                    <button onclick="addToCart(\`${item.name}\`, ${item.price}, true)">
                        ✨ Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    storeLayer.style.display = "none";
    detailLayer.style.display = "block";
}

function closeDetails() {
    document.getElementById("store-layer").style.display = "block";
    document.getElementById("detail-layer").style.display = "none";
}

// ================= ADD TO CART =================
function addToCart(name, price, fromDetail = false) {
    let qty;
    if (fromDetail) {
        qty = parseInt(document.getElementById("detail-qty").value);
    } else {
        const qtyInput = document.getElementById("qty-" + name);
        qty = qtyInput ? parseInt(qtyInput.value) : 1;
    }

    const existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    total += price * qty;

    const sound = document.getElementById("dingSound");
    if (sound) sound.play();

    renderCart();
    saveCart();
}

// ================= CART RENDER =================
function renderCart() {
    const list = document.getElementById("cartList");
    if (!list) return;
    list.innerHTML = "";

    cart.forEach((item, index) => {
        list.innerHTML += `
            <li>
                ${item.name} × ${item.qty} = NT$${item.price * item.qty}
                <button onclick="removeItem(${index})">❌</button>
            </li>
        `;
    });

    document.getElementById("total").innerText = total;

    const paymentRule = document.getElementById("paymentRule");
    if (paymentRule) {
        paymentRule.innerText = total >= 500 ? "Cash Before Delivery" : "Cash Only";
    }
}

// ================= REMOVE ITEM =================
function removeItem(i) {
    total -= cart[i].price * cart[i].qty;
    cart.splice(i, 1);
    renderCart();
    saveCart();
}

// ================= SAVE/LOAD CART =================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
}

function loadCart() {
    const saved = localStorage.getItem("cart");
    const savedTotal = localStorage.getItem("total");

    if (saved) cart = JSON.parse(saved);
    if (savedTotal) total = parseInt(savedTotal) || 0;

    renderCart();
}

// ================= EMAILJS CHECKOUT =================
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!🥲");
        return;
    }

    const name = prompt("Enter your name");
    if (!name) return;

    const orderDetails = cart
        .map(i => `${i.name} × ${i.qty} = NT$${i.price * i.qty}`)
        .join("\n");

    emailjs.send("service_nb7uhuv", "template_2upy0gm", {
        name: name,
        product: orderDetails,
        price: total
    })
    .then(() => {
        alert("✅ Order sent successfully!😄");
        cart = [];
        total = 0;
        saveCart();
        renderCart();
    })
    .catch((err) => {
        console.log("EMAIL ERROR:", err);
        alert("❌ Failed to send order");
    });
}

// ================= INIT =================
loadCart();
renderItems();
