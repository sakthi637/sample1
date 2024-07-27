document.addEventListener('DOMContentLoaded', () => {
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
  let originalProductData = [];
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Load JSON data for products
  fetch('products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      originalProductData = data.products; // Store the original product data
      displayProducts(originalProductData);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

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
          <li><i class="bx bx-heart"></i></li>
          <li><i class="bx bx-search"></i></li>
          <li id="sakthi"><i class="bx bx-cart cart-icon" data-title="${item.title}" data-price="${item.price}" data-img="${item.img}"></i></li>
        </ul>
      `;
      productCenter.appendChild(productItem);
    });

    // Add event listeners to cart icons
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
      icon.addEventListener('click', function() {
        const title = icon.getAttribute('data-title');
        const price = parseFloat(icon.getAttribute('data-price'));
        const img = icon.getAttribute('data-img');
        addToCart(title, price, img);
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

    // Add event listeners for increase/decrease buttons
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

    // Calculate and display total amount
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

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    // If the search input is empty, do nothing
    if (searchTerm.trim() === '') {
      return;
    }

    // Filter products based on the search term
    const filteredProducts = originalProductData.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );

    // Display filtered products or show an alert if no matches are found
    if (filteredProducts.length > 0) {
      displayProducts(filteredProducts);
    } else {
      alert('Item not found');
      displayProducts(originalProductData); // Show all products if no matches are found
    }
  }

  // Add event listeners for search button and Enter key
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Show all products when the search input is cleared
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      displayProducts(originalProductData);
    }
  });

  // Show cart items when clicking the cart icon in the header
  cartIconHeader.addEventListener('click', () => {
    cartItemsContainer.style.display = 'block';
  });

  // Close cart items container when clicking the close button
  closeCartButton.addEventListener('click', () => {
    cartItemsContainer.style.display = 'none';
  });

  // Add functionality for checkout button (you can customize this further)
  checkoutButton.addEventListener('click', () => {
    alert('Proceeding to checkout');
  });

  // Load cart items from local storage on page load
  loadCartFromLocalStorage();
});