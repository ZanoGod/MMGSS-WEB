# Myanmar GSS Website

## 1. Project Overview

**Myanmar GSS Co., Ltd.** is a responsive corporate website for presenting the company's services, recruitment opportunities, support process, activities, and contact information.

The website is designed around the company's role of connecting **Myanmar talent with employment opportunities in Japan**.

This project is implemented as a **static, multi-page website** using HTML, CSS, and vanilla JavaScript. It does not require a server-side application or database to render the public website.

---

## 2. Website Purpose

The website is used to:

- Introduce Myanmar GSS and its company background.
- Explain recruitment and employment pathways to Japan.
- Present services for candidates and Japanese employers.
- Display current recruitment opportunities.
- Explain the recruitment/process workflow from job order to departure.
- Present training, Japanese-language education, and related activities.
- Provide company contact and location information.
- Allow visitors to switch between **English and Japanese**.

### Main target users

1. **Myanmar candidates** looking for employment opportunities in Japan.
2. **Japanese employers** looking for Myanmar talent.
3. **Business partners and visitors** who want to understand Myanmar GSS services.

---

# 3. Technology Stack

| Technology | Usage |
|---|---|
| **HTML5** | Provides the structure and content of all website pages. |
| **CSS3** | Controls layout, responsive design, typography, colors, animations, cards, navigation, modals, and page-specific styling. |
| **Vanilla JavaScript (ES6+)** | Provides interactive behavior without a JavaScript framework. |
| **JavaScript DOM API** | Used for navigation, filtering, modal dialogs, dynamic text, scrolling, and UI state changes. |
| **IntersectionObserver API** | Detects elements entering the viewport and triggers reveal animations. |
| **LocalStorage API** | Remembers the visitor's selected language between page loads. |
| **CSS Grid & Flexbox** | Used for responsive page layouts and component alignment. |
| **Responsive Web Design** | Adapts the website for desktop, tablet, and mobile screen sizes. |
| **Web-safe/system fonts** | Uses system fonts such as Inter, Manrope, Segoe UI, Arial, and related fallbacks. |
| **JPG / PNG / ICO** | Used for hero images, gallery images, company logo, representative image, and favicon assets. |

### Frameworks and libraries

No frontend framework is required.

The project does **not** use:

- React
- Vue
- Angular
- Next.js
- Bootstrap
- Tailwind CSS
- jQuery

The interactive functionality is implemented with **native JavaScript** and browser APIs.

---

# 4. Project Structure

```text
mmgss/
├── index.html
├── about.html
├── services.html
├── recruitment.html
├── process.html
├── activities.html
├── contact.html
├── README.md
│
├── assets/
│   ├── activity.png
│   ├── gallery-main.png
│   ├── logo.png
│   ├── representative.png
│   ├── apple-touch-icon.png
│   ├── favicon-192.png
│   ├── favicon.ico
│   └── images/
│       ├── activity.png
│       ├── carousel_1.jpg
│       ├── carousel_2.jpg
│       ├── carousel_3.jpg
│       ├── gallery-main.png
│       ├── logo.png
│       ├── process1.jpg
│       └── representative.png
│
├── css/
│   ├── styles.css
│   ├── layout-fix.css
│   ├── home-carousel.css
│   ├── home-polish.css
│   ├── process.css
│   ├── recruitment.css
│   └── sevices.css
│
└── js/
    ├── i18n.js
    └── script.js
```

---

# 5. Pages

## Home — `index.html`

The homepage introduces Myanmar GSS with the main message:

> Myanmar talent. A bridge to Japan.

It contains:

- Hero section
- Hero image carousel
- Company introduction
- Three recruitment pathways
- Representative message
- Activities/training section
- Recruitment call-to-action
- Navigation and footer

The homepage loads several additional CSS files for carousel and layout-specific styling.

---

## Company — `about.html`

The company page explains:

- Myanmar GSS company overview
- Company philosophy
- Connection between Myanmar talent and Japanese employers
- Professional support approach
- Representative message

---

## Services — `services.html`

The services page explains the three major pathways:

1. Highly Skilled Foreign Talent
2. Specified Skilled Workers
3. Technical Intern Training

It also describes supporting services including:

- Japanese language education
- Skills-test preparation
- Visa support
- Employment support
- Recruitment/process support

---

## Recruitment — `recruitment.html`

The recruitment page presents available job opportunities.

Jobs are grouped into:

- Professional Talent
- Specified Skilled Worker
- Technical Intern Trainees

The page provides:

- Recruitment category filters
- Number of visible roles
- Job cards
- Job details modal
- Location
- Salary
- Japanese-language requirements
- Contract duration
- Job summary
- Candidate requirements

Job information is stored directly in HTML `data-*` attributes and is read by JavaScript when the role details modal is opened.

---

## Process — `process.html`

The process page explains the recruitment workflow from the initial job order through post-arrival support.

The workflow includes stages such as:

1. Receive Job Order
2. Job Announcement / Candidate Recruitment
3. CV Collection / Document Screening
4. In-House Japanese Conversation Test
5. CV Submission to Japan
6. Employer Interview
7. Employment Contract
8. Demand Application
9. Certificate of Eligibility (COE) Application
10. Visa Application
11. Standard Labor Contract
12. OWIC Card Application
13. Pre-Departure Orientation
14. Departure to Japan
15. Post-Arrival Support

---

## Activities — `activities.html`

The activities page presents the organization's training and preparation activities.

It focuses on:

- Candidate preparation
- Japanese-language education
- Skills development
- Training
- Pre-departure preparation
- Candidate support

---

## Contact — `contact.html`

The contact page provides the company's contact/location information and a Google Maps location link.

Current website content identifies the company location as:

**No. 38(A), Boe Yar Zar Street, Kyaukkone, Yankin Township, Yangon, Myanmar**

The page intentionally does not expose an unverified email address.

---

# 6. JavaScript Functionality

The main JavaScript file is:

```text
js/script.js
```

It implements the following functionality.

## Page loader

A loading screen is displayed while the page loads and is hidden after the browser's `load` event.

Relevant elements:

```text
#pageLoader
.loaded
.hide
```

---

## Active navigation

The script checks the current URL and automatically adds an active state to the corresponding navigation link.

This allows each page to highlight its current section without duplicating page-specific JavaScript.

---

## Mobile navigation

The navigation collapses for smaller screens.

The JavaScript handles:

- Open/close navigation
- `aria-expanded`
- Navigation accessibility labels
- Closing the menu after selecting a page
- Closing the mobile menu after resizing to desktop width

---

## Scroll behavior

The script provides:

- Scroll progress indicator
- Back-to-top behavior
- Navigation state changes while scrolling

---

## Cursor glow

On devices with a fine pointer, the website displays a subtle cursor-following glow effect.

The effect is disabled for devices where a fine pointer is not available.

---

## Reveal animations

Elements using the `.reveal` class are animated into view using the browser's native:

```javascript
IntersectionObserver
```

This avoids continuously checking the scroll position for every animated element.

A fallback is included for browsers that do not support `IntersectionObserver`.

---

## Dynamic footer year

The footer year is populated automatically using the current browser year.

This means the footer does not need to be manually updated every year.

---

# 7. Recruitment System

Recruitment data is embedded in `recruitment.html`.

Each job uses HTML `data-*` attributes similar to:

```html
<article
  class="job-item"
  data-type="professional"
  data-role="Engineering"
  data-location="Oita City, Oita / Taito-ku, Tokyo, Japan"
  data-salary="230,000 Yen – 450,000 Yen"
  data-language="N3 / N1"
  data-duration="Full-time"
  data-summary="..."
  data-requirements="..."
>
```

JavaScript reads these attributes and uses them to populate the role details modal.

### Recruitment filters

The available categories are represented by:

```text
professional
ssw
technical-intern
```

The filtering logic hides or displays `.job-item` elements based on the selected category.

---

# 8. Internationalization

The website includes a custom lightweight internationalization system:

```text
js/i18n.js
```

It currently supports:

- English
- Japanese

The Japanese dictionary is stored in the JavaScript source.

The language selector is dynamically added to the navigation.

### Language persistence

The selected language is saved using:

```javascript
localStorage
```

Therefore, a visitor who selects Japanese can return to another page and retain the Japanese-language setting in the same browser.

The system also updates:

- Page text
- Navigation labels
- Accessibility labels
- Image `alt` text where translations exist
- Dynamic recruitment values
- Page title
- Meta description
- HTML document language

---

# 9. CSS Architecture

The project uses a shared base stylesheet plus page/feature-specific stylesheets.

## `css/styles.css`

Main global stylesheet.

Responsible for:

- CSS variables
- Typography
- Global reset
- Container widths
- Navigation
- Buttons
- Cards
- Page sections
- Footer
- General responsive behavior
- Shared animations
- Modal base styling

---

## `css/layout-fix.css`

Additional layout corrections and responsive fixes.

Used by:

- Homepage
- Services page

---

## `css/home-carousel.css`

Styles the homepage hero carousel and related carousel UI.

---

## `css/home-polish.css`

Contains homepage-specific visual refinements.

---

## `css/process.css`

Styles the recruitment/process timeline and process-specific components.

---

## `css/recruitment.css`

Styles:

- Recruitment cards
- Filters
- Job listings
- Recruitment modal
- Recruitment-specific responsive layouts

---

## `css/sevices.css`

Contains services-page-specific styling.

**Important:** the filename is currently `sevices.css` (missing the `r` in `services`), while `services.html` references:

```html
<link rel="stylesheet" href="css/services.css">
```

This should be corrected before deployment.

### Recommended fix

Rename:

```text
css/sevices.css
```

to:

```text
css/services.css
```

Alternatively, change the reference in `services.html` to match the existing filename.

Renaming the file to the correctly spelled `services.css` is the cleaner long-term solution.

---

# 10. Running the Website Locally

Because this is a static website, no backend installation is required.

## Option 1 — Open directly

You can open:

```text
index.html
```

directly in a modern web browser.

However, using a local web server is recommended for more realistic browser behavior.

---

## Option 2 — Python local server

If Python is installed:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Option 3 — VS Code Live Server

If using Visual Studio Code, install the **Live Server** extension and open the project folder.

Then launch:

```text
index.html
```

with Live Server.

---

# 11. Deployment

The website can be deployed to any static hosting provider.

Examples include:

- Apache
- Nginx
- GitHub Pages
- Netlify
- Vercel static hosting
- Cloudflare Pages
- Any standard web hosting account

No Node.js server or database is required for the current implementation.

### Deployment checklist

Before uploading:

1. Confirm all HTML pages exist.
2. Confirm all CSS paths are correct.
3. Confirm all JavaScript paths are correct.
4. Fix the `sevices.css` / `services.css` filename mismatch.
5. Verify all image paths.
6. Test mobile navigation.
7. Test recruitment filters.
8. Test recruitment role modal.
9. Test English/Japanese switching.
10. Test the Google Maps link.
11. Test the website on mobile, tablet, and desktop.
12. Verify the final contact information.

---

# 12. Browser Compatibility

The website uses standard modern browser APIs and CSS features.

Recommended browsers:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

Modern versions are recommended, particularly because the website uses:

- CSS Grid
- CSS Flexbox
- IntersectionObserver
- LocalStorage
- `backdrop-filter`
- Modern JavaScript syntax

---

# 13. Maintenance Guide

## Adding a new page

1. Create a new `.html` file.
2. Include the shared stylesheet:

```html
<link rel="stylesheet" href="css/styles.css">
```

3. Include:

```html
<script src="js/i18n.js"></script>
<script src="js/script.js"></script>
```

4. Add the page to the navigation.
5. Add the page title and meta description.
6. Add Japanese translations to `js/i18n.js` if Japanese support is required.

---

## Adding a recruitment role

Add another `.job-item` to `recruitment.html`.

Include the required `data-*` attributes:

```text
data-type
data-role
data-location
data-salary
data-language
data-duration
data-summary
data-requirements
```

The existing JavaScript will automatically use the information for filtering and the role details modal.

---

## Updating translations

Japanese translations are stored in:

```text
js/i18n.js
```

The English page content remains in the HTML.

When adding new visible text, add its Japanese equivalent to the `JA` dictionary if it should be translated.

---

# 14. Security and Backend Notes

The current website is primarily a **frontend/static presentation site**.

There is currently no visible:

- Database
- Authentication system
- Server-side API
- CMS
- Server-side form handler
- Node.js application
- PHP application

This means deployment is relatively simple, but any future features that require persistent data should be implemented through a backend or external service.

Examples of future backend features could include:

- Online candidate applications
- Employer job-order submission
- Admin recruitment management
- Database-backed job listings
- Contact form submission
- Candidate accounts
- Application status tracking

---

# 15. Recommended Future Improvements

For future production development, consider:

### Content management

Move recruitment data out of static HTML and into a CMS or API so staff can update jobs without editing source code.

### Contact form

Add a secure server-side or third-party form service instead of relying only on contact information.

### SEO

Add:

- Open Graph metadata
- Twitter/X card metadata
- Canonical URLs
- Structured data / Organization schema
- More specific page descriptions
- XML sitemap
- `robots.txt`

### Performance

Consider:

- Image compression
- WebP/AVIF versions of large images
- Lazy loading for non-critical images
- Minified production CSS/JS
- Cache headers

### Accessibility

Continue improving:

- Keyboard navigation
- Focus management
- Color contrast
- Modal accessibility
- Screen-reader labels
- Reduced-motion support

### Recruitment management

A future admin dashboard could allow authorized staff to:

- Add jobs
- Edit salaries
- Change locations
- Set application status
- Remove expired opportunities
- Manage translations

---

# 16. Summary

Myanmar GSS is a **responsive static corporate/recruitment website** built with:

**HTML5 + CSS3 + Vanilla JavaScript**

The site provides:

- Corporate/company information
- Recruitment services
- Job opportunities
- Recruitment filtering
- Job-detail modal
- Recruitment process information
- Training/activity information
- English/Japanese language switching
- Responsive navigation
- Scroll and reveal animations
- Static contact/location information

The architecture is intentionally lightweight and does not depend on a frontend framework or backend server.

**Primary entry point:** `index.html`

**Main JavaScript:** `js/script.js`

**Language system:** `js/i18n.js`

**Global styling:** `css/styles.css`

**Assets:** `assets/`
