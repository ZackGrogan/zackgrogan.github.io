
# Changelog

## [Released] - 2024-12-16

### Added

- **Blackjack Game**: Introduced a new interactive Blackjack game located at `games/blackjack/`. This includes:
  - `script.js`: Implements the game logic with features like betting, hitting, standing, doubling down, and dealer AI.
  - `style.css`: Provides styling for the game interface, including responsive design for mobile devices.
  - `index.html`: The main game page integrating the script and styles, with improved accessibility features.
- **Project Updates Page**: Created `project-updates.html` to showcase ongoing and upcoming projects such as:
  - **Personal Portfolio Website**: Highlights improvements like a modular navigation bar and dynamic content loading.
  - **Interactive Games Section**: Showcases new games, including Blackjack, with plans for future additions.
  - **Vector Nexus**: An open-source CLI tool for managing vector data in AI applications.
  - **ARCANE**: An AI-driven toolkit for enhancing tabletop RPG experiences.
- **Global Navigation Include**: Developed `includes/nav.html` to centralize the navigation menu across all pages for consistency and easier maintenance.
  - Implemented a script to dynamically load the navigation into each page using a placeholder div.
- **Google Analytics Integration**: Added the Global Site Tag (gtag.js) to enable Google Analytics tracking across the site.
- **Structured Data with JSON-LD**: Implemented JSON-LD scripts on key pages to improve SEO, providing structured data about the website and the author.

### Changed

- **Portfolio Page Enhancements (`portfolio.html`)**:
  - Updated the page title to "Zackariah A. Grogan - Development Portfolio" for improved branding.
  - Added comprehensive meta tags, including description, keywords, author, and Open Graph data for better SEO and social media sharing.
  - Integrated new project entries for **ARCANE** and **Vector Nexus** with detailed descriptions and technology stacks.
  - Enhanced images with lazy loading, asynchronous decoding, and specified dimensions to improve page load performance.
- **Resume Updates (`resume.html`)**:
  - Revised the professional timeline to include the current role as a Freelance Software Developer (Sep 2023 - Present).
  - Updated previous job titles and descriptions for clarity and to reflect recent experiences.
  - Improved accessibility by adding ARIA roles and labels to navigation elements.
  - Refined meta tags and included structured data for better SEO.
- **Homepage Improvements (`Index.html`)**:
  - Changed the page title to "Zackariah A. Grogan - Home".
  - Updated the introduction section to reflect the focus on software development.
  - Removed the "Graphics Portfolio" link, streamlining the quick links to focus on development projects and contact information.
  - Enhanced accessibility with ARIA labels and roles on main content and navigation.
  - Optimized the profile image by using a compressed version and adding lazy loading.
- **Navigation Overhaul**:
  - Replaced individual navigation menus on all pages with the centralized `nav.html`, ensuring consistency.
  - Updated navigation links to reflect the current structure, adding "Project Updates" and removing outdated links.
  - Implemented ARIA attributes and accessible labels on navigation elements for improved accessibility.
- **Footer Updates**:
  - Standardized the footer across pages, including dynamic display of the current year.
  - Added ARIA labels to footer elements for better accessibility.
- **Game Section Enhancements (`games/index.html`)**:
  - Added the new Blackjack game to the list of available games with a brief description.
  - Updated the page structure to include the centralized navigation.

### Removed

- **Graphics Portfolio**:
  - Deleted `graphics-portfolio.html` as the focus has shifted away from graphic design to software development.
  - Removed links and references to the graphics portfolio from navigation and other pages.
- **Placeholder Content**:
  - Removed placeholder project cards from `portfolio.html`, replacing them with actual projects.
  - Eliminated unused or commented-out code to clean up the codebase.

### Fixed

- **Navigation Links**:
  - Corrected inconsistent navigation links to ensure all pages link correctly and consistently.
  - Updated paths to accommodate the new folder structure and centralized navigation.
- **Accessibility Issues**:
  - Addressed missing ARIA attributes and labels on interactive elements.
  - Improved keyboard navigation and screen reader compatibility across the site.
- **Image Optimization**:
  - Added `loading="lazy"` and `decoding="async"` attributes to images to enhance page load times.
  - Specified image dimensions to prevent layout shifts during loading.

### Improved

- **Search Engine Optimization (SEO)**:
  - Enhanced meta tags with relevant keywords and descriptions tailored to each page.
  - Implemented structured data using JSON-LD to provide search engines with detailed information about the site and the author.
- **Code Maintainability**:
  - Refactored repetitive code by centralizing the navigation menu.
  - Organized scripts and styles into relevant directories for better project structure.
- **Performance Enhancements**:
  - Optimized images and assets to reduce load times.
  - Minimized rendering blocking by deferring non-critical scripts.
- **User Experience**:
  - Improved the responsiveness of the site on various devices, ensuring a consistent experience.
  - Added interactive elements like game animations and dynamic content loading.

---

This changelog reflects all significant changes made to the project, focusing on added features, changes, removals, fixes, and improvements to enhance the functionality, performance, and user experience of the website.
