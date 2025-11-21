# EG Driving School Website

A modern, mobile-first driving school website built with Next.js 16, featuring a clean design and smooth animations.

## 🚗 About

This is a comprehensive website for EG Driving School, a trusted driving instruction business serving North Brisbane, Moreton Bay, and Redcliffe areas since 2015. The website provides information about driving lessons, packages, instructor bio, and terms & conditions.

## ✨ Features

- **🎨 Modern Design**: Professional blue and orange color scheme optimized for trust and action
- **📱 Mobile-First**: Fully responsive design that looks great on all devices
- **⚡ Fast Performance**: Built with Next.js 16 and optimized for speed
- **🎭 Smooth Animations**: Engaging animations using custom CSS and Tailwind
- **♿ Accessible**: Semantic HTML and ARIA labels for better accessibility
- **🔍 SEO Optimized**: Meta tags, OpenGraph, and semantic structure
- **🎯 CTA Focused**: Clear call-to-actions throughout the site

## 📄 Pages

1. **Homepage** (`/`)
   - Hero section with compelling headline
   - About section with company information
   - Price list with all packages
   - Course offerings
   - Service area coverage
   - Contact information
   - Newsletter signup

2. **Terms and Conditions** (`/terms-and-conditions`)
   - Comprehensive policy documentation
   - Visual icons for different rule types
   - Organized by categories
   - Mobile-friendly layout

3. **Driving Education Rules** (`/driving-education-rules`)
   - Educational video placeholders
   - Learning approach breakdown
   - Informational sections
   - CTA for booking

4. **Instructor Bio** (`/bio`)
   - About Emeal (driving instructor)
   - Qualifications and expertise
   - Teaching methodology
   - Areas of specialization

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.0.3](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Animations**: Custom CSS animations + Tailwind utilities

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eg-driving-school
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
eg-driving-school/
├── app/
│   ├── bio/
│   │   └── page.tsx                 # Instructor bio page
│   ├── driving-education-rules/
│   │   └── page.tsx                 # Educational content page
│   ├── terms-and-conditions/
│   │   └── page.tsx                 # Terms page
│   ├── globals.css                  # Global styles & design system
│   ├── layout.tsx                   # Root layout with header/footer
│   └── page.tsx                     # Homepage
├── components/
│   ├── Header.tsx                   # Navigation header
│   ├── Footer.tsx                   # Site footer
│   └── Button.tsx                   # Reusable button component
├── public/                          # Static assets
└── package.json
```

## 🎨 Design System

### Colors

- **Primary (Blue)**: `#2563eb` - Trust, safety, professionalism
- **Secondary (Orange)**: `#f97316` - Action, enthusiasm, energy
- **Accent (Purple)**: `#8b5cf6` - Highlights and special elements

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, responsive sizing
- **Body**: Base 16px with relaxed line height

### Components

All components follow a mobile-first approach with:
- Responsive breakpoints (sm, md, lg, xl)
- Consistent spacing scale
- Smooth transitions and animations
- Accessible markup

## 🌟 Key Features Implementation

### Mobile-First Design
All components are designed and styled for mobile devices first, then enhanced for larger screens using Tailwind's responsive utilities.

### Animations
- Fade-in effects on page load
- Slide-in animations for sections
- Scale animations for cards
- Hover effects on interactive elements

### Performance
- Optimized image loading with Next.js Image component
- Code splitting by route
- Minimized CSS with Tailwind
- Fast page transitions

### SEO Best Practices
- Unique meta titles and descriptions for each page
- OpenGraph tags for social sharing
- Semantic HTML structure
- Descriptive alt texts
- Proper heading hierarchy

## 📱 Contact Information

- **Phone**: 0431 512 095
- **Address**: 36 South St, Burpengary East, QLD 4505
- **Hours**: 09:00 AM – 07:00 PM
- **Service Area**: North Brisbane, Moreton Bay, Redcliffe & surrounding areas

## 🔗 External Links

- [Book a Lesson](https://calendar.app.google/XDUo3y47NbvDSCuS8) - Google Calendar booking
- **Payment**: PayID 0431512095

## 📝 License

Copyright © 2025 EG Driving School - All Rights Reserved.

## 👨‍💻 Development Notes

### Code Quality
- TypeScript for type safety
- Clean, readable component structure
- Reusable components
- Consistent naming conventions
- Comments where necessary

### Best Practices Followed
- ✅ Component composition
- ✅ Props typing with TypeScript
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Mobile-first responsive design
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ Clean code structure

### Future Enhancements
- [ ] Add actual video content for education rules page
- [ ] Implement contact form with email integration
- [ ] Add testimonials section
- [ ] Integrate Google Maps for location
- [ ] Add blog section for driving tips
- [ ] Implement analytics tracking
- [ ] Add cookie consent management
- [ ] Create admin dashboard for content management

## 🤝 Contributing

This is a client project. For any changes or updates, please contact the project maintainer.

---

**Built with ❤️ using Next.js 16 and Tailwind CSS**
