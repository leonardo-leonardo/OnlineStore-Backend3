// ================= EMAILJS INIT =================
(function () {
    emailjs.init("YOUR_PUBLIC_KEY"); 
})();

// ================= PRODUCTS =================
const items = [
    { name: "Flappy Bird Game", price: 5, category: "games", img: "https://th.bing.com/th/id/R.567e72625ae82468e5116ce92dc24bde?rik=kqrAxxOrUhrXPg&riu=http%3a%2f%2fassets1.ignimgs.com%2f2014%2f01%2f31%2fflappy-bird-buttonjpg-e984c2.jpg&ehk=vGlEeny7R2EyaMcNMlj4nt4YJPLB2BBtN8wG2799dWE%3d&risl=&pid=ImgRaw&r=0" },
    { name: "Make your laptop better performance", price: 100, category: "optimizing", img: "https://mirillis.com/blog/wp-content/uploads/2017/10/Increase-PC-Speed-1250x917.jpg" },
    { name: "Make your laptop use less storage", price: 100, category: "optimizing", img: "https://iphonewired.com/wp-content/uploads/2022/11/1669772263_maxresdefault.jpg" },
    { name: "Make your laptop best efficiency", price: 50, category: "optimizing", img: "https://static1.howtogeekimages.com/wordpress/wp-content/uploads/2021/09/battery_saver_hero_3.jpg" }
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
        .filter(i =>
            (category === "all" || i.category === category) &&
            i.name.toLowerCase().includes(search)
        )
        .forEach(item => {
            container.innerHTML += `
                <div class="item">
                    <img src="${item.img}">
                    <h3>${item.name}</h3>
                    <p>NT$${item.price}</p>

                    <input type="number" id="qty-${item.name}" value="1" min="1">

                    <button onclick="addToCart('${item.name}', ${item.price})">
                        Add to Cart
                    </button>
                </div>
            `;
        });
}

// ================= CART FUNCTIONS =================
function addToCart(name, price) {
    const qty = parseInt(document.getElementById("qty-" + name).value);

    const existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    total += price * qty;

    document.getElementById("dingSound").play();

    renderCart();
    saveCart();
}

// ================= CART UI =================
function renderCart() {
    const list = document.getElementById("cartList");
    list.innerHTML = "";

    cart.forEach((item, i) => {
        list.innerHTML += `
            <li>
                ${item.name} × ${item.qty} = NT$${item.price * item.qty}
                <button onclick="removeItem(${i})">❌</button>
            </li>
        `;
    });

    document.getElementById("total").innerText = total;

    document.getElementById("paymentRule").innerText =
        total >= 500 ? "Cash Before Delivery" : "Cash Only";
}

// ================= REMOVE =================
function removeItem(i) {
    total -= cart[i].price * cart[i].qty;
    cart.splice(i, 1);
    renderCart();
    saveCart();
}

// ================= SAVE =================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", total);
}

function loadCart() {
    const saved = localStorage.getItem("cart");
    const savedTotal = localStorage.getItem("total");

    if (saved) cart = JSON.parse(saved);
    if (savedTotal) total = parseInt(savedTotal);

    renderCart();
}

// ================= EMAILJS CHECKOUT =================
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const name = prompt("Enter your name");
    if (!name) return;

    const order = cart
        .map(i => `${i.name} × ${i.qty} = NT$${i.price * i.qty}`)
        .join("\n");

    emailjs.send("service_nb7uhuv", "template_2upy0gm", {
        name: name,
        product: order,
        price: total
    })
    .then(() => {
        alert("✅ Order sent!");

        cart = [];
        total = 0;

        saveCart();
        renderCart();
    })
    .catch(err => {
        console.log(err);
        alert("❌ Failed to send order");
    });
}

// ================= AUTH (basic backend calls kept) =================
const API_URL = "https://your-backend-url.com";

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    alert("Registered!");
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login success");
    } else {
        alert("Login failed");
    }
}

// ================= INIT =================
loadCart();
renderItems();
