// State management
let books = [];
let userBooks = {};
let currentFilters = {
    status: 'all',
    genre: 'all',
    theme: 'all',
    search: ''
};
let currentSort = 'title-asc';
let currentBookId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadBooks();
    loadUserData();
    populateFilters();
    setupEventListeners();
    renderBooks();
    updateStats();
});

// Load books from JSON
async function loadBooks() {
    try {
        const response = await fetch('books.json');
        books = await response.json();
    } catch (error) {
        console.error('Error loading books:', error);
        showError('Failed to load books. Please refresh the page.');
    }
}

// Load user data from localStorage
function loadUserData() {
    const stored = localStorage.getItem('yaBookTracker');
    if (stored) {
        userBooks = JSON.parse(stored);
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('yaBookTracker', JSON.stringify(userBooks));
    updateStats();
    renderBooks();
}

// Populate filter dropdowns
function populateFilters() {
    const genres = [...new Set(books.map(book => book.genre))].sort();
    const themes = [...new Set(books.flatMap(book => book.themes))].sort();

    const genreFilter = document.getElementById('genre-filter');
    const themeFilter = document.getElementById('theme-filter');

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        themeFilter.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Filters
    document.getElementById('status-filter').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        renderBooks();
    });

    document.getElementById('genre-filter').addEventListener('change', (e) => {
        currentFilters.genre = e.target.value;
        renderBooks();
    });

    document.getElementById('theme-filter').addEventListener('change', (e) => {
        currentFilters.theme = e.target.value;
        renderBooks();
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        renderBooks();
    });

    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    // Sort
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderBooks();
    });

    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('book-modal');
        if (e.target === modal) {
            closeModal();
        }
    });

    document.getElementById('mark-read').addEventListener('click', markAsRead);
    document.getElementById('mark-unread').addEventListener('click', markAsUnread);

    // Star rating
    document.querySelectorAll('#modal-rating .star').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            setRating(currentBookId, rating);
        });

        star.addEventListener('mouseenter', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            highlightStars(rating);
        });
    });

    document.getElementById('modal-rating').addEventListener('mouseleave', () => {
        if (currentBookId && userBooks[currentBookId]) {
            highlightStars(userBooks[currentBookId].rating || 0);
        } else {
            highlightStars(0);
        }
    });
}

// Reset filters
function resetFilters() {
    currentFilters = {
        status: 'all',
        genre: 'all',
        theme: 'all',
        search: ''
    };
    document.getElementById('status-filter').value = 'all';
    document.getElementById('genre-filter').value = 'all';
    document.getElementById('theme-filter').value = 'all';
    document.getElementById('search-input').value = '';
    renderBooks();
}

// Filter books
function filterBooks() {
    return books.filter(book => {
        // Status filter
        if (currentFilters.status !== 'all') {
            const isRead = userBooks[book.id]?.read || false;
            if (currentFilters.status === 'read' && !isRead) return false;
            if (currentFilters.status === 'unread' && isRead) return false;
        }

        // Genre filter
        if (currentFilters.genre !== 'all' && book.genre !== currentFilters.genre) {
            return false;
        }

        // Theme filter
        if (currentFilters.theme !== 'all' && !book.themes.includes(currentFilters.theme)) {
            return false;
        }

        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search;
            const titleMatch = book.title.toLowerCase().includes(searchLower);
            const authorMatch = book.author.toLowerCase().includes(searchLower);
            if (!titleMatch && !authorMatch) return false;
        }

        return true;
    });
}

// Sort books
function sortBooks(booksToSort) {
    const sorted = [...booksToSort];

    switch (currentSort) {
        case 'title-asc':
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'author-asc':
            sorted.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'author-desc':
            sorted.sort((a, b) => b.author.localeCompare(a.author));
            break;
        case 'year-asc':
            sorted.sort((a, b) => a.year - b.year);
            break;
        case 'year-desc':
            sorted.sort((a, b) => b.year - a.year);
            break;
        case 'rating-desc':
            sorted.sort((a, b) => {
                const ratingA = userBooks[a.id]?.rating || 0;
                const ratingB = userBooks[b.id]?.rating || 0;
                return ratingB - ratingA;
            });
            break;
        case 'rating-asc':
            sorted.sort((a, b) => {
                const ratingA = userBooks[a.id]?.rating || 0;
                const ratingB = userBooks[b.id]?.rating || 0;
                return ratingA - ratingB;
            });
            break;
    }

    return sorted;
}

// Render books
function renderBooks() {
    const container = document.getElementById('books-container');
    const filteredBooks = filterBooks();
    const sortedBooks = sortBooks(filteredBooks);

    if (sortedBooks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No books found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sortedBooks.map(book => createBookCard(book)).join('');

    // Add click listeners to book cards
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = parseInt(card.dataset.bookId);
            openModal(bookId);
        });
    });
}

// Create book card HTML
function createBookCard(book) {
    const userData = userBooks[book.id] || { read: false, rating: 0 };
    const isRead = userData.read;
    const rating = userData.rating || 0;

    const ratingStars = rating > 0 ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '';

    return `
        <div class="book-card ${isRead ? 'read' : 'unread'}" data-book-id="${book.id}">
            <span class="status-badge ${isRead ? 'read' : 'unread'}">${isRead ? 'Read' : 'To Read'}</span>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <p class="book-year">${book.year}</p>
            <span class="book-genre">${book.genre}</span>
            <div class="book-themes">
                ${book.themes.slice(0, 3).map(theme => `
                    <span class="theme-tag">${theme}</span>
                `).join('')}
                ${book.themes.length > 3 ? `<span class="theme-tag">+${book.themes.length - 3} more</span>` : ''}
            </div>
            ${rating > 0 ? `
                <div class="book-rating">
                    <span class="stars">${ratingStars}</span>
                    <span class="rating-text">(${rating}/5)</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Open modal
function openModal(bookId) {
    currentBookId = bookId;
    const book = books.find(b => b.id === bookId);
    const userData = userBooks[bookId] || { read: false, rating: 0 };

    document.getElementById('modal-title').textContent = book.title;
    document.getElementById('modal-author').textContent = `by ${book.author}`;
    document.getElementById('modal-year').textContent = book.year;
    document.getElementById('modal-genre').textContent = book.genre;
    document.getElementById('modal-themes').textContent = book.themes.join(', ');

    // Update rating display
    highlightStars(userData.rating || 0);

    // Update button states
    const markReadBtn = document.getElementById('mark-read');
    const markUnreadBtn = document.getElementById('mark-unread');

    if (userData.read) {
        markReadBtn.textContent = 'Marked as Read';
        markReadBtn.disabled = true;
        markUnreadBtn.disabled = false;
    } else {
        markReadBtn.textContent = 'Mark as Read';
        markReadBtn.disabled = false;
        markUnreadBtn.disabled = true;
    }

    document.getElementById('book-modal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
    currentBookId = null;
}

// Mark as read
function markAsRead() {
    if (!currentBookId) return;

    if (!userBooks[currentBookId]) {
        userBooks[currentBookId] = { read: false, rating: 0 };
    }

    userBooks[currentBookId].read = true;
    saveUserData();
    openModal(currentBookId); // Refresh modal
}

// Mark as unread
function markAsUnread() {
    if (!currentBookId) return;

    if (userBooks[currentBookId]) {
        userBooks[currentBookId].read = false;
        userBooks[currentBookId].rating = 0;
    }

    saveUserData();
    openModal(currentBookId); // Refresh modal
}

// Set rating
function setRating(bookId, rating) {
    if (!bookId) return;

    if (!userBooks[bookId]) {
        userBooks[bookId] = { read: true, rating: 0 };
    }

    userBooks[bookId].rating = rating;
    userBooks[bookId].read = true; // Auto-mark as read when rating

    highlightStars(rating);
    saveUserData();
    openModal(currentBookId); // Refresh modal
}

// Highlight stars
function highlightStars(rating) {
    const stars = document.querySelectorAll('#modal-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Update statistics
function updateStats() {
    const readBooks = Object.values(userBooks).filter(book => book.read).length;
    const unreadBooks = books.length - readBooks;

    const ratings = Object.values(userBooks)
        .filter(book => book.read && book.rating > 0)
        .map(book => book.rating);

    const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        : '0.0';

    document.getElementById('books-read').textContent = readBooks;
    document.getElementById('books-unread').textContent = unreadBooks;
    document.getElementById('avg-rating').textContent = avgRating;
}

// Show error message
function showError(message) {
    const container = document.getElementById('books-container');
    container.innerHTML = `
        <div class="empty-state">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}
