import React, { useState, useEffect } from 'react';
import { getUniqueCategories } from '../utils/categoryUtils';
import '../styles/components.css';

/**
 * SearchFilter Component
 * 
 * Provides search and filter functionality for the icon grid
 */
function SearchFilter({ icons, onFilter, className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = getUniqueCategories(icons);

  // Apply filters whenever search term, category, or sort changes
  useEffect(() => {
    onFilter({
      searchTerm,
      category: selectedCategory,
      sortBy
    });
  }, [searchTerm, selectedCategory, sortBy, onFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || sortBy !== 'name';

  return (
    <div className={`search-filter ${className}`}>
      <div className="search-filter__container">
        {/* Search Input */}
        <div className="search-filter__group">
          <label htmlFor="icon-search" className="search-filter__label">
            Search Icons
          </label>
          <small>Search by name, category, or tags...</small>
          <div className="search-filter__input-wrapper">
            <input
              id="icon-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder=""
              className="search-filter__input"
            />
            <svg className="search-filter__search-icon" viewBox="0 0 24 24" width="20" height="20">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="search-filter__group">
          <label htmlFor="category-filter" className="search-filter__label">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="search-filter__select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="search-filter__group">
          <label htmlFor="sort-filter" className="search-filter__label">
            Sort By
          </label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={handleSortChange}
            className="search-filter__select"
          >
            <option value="name">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="category">Category</option>
            <option value="size">Complexity</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="search-filter__group">
            <button
              onClick={clearFilters}
              className="search-filter__clear-btn"
              title="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="search-filter__summary">
        {searchTerm && (
          <span className="search-filter__summary-item">
            Searching for: <strong>"{searchTerm}"</strong>
          </span>
        )}
        {selectedCategory !== 'all' && (
          <span className="search-filter__summary-item">
            Category: <strong>{selectedCategory}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchFilter;
