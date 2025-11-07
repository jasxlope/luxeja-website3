console.log("Luxeja website loaded ✨");

// Hamburger toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('show');
}

// Search function
function searchSite() {
    const query = document.getElementById('searchInput').value.toLowerCase();

    if(query.includes("about")) {
        window.location.href = "about.html";
    } else if(query.includes("contact")) {
        window.location.href = "contact.html";
    } else if(query.includes("shop")) {
        window.location.href = "shop.html";
    } else if(query.includes("home")) {
        window.location.href = "index.html";
    } else {
        alert("No results found.");
    }
}

// Contact form submission
function showMessage(e) {
  e.preventDefault();
  document.querySelector('.form-message').style.display = 'block';
  e.target.reset();
}

/* -------------------------------
   WOMENS PAGE FILTER FUNCTIONALITY
---------------------------------*/

// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Grab all filter options
    const filterGroups = document.querySelectorAll('.filters .dropdown');
    const products = document.querySelectorAll('.product-card');

    filterGroups.forEach(group => {
        const options = group.querySelectorAll('li');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const filterType = group.querySelector('span').innerText.split(' ')[0].toLowerCase();
                const filterValue = option.innerText.toLowerCase();

                products.forEach(product => {
                    const productName = product.querySelector('h3').innerText.toLowerCase();
                    // Simple filter: check if product name contains the selected filter value
                    if (productName.includes(filterValue)) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    });

    // Optional: click outside to reset filter
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.filters')) {
            products.forEach(product => product.style.display = 'block');
        }
    });

});

