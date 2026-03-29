console.log("Luxeja website loaded");

function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");

    if (navLinks) {
        navLinks.classList.toggle("show");
    }
}

function searchSite() {
    const searchInput = document.querySelector("#searchInput");

    if (!searchInput) {
        return;
    }

    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        alert("Please enter a search term.");
        return;
    }

    const routes = [
        { terms: ["home"], href: "index.html" },
        { terms: ["collection", "collections"], href: "collections.html" },
        { terms: ["shop", "store"], href: "shop.html" },
        { terms: ["women", "womens", "women's"], href: "womens.html" },
        { terms: ["men", "mens", "men's"], href: "mens.html" },
        { terms: ["accessories", "accessory"], href: "accessories.html" },
        { terms: ["about"], href: "about.html" },
        { terms: ["contact"], href: "contact.html" }
    ];

    const match = routes.find((route) =>
        route.terms.some((term) => query.includes(term))
    );

    if (match) {
        window.location.href = match.href;
        return;
    }

    alert("No results found.");
}

function showMessage(e) {
    e.preventDefault();

    const message = document.querySelector(".form-message");
    if (message) {
        message.style.display = "block";
    }

    e.target.reset();
}

document.addEventListener("DOMContentLoaded", () => {
    const filterGroups = document.querySelectorAll(".filters .dropdown");
    const products = document.querySelectorAll(".product-card");

    filterGroups.forEach((group) => {
        const options = group.querySelectorAll("li");

        options.forEach((option) => {
            option.addEventListener("click", () => {
                const filterValue = option.innerText.toLowerCase();

                products.forEach((product) => {
                    const productName = product.querySelector("h3")?.innerText.toLowerCase() || "";
                    product.style.display = productName.includes(filterValue) ? "block" : "none";
                });
            });
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".filters")) {
            products.forEach((product) => {
                product.style.display = "block";
            });
        }
    });

    document.querySelectorAll("#searchInput").forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                searchSite();
            }
        });
    });

    const womenSearchFilter = document.querySelector("#womenSearchFilter");
    const womenSizeFilter = document.querySelector("#womenSizeFilter");
    const womenColorFilter = document.querySelector("#womenColorFilter");
    const womenCards = document.querySelectorAll(".women-product-card");
    const womenFilterSummary = document.querySelector("#womenFilterSummary");

    if (womenSearchFilter && womenSizeFilter && womenColorFilter && womenCards.length) {
        const applyWomenFilters = () => {
            const searchValue = womenSearchFilter.value.trim().toLowerCase();
            const sizeValue = womenSizeFilter.value;
            const colorValue = womenColorFilter.value;
            let visibleCount = 0;

            womenCards.forEach((card) => {
                const name = card.dataset.name?.toLowerCase() || "";
                const size = card.dataset.size || "";
                const color = card.dataset.color || "";

                const matchesSearch = !searchValue || name.includes(searchValue);
                const matchesSize = sizeValue === "all" || size === sizeValue;
                const matchesColor = colorValue === "all" || color === colorValue;
                const isVisible = matchesSearch && matchesSize && matchesColor;

                card.style.display = isVisible ? "block" : "none";

                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (womenFilterSummary) {
                womenFilterSummary.textContent = visibleCount === womenCards.length
                    ? "Showing all pieces"
                    : visibleCount === 0
                        ? "No pieces match your filters"
                        : `Showing ${visibleCount} piece${visibleCount === 1 ? "" : "s"}`;
            }
        };

        [womenSearchFilter, womenSizeFilter, womenColorFilter].forEach((control) => {
            control.addEventListener("input", applyWomenFilters);
            control.addEventListener("change", applyWomenFilters);
        });

        applyWomenFilters();
    }
});
