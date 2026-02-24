// ===== GESTION DU SLIDER SIMPLE =====
function rotatePromo() {
    const promos = [
        '🎉 Offre Spéciale : Jusqu\'à 30% de réduction sur les smartphones !',
        '💻 Nouveautés : Les derniers MacBook Pro et Dell XPS disponibles',
        '🎧 Accessoires Premium : Complétez votre appareil avec nos produits de qualité'
    ];
    
    let currentPromo = 0;
    const promoElement = document.querySelector('.promo-text');
    
    if (promoElement) {
        setInterval(() => {
            currentPromo = (currentPromo + 1) % promos.length;
            promoElement.textContent = promos[currentPromo];
        }, 5000);
    }
}

// ===== BASE DE DONNÉES DE PRODUITS =====
const products = [
    {
        id: 1,
        name: 'iPhone 15',
        category: 'smartphone',
        price: 999,
        image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
        description: 'Dernier modèle d\'Apple avec écran OLED et processeur A17 Pro. Caméra 48MP haute résolution.',
        stock: 15
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24',
        category: 'smartphone',
        price: 899,
        image: 'https://fr.shopping.rakuten.com/pictures/019ac4dd-bbb9-76ea-8529-cff07ccb0b91_L_NOPAD.jpg',
        description: 'Smartphone Android flagship avec écran 6.1" et batterie 4000mAh. Camera AI révolutionnaire.',
        stock: 20
    },
    {
        id: 3,
        name: 'MacBook Pro 14"',
        category: 'ordinateur',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        description: 'Ordinateur portable professionnel avec processeur M3 Max, 16GB RAM, 512GB SSD.',
        stock: 8
    },
    {
        id: 4,
        name: 'Dell XPS 13',
        category: 'ordinateur',
        price: 1299,
        image: 'https://fr.shopping.rakuten.com/pictures/0199cc57-bd50-7968-9904-f9213fe4fa12_L_NOPAD.jpg',
        description: 'Ultraportable de 13 pouces avec Intel Core i7, 16GB RAM, écran OLED 4K.',
        stock: 12
    },
    {
        id: 5,
        name: 'AirPods Pro',
        category: 'accessoire',
        price: 249,
        image: 'https://fr.shopping.rakuten.com/pictures/019bac00-1722-706b-b1c6-4d23e0080f04_L_NOPAD.jpg',
        description: 'Écouteurs sans fil avec réduction de bruit active et son spatial immersif.',
        stock: 50
    },
    {
        id: 6,
        name: 'Chargeur USB-C',
        category: 'accessoire',
        price: 29,
        image: 'https://fr.shopping.rakuten.com/pictures/01985fc8-88c2-7f4b-9198-2b7b29f8a095_L_NOPAD.jpg',
        description: 'Chargeur rapide 65W compatible avec tous les appareils USB-C.',
        stock: 100
    },
    {
        id: 7,
        name: 'iPad Air',
        category: 'ordinateur',
        price: 599,
        image: 'https://fr.shopping.rakuten.com/pictures/019648fa-3710-706e-a0ec-d26a436b0291_L_NOPAD.jpg',
        description: 'Tablette 11 pouces avec processeur M1, écran Liquid Retina, support Apple Pencil.',
        stock: 25
    },
    {
        id: 8,
        name: 'Sony WH-1000XM5',
        category: 'accessoire',
        price: 379,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        description: 'Casque audio sans fil haut de gamme avec réduction de bruit et autonomie 30h.',
        stock: 18
    }
];

// ===== GESTION DU PANIER =====
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.save();
        this.updateCartUI();
        
        // Google Analytics - Ajouter au panier
        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', {
                'items': [{
                    'item_id': product.id,
                    'item_name': product.name,
                    'price': product.price,
                    'quantity': quantity
                }],
                'value': product.price * quantity,
                'currency': 'EUR'
            });
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateCartUI();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTaxAmount() {
        return this.getTotal() * 0.20; // TVA 20%
    }

    getTotalWithTax() {
        return this.getTotal() + this.getTaxAmount();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const itemCount = this.items.reduce((total, item) => total + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = itemCount);
    }

    clear() {
        this.items = [];
        this.save();
        this.updateCartUI();
    }
}

// ===== INITIALISATION =====
const cart = new Cart();

// Initialiser le compteur du panier au chargement
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartUI();

    // Démarrer la rotation du slider promo
    rotatePromo();

    // Déterminer la page active et charger le contenu approprié
    if (document.getElementById('productsContainer')) {
        loadProducts();
    } else if (document.getElementById('productDetailContainer')) {
        loadProductDetail();
    } else if (document.getElementById('cartItemsContainer')) {
        displayCart();
    }
});

// ===== PAGE D'ACCUEIL - AFFICHER LES PRODUITS =====
function loadProducts() {
    const container = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    function renderProducts(filteredProducts) {
        if (filteredProducts.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; grid-column: 1 / -1;">Aucun produit trouvé.</p>';
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image"><img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;"></div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description.substring(0, 50)}...</p>
                    <div class="product-price">${product.price.toFixed(2)} €</div>
                    <div class="product-actions">
                        <button class="btn-view" onclick="viewProductDetail(${product.id})">Voir</button>
                        <button class="btn-add" onclick="addToCartFromList(${product.id})">Ajouter</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        let filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProducts(filtered);
    }

    // Afficher tous les produits initialement
    renderProducts(products);

    // Ajouter les événements de filtrage
    searchInput.addEventListener('keyup', filterAndRender);
    categoryFilter.addEventListener('change', filterAndRender);
}

// ===== PAGE D'ACCUEIL - AJOUTER AU PANIER =====
function addToCartFromList(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.addItem(product);
        showNotification(`${product.name} ajouté au panier!`, 'success');
    }
}

// ===== PAGE DÉTAIL - AFFICHER LE DÉTAIL DU PRODUIT =====
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('productDetailContainer').innerHTML = 
            '<p style="text-align: center; padding: 2rem;">Produit non trouvé.</p>';
        return;
    }

    // Google Analytics - Voir le détail d'un produit
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            'items': [{
                'item_id': product.id,
                'item_name': product.name,
                'price': product.price,
                'item_category': product.category
            }],
            'value': product.price,
            'currency': 'EUR'
        });
    }

    const container = document.getElementById('productDetailContainer');
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image"><img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"></div>
            <div class="product-detail-info">
                <div class="product-detail-category">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-detail-price">${product.price.toFixed(2)} €</div>
                <p class="product-detail-description">${product.description}</p>
                <p><strong>Stock disponible:</strong> ${product.stock} unités</p>
                <div class="quantity-selector">
                    <label for="quantity">Quantité:</label>
                    <input type="number" id="quantity" min="1" max="${product.stock}" value="1">
                </div>
                <button class="btn-add-detail" onclick="addToCartFromDetail(${product.id})">
                    Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

// ===== PAGE DÉTAIL - AJOUTER AU PANIER =====
function addToCartFromDetail(productId) {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value) || 1;
    const product = products.find(p => p.id === productId);

    if (product) {
        cart.addItem(product, quantity);
        showNotification(`${quantity}x ${product.name} ajouté au panier!`, 'success');
        quantityInput.value = 1;
    }
}

// ===== ACCÉDER AU DÉTAIL D'UN PRODUIT =====
function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// ===== PAGE PANIER - AFFICHER LE CONTENU DU PANIER =====
function displayCart() {
    const container = document.getElementById('cartItemsContainer');

    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <p>Votre panier est vide</p>
                <a href="index.html" class="btn-continue">Retour aux articles</a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    container.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;"></div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
                <p style="color: #007bff; font-weight: bold;">${item.price.toFixed(2)} € l'unité</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" min="1" value="${item.quantity}" 
                       onchange="updateCartItem(${item.id}, this.value)">
            </div>
            <div class="cart-item-price">
                <p style="margin-bottom: 0.5rem;">${(item.price * item.quantity).toFixed(2)} €</p>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">Supprimer</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

// ===== PAGE PANIER - METTRE À JOUR UN ARTICLE =====
function updateCartItem(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        cart.updateQuantity(productId, quantity);
        displayCart();
    }
}

// ===== PAGE PANIER - SUPPRIMER UN ARTICLE =====
function removeFromCart(productId) {
    const item = cart.items.find(i => i.id === productId);
    if (item) {
        cart.removeItem(productId);
        showNotification(`${item.name} supprimé du panier`, 'success');
        displayCart();
    }
}

// ===== PAGE PANIER - METTRE À JOUR LE RÉSUMÉ =====
function updateCartSummary() {
    const subtotal = cart.getTotal();
    const tax = cart.getTaxAmount();
    const total = cart.getTotalWithTax();

    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
    document.getElementById('tax').textContent = tax.toFixed(2) + ' €';
    document.getElementById('total').textContent = total.toFixed(2) + ' €';
}

// ===== PAIEMENT =====
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});

function checkout() {
    if (cart.items.length === 0) {
        showNotification('Votre panier est vide', 'error');
        return;
    }

    // Google Analytics - Commencer le paiement
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'value': cart.getTotalWithTax(),
            'currency': 'EUR',
            'items': cart.items.map(item => ({
                'item_id': item.id,
                'item_name': item.name,
                'price': item.price,
                'quantity': item.quantity
            }))
        });
    }

    showNotification('Redirection vers le paiement...', 'success');
    
    // Simule un délai avant la redirection
    setTimeout(() => {
        // Google Analytics - Achat complété
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                'transaction_id': 'TXN_' + Date.now(),
                'value': cart.getTotalWithTax(),
                'currency': 'EUR',
                'tax': cart.getTaxAmount(),
                'shipping': 0,
                'items': cart.items.map(item => ({
                    'item_id': item.id,
                    'item_name': item.name,
                    'price': item.price,
                    'quantity': item.quantity
                }))
            });
        }

        cart.clear();
        showNotification('Commande confirmée!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    
    const mainElement = document.querySelector('main');
    mainElement.insertBefore(notification, mainElement.firstChild);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
