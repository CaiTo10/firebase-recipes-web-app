import { useState, useEffect } from "react";

function AddEditRecipeForm({
  handleAddRecipe,
  existingRecipe,
  handleUpdateRecipe,
  handleEditRecipeCancel,
  handleDeleteRecipe,
}) {
  useEffect(() => {
    if (existingRecipe) {
      setname(existingRecipe.name);
      setcategory(existingRecipe.category);
      setdirections(existingRecipe.directions);
      setpublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
      setingredients(existingRecipe.ingredients);
    } else {
      resetForm();
    }
  }, [existingRecipe]);
  const [name, setname] = useState("");
  const [category, setcategory] = useState("");
  const [publishDate, setpublishDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [directions, setdirections] = useState("");
  const [ingredients, setingredients] = useState([]);
  const [ingredientName, setingredientName] = useState("");

  const handleRecipeFormSubmit = async (e) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add atleast 1 ingredient");
      return;
    }
    const isPublished = new Date(publishDate) <= new Date() ? true : false;
    const newRecipe = {
      name,
      category,
      directions,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients,
    };
    if (existingRecipe) {
      handleUpdateRecipe(newRecipe, existingRecipe.id);
    } else {
      handleAddRecipe(newRecipe);
    }
    resetForm();
  };
  const handleAddIngredient = (event) => {
    if (event.key && event.key !== "Enter") {
      return;
    }
    event.preventDefault();

    if (!ingredientName) {
      alert("Ingredient Name is required");
      return;
    }

    setingredients([...ingredients, ingredientName]);
    setingredientName("");
  };

  function resetForm() {
    setname("");
    setcategory("");
    setdirections("");
    setpublishDate("");
    setingredients([]);
  }
  return (
    <form
      className="add-edit-recipe-form-container"
      onSubmit={handleRecipeFormSubmit}
    >
      {existingRecipe ? <h2>Update the Recipe</h2> : <h2>Add a New Recipe</h2>}
      <div className="top-form-section"></div>
      <div className="fields">
        <label className="recipe-label input-label">
          Recipe name:
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </label>
        <label className="recipe-label input-label">
          Category:
          <select
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            className="select"
            required
          >
            <option value=""></option>
            <option value="breadsSandwichesAndPizza">
              Breads, Sandwiches and Pizza
            </option>
            <option value="eggsAndBreakfast">Eggs & Breakfast</option>
            <option value="dessertsAndBakedGoods">
              Desserts & Baked Goods
            </option>
            <option value="fishAndSeafood">Fish & Seafood</option>
            <option value="vegetables">Vegetables</option>
          </select>
        </label>
        <label className="recipe-label input-label">
          Direction:
          <textarea
            required
            value={directions}
            onChange={(e) => setdirections(e.target.value)}
          ></textarea>
        </label>
        <label className="recipe-label input-label">
          Publish Date:
          <input
            type="date"
            required
            value={publishDate}
            onChange={(e) => setpublishDate(e.target.value)}
          />
        </label>
      </div>
      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    <tr key={ingredient}>
                      <td className="table-data text-center">{ingredient}</td>
                      <td className="ingredient-delete-box">
                        <button
                          type="button"
                          className="secondary-button ingredient-delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        {ingredients && ingredients.length === 0 ? (
          <h3 className="text-center no-ingredients">
            {" "}
            No Incredients Added yet
          </h3>
        ) : null}
        <div className="ingredient-form">
          <label className="ingredient-label">
            Ingredient:
            <input
              type="text"
              value={ingredientName}
              onChange={(e) => setingredientName(e.target.value)}
              placeholder="ex. 1 cup of sugar"
              onKeyPress={handleAddIngredient}
            />
          </label>
          <button
            type="button"
            className="primary-button add-ingredient-button"
            onClick={handleAddIngredient}
          >
            Add Ingredient
          </button>
        </div>
      </div>
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">
          {existingRecipe ? "Update Recipe" : "Create Recipe"}
        </button>
        {existingRecipe ? (
          <>
            <button
              type="button"
              onClick={handleEditRecipeCancel}
              className="primary-button action-button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="primary-button action-button"
              onClick={() => handleDeleteRecipe(existingRecipe.id)}
            >
              DELETE
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}

export default AddEditRecipeForm;
