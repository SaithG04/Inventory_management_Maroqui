import React, { useState, useEffect } from "react";
import CategoryService from "../../../domain/services/CategoryService";

const CategoryForm = ({ categoryId }) => {
  const [categoryData, setCategoryData] = useState({ name: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const categoryService = new CategoryService();

  useEffect(() => {
    if (categoryId) {
      setIsEditMode(true);
      const fetchCategory = async () => {
        const category = await categoryService.getCategoryById(categoryId);
        setCategoryData(category);
      };
      fetchCategory();
    }
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await categoryService.updateCategory(categoryId, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? "Edit Category" : "Add Category"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryData.name}
          onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CategoryForm;
