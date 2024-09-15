

import React from 'react';
import './HeroSection.css';
import { FaSearch } from 'react-icons/fa'; // Import search icon
const HeroSection = () => {
    return (
        <section className="hero-section">
            <nav className="hero-navbar">
                <ul className="hero-navbar-links">
                    <li><a href="/buy">Buy</a></li>
                    <li><a href="/sell">Sell</a></li>
                    <li><a href="/rent">Rent</a></li>
                </ul>
            </nav>
            <div className="hero-content">
                <h1 className="hero-title">Find Your Dream Home</h1>
                <p className="hero-subtitle">Search millions of listings and find your perfect place to live.</p>
                
                {/* Search Bar with SVG Icon */}
                <div className="hero-search-bar">
                    <input type="text" placeholder="Search for homes, apartments, or any property..." />
                    <div className="search-icon">
                        <FaSearch />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;