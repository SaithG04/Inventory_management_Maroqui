import React from 'react';
import ProductSearch from './ProductSearch'; 
import CategorySearch from './CategorySearch';

const SearchSection = ({
  showProductTable,
  setFilteredProducts, 
  setFilteredCategories, 
  products, 
  categories, 
  toast
}) => {

  return (
    <div className="search-section">
      {/* Condicionalmente renderizamos ProductSearch o CategorySearch */}
      {showProductTable ? (
        <ProductSearch 
          products={products} 
          setFilteredProducts={setFilteredProducts}
          toast={toast}
        />
      ) : (
        <CategorySearch 
          categories={categories} 
          setFilteredCategories={setFilteredCategories}
          toast={toast}
        />
      )}
    </div>
  );
};

export default SearchSection;
