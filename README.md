# Young Adult Book Tracker

A comprehensive web application for tracking your reading journey through 100 essential young adult fiction novels.

## Features

### Core Functionality
- **100 Essential YA Novels**: Curated collection spanning multiple genres and decades (1868-2020)
- **Local Storage**: All reading data persists in your browser using localStorage
- **Reading Status**: Mark books as "Read" or "Not Yet Read"
- **5-Star Rating System**: Rate books you've read on a scale of 1-5 stars
- **Real-time Statistics**: Track books read, books remaining, and average rating

### Filtering & Search
- **Status Filter**: View all books, only read books, or unread books
- **Genre Filter**: Filter by 15+ genres including Fantasy, Dystopian, Contemporary, Science Fiction, and more
- **Theme Filter**: Filter by themes such as LGBTQ+, mental health, romance, rebellion, friendship, and 50+ others
- **Search**: Search books by title or author name
- **Reset Filters**: Quickly clear all filters to view the full collection

### Sorting Options
- Title (A-Z or Z-A)
- Author (A-Z or Z-A)
- Year (Oldest First or Newest First)
- Rating (Highest or Lowest First)

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark theme with gradient accents for comfortable reading
- **Interactive Cards**: Hover effects and visual indicators for read/unread status
- **Modal Details**: Click any book to view full details and update reading status
- **Theme Tags**: Visual tags showing up to 3 themes per book, with overflow indicator

## Book Collection

The collection includes works from renowned YA authors such as:
- Suzanne Collins (The Hunger Games)
- J.K. Rowling (Harry Potter series)
- John Green (The Fault in Our Stars, Looking for Alaska)
- Rick Riordan (Percy Jackson series)
- Angie Thomas (The Hate U Give)
- Rainbow Rowell (Eleanor & Park, Carry On)
- Sarah J. Maas (Throne of Glass, A Court of Thorns and Roses)
- And many more!

## Genres Included

- Contemporary
- Fantasy
- Dystopian
- Science Fiction
- Historical Fiction
- Paranormal Romance
- Mystery
- Contemporary Romance
- Fantasy Romance
- And more!

## Themes Covered

- Coming-of-age
- LGBTQ+ representation
- Mental health
- Racism and activism
- Romance and first love
- Friendship and loyalty
- Survival and rebellion
- Family dynamics
- Magic and supernatural
- Grief and loss
- Identity and self-discovery
- And 50+ more themes!

## How to Use

1. **Open the Application**: Open `index.html` in your web browser
2. **Browse Books**: Scroll through the collection or use filters to find specific books
3. **Mark as Read**: Click on any book card to open the detail modal, then click "Mark as Read"
4. **Rate Books**: Click on stars in the modal to rate books (1-5 stars)
5. **Filter & Search**: Use the filter dropdowns and search bar to narrow down books
6. **Sort**: Choose your preferred sorting method from the dropdown
7. **Track Progress**: View your reading statistics at the top of the page

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks required
- **Local Storage API**: For persisting user data

### File Structure
```
YA-book-recommendation-system/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js             # JavaScript functionality and logic
├── books.json         # Database of 100 YA novels
└── README.md          # This file
```

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with localStorage support

## Data Persistence

All your reading data (read status and ratings) is stored locally in your browser using localStorage. This means:
- ✅ Your data persists between sessions
- ✅ No internet connection required after initial load
- ✅ Complete privacy - data never leaves your device
- ⚠️ Clearing browser data will reset your progress
- ⚠️ Data is specific to each browser/device

## Future Enhancements

Potential features for future versions:
- Export/import reading data
- Book notes and reviews
- Reading goals and challenges
- Reading timeline
- Genre statistics and visualizations
- Custom book lists and collections

## Contributing

Feel free to contribute additional YA novels, themes, or features to this project!

## License

This project is open source and available for educational and personal use.