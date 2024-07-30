document.addEventListener('DOMContentLoaded', () => {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.querySelector('body').insertAdjacentHTML('afterbegin', data);
      initializeHeader();
    })
    .catch(error => console.error('Error loading header:', error));
  
  function initializeHeader() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const productCenter = document.querySelector('.product-center');
    const cartCountElement = document.getElementById('cart-count');
    const cartIconHeader = document.querySelector('.icons .bx-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemsDiv = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const closeCartButton = document.getElementById('close-cart');
    const checkoutButton = document.getElementById('checkout');
    const wishCountElement = document.getElementById('wish-count');
    const wishlistIcon = document.querySelector('.icons .bx-heart');
    const wishlistItemsContainer = document.getElementById('wishlist-items-container');
    const wishlistItemsDiv = document.getElementById('wishlist-items');
    const closeWishlistButton = document.getElementById('close-wishlist');
    let originalProductData = [];
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

    // Load JSON data for products
    fetch('womens-products.json')
      .then(response => response.json())
      .then(data => {
        originalProductData = data.products;
        displayProducts(originalProductData);
      })
      .catch(error => console.error('Error fetching products:', error));

    function displayProducts(data) {
      productCenter.innerHTML = '';
      data.forEach(item => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
          <div class="overlay">
            <a href="${item.link}" class="product-thumb">
              <img src="${item.img}" alt="${item.title}" />
            </a>
            ${item.discount ? `<span class="discount">${item.discount}%</span>` : ''}
          </div>
          <div class="product-info">
            <span>${item.category}</span>
            <a href="${item.link}">${item.title}</a>
            <h4>$${item.price}</h4>
          </div>
          <ul class="icons">
            <li><i class="bx bx-heart sakthi3" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}"></i></li>
            <li><i class="bx bx-search"></i></li>
            <li><i class="bx bx-cart cart-icon" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}"></i></li>
          </ul>
        `;
        productCenter.appendChild(productItem);
      });

      const cartIcons = document.querySelectorAll('.cart-icon');
      cartIcons.forEach(icon => {
        icon.addEventListener('click', function() {
          const title = icon.getAttribute('data-title');
          const price = parseFloat(icon.getAttribute('data-price'));
          const img = icon.getAttribute('data-img');
          addToCart(title, price, img);
        });
      });

      const wishIcons = document.querySelectorAll('.sakthi3');
      wishIcons.forEach(icon => {
        icon.addEventListener('click', function() {
          const title = icon.getAttribute('data-title');
          const price = parseFloat(icon.getAttribute('data-price'));
          const img = icon.getAttribute('data-img');
          addToWishlist(title, price, img);
        });
      });
    }

    function addToCart(title, price, img) {
      const existingItem = cartItems.find(item => item.title === title);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push({ title, price, img, quantity: 1 });
      }
      updateCart();
      saveCartToLocalStorage();
    }

    function addToWishlist(title, price, img) {
      const existingItem = wishlistItems.find(item => item.title === title);
      if (!existingItem) {
        wishlistItems.push({ title, price, img });
        updateWishlist();
        saveWishlistToLocalStorage();
      }
    }

    function removeFromWishlist(title) {
      wishlistItems = wishlistItems.filter(item => item.title !== title);
      updateWishlist();
      saveWishlistToLocalStorage();
    }

    function updateCart() {
      cartCountElement.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
      updateCartItems();
    }

    function updateCartItems() {
      cartItemsDiv.innerHTML = '';
      cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <p>$${item.price} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="quantity-controls">
            <button class="decrease-quantity" data-title="${item.title}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase-quantity" data-title="${item.title}">+</button>
          </div>
        `;
        cartItemsDiv.appendChild(cartItem);
      });

      const decreaseButtons = document.querySelectorAll('.decrease-quantity');
      const increaseButtons = document.querySelectorAll('.increase-quantity');

      decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
          const title = button.getAttribute('data-title');
          updateCartItemQuantity(title, -1);
        });
      });

      increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
          const title = button.getAttribute('data-title');
          updateCartItemQuantity(title, 1);
        });
      });

      updateTotalAmount();
    }

    function updateCartItemQuantity(title, change) {
      const item = cartItems.find(item => item.title === title);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          cartItems = cartItems.filter(item => item.title !== title);
        }
        updateCart();
        saveCartToLocalStorage();
      }
    }

    function updateTotalAmount() {
      const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
    }

    function saveCartToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function loadCartFromLocalStorage() {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (savedCartItems) {
        cartItems = savedCartItems;
        updateCart();
      }
    }

    function updateWishlist() {
      wishCountElement.textContent = wishlistItems.length;
      updateWishlistItems();
    }

    function updateWishlistItems() {
      wishlistItemsDiv.innerHTML = '';
      wishlistItems.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <div class="wishlist-item-details">
            <h4>${item.title}</h4>
            <p>$${item.price}</p>
            <button class="remove-wishlist-item" data-title="${item.title}">
              <i class="bx bx-trash"></i> Remove
            </button>
          </div>
        `;
        wishlistItemsDiv.appendChild(wishlistItem);
      });

      const removeButtons = document.querySelectorAll('.remove-wishlist-item');
      removeButtons.forEach(button => {
        button.addEventListener('click', function() {
          const title = button.getAttribute('data-title');
          removeFromWishlist(title);
        });
      });
    }

    function saveWishlistToLocalStorage() {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }

    function handleSearch() {
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm.trim() === '') {
        return;
      }
      const filteredProducts = originalProductData.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
      if (filteredProducts.length > 0) {
        displayProducts(filteredProducts);
      } else {
        alert('Item not found');
        displayProducts(originalProductData);
      }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() === '') {
        displayProducts(originalProductData);
      }
    });

    cartIconHeader.addEventListener('click', () => {
      cartItemsContainer.style.display = 'block';
    });

    closeCartButton.addEventListener('click', () => {
      cartItemsContainer.style.display = 'none';
    });

    wishlistIcon.addEventListener('click', () => {
      wishlistItemsContainer.style.display = 'block';
    });

    closeWishlistButton.addEventListener('click', () => {
      wishlistItemsContainer.style.display = 'none';
    });

    checkoutButton.addEventListener('click', () => {
      alert('Thank you for your purchase!');
      cartItems = [];
      updateCart();
      saveCartToLocalStorage();
      cartItemsContainer.style.display = 'none';
    });

    loadCartFromLocalStorage();
    updateWishlist();
  }
});
