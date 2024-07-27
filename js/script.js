document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const compNewSectionContent = document.getElementById('comp-new-section-content');
  const wishContent = document.querySelector('#wish .wish-content');
  const compNewError = document.getElementById('comp-new-error');
  const wishError = document.getElementById('wish-error');
  const newSectionContent = document.getElementById('new-section-content');
  const third = document.getElementById('third');
  
  // Select all sections except hero, comp-new-section, wish, and footer
  const allSections = document.querySelectorAll('section:not(#hero):not(#comp-new-section):not(#wish):not(footer)');

  let originalCompData = []; // To store the original comp data
  let originalWishData = []; // To store the original wish data

  // Load JSON data for comp-new-section
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      originalCompData = data; // Store the original comp data
      displayCompData(data);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

  // Load JSON data for wish section
  fetch('wish-data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      originalWishData = data; // Store the original wish data
      displayWishData(data);
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

  function displayCompData(data) {
    compNewSectionContent.innerHTML = '';
    let hasItems = false;
    data.forEach(category => {
      const categorySpan = document.createElement('span');
      categorySpan.innerHTML = `<img src="bgs/Rectangle 21 voil.png" alt="line" class="line2"> Categories For ${category.category}`;
      compNewSectionContent.appendChild(categorySpan);

      const compRow = document.createElement('div');
      compRow.className = 'comp-row';

      category.items.forEach(item => {
        const compColumn = document.createElement('div');
        compColumn.className = 'comp-column';
        compColumn.innerHTML = `
          <img src="${item.img}" alt="${item.title}">
          <h3>${item.title}</h3>
          <a href="${item.link}"><p>Explore Now !</p></a>
          <i class="fas fa-arrow-right arrow-icon"></i>
        `;
        compRow.appendChild(compColumn);
        hasItems = true;
      });

      compNewSectionContent.appendChild(compRow);
    });

    if (!hasItems) {
      document.querySelectorAll('.comp-row').forEach(row => row.style.display = 'none');
      compNewError.style.display = 'block';
    } else {
      document.querySelectorAll('.comp-row').forEach(row => row.style.display = 'flex');
      compNewError.style.display = 'none';
    }
  }

  function displayWishData(data) {
    const wishRow = document.createElement('div');
    wishRow.className = 'wish-row';
    data.forEach(item => {
      const wishColumn = document.createElement('div');
      wishColumn.className = 'wish-column';
      wishColumn.innerHTML = `
        <i class="wishlist-icon fa fa-heart"></i>
        <img src="${item.img}" alt="${item.title}">
        <h3>${item.title}</h3>
        <a href="#"><p>${item.brand}</p></a>
        <p class="dollar">${item.price}</p>
      `;
      wishRow.appendChild(wishColumn);
    });
    wishContent.querySelector('.wish-row')?.remove(); // Remove old wish-row if exists
    wishContent.appendChild(wishRow);
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    // If the search input is empty, do nothing
    if (searchTerm.trim() === '') {
      return;
    }

    // Hide all sections except hero, comp-new-section, wish, and footer
    allSections.forEach(section => section.style.display = 'none');

    // Filter and display data for comp-new-section
    const filteredCompData = originalCompData.map(category => {
      return {
        category: category.category,
        items: category.items.filter(item => item.title.toLowerCase().includes(searchTerm))
      };
    }).filter(category => category.items.length > 0);

    const filteredWishData = originalWishData.filter(item =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm)
    );

    if (filteredCompData.length > 0) {
      displayCompData(filteredCompData);
      compNewSectionContent.parentElement.style.display = 'block';
      compNewError.style.display = 'none';
      // Scroll to the comp-new-section
      compNewSectionContent.parentElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      compNewSectionContent.parentElement.style.display = 'none';
    }

    if (filteredWishData.length > 0) {
      displayWishData(filteredWishData);
      wishContent.parentElement.style.display = 'block';
      wishError.style.display = 'none';
      // Scroll to the wish section
      wishContent.parentElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      wishContent.parentElement.style.display = 'none';
    }

    // If no matching data is found in both sections, show all sections and display alert
    if (filteredCompData.length === 0 && filteredWishData.length === 0) {
      allSections.forEach(section => section.style.display = 'block');
      document.getElementById('hero').style.display = 'block';
      document.getElementById('comp-new-section').style.display = 'block';
      document.getElementById('wish').style.display = 'block';
      document.querySelector('footer').style.display = 'block';
      document.getElementById('third').style.display = 'flex';
      document.getElementById('new-section').style.display = 'flex';
      alert('Item not found');
    }

    // Show the relevant sections if there are matches
    document.getElementById('hero').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
  }

  // Add event listeners for search button and Enter key
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Show all sections when the search input is cleared
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      // Show all sections
      allSections.forEach(section => section.style.display = 'block');
      document.getElementById('hero').style.display = 'block';
      document.getElementById('comp-new-section').style.display = 'block';
      document.getElementById('wish').style.display = 'block';
      document.querySelector('footer').style.display = 'block';
      document.getElementById('third').style.display = 'flex';
      document.getElementById('new-section').style.display = 'flex';
    
      // Also re-display original data for comp-new-section and wish sections
      displayCompData(originalCompData);
      displayWishData(originalWishData);
    }
  });
});
