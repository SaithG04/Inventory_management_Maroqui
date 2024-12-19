import React, { useEffect, useState } from "react";
import CategoryService from "../../../domain/services/CategoryService";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const categoryService = new CategoryService();

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await categoryService.getAllCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Category List</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
