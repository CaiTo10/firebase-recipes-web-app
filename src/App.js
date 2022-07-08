import "./App.css";
// // eslint-disable-next-line no-unused-vars
// import firebase from './FirebaseConfig';
import { useState, useEffect } from "react";
import FirebaseAuthService from "./FirebaseAuthService";
import FirebaseFirestoreService from "./FirabaseFirestoreService";

import LoginForm from "./components/LoginForm";
import AddEditRecipeForm from "./components/AddEditRecipeForm";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setcurrentRecipe] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [categoryFilter, setcategoryFilter] = useState("");
  const [orderBy, setorderBy] = useState("publishedDateDesc");
  const [recipesPerPage, setrecipesPerPage] = useState(3);
  // monitoring the user auth status
  FirebaseAuthService.subscribeToAuthChanges(setUser);

  useEffect(() => {
    setisLoading(true);
    fetchRecipe()
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.log(error.message);
        throw error;
      })
      .finally(() => {
        setisLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, categoryFilter, orderBy, recipesPerPage]);

  async function fetchRecipe(cursorId = "") {
    const queries = [];
    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter,
      });
    }
    if (!user) {
      queries.push({
        field: "isPublished",
        condition: "==",
        value: true,
      });
    }

    const orderByField = "publishDate";
    let orderByDirection;
    if (orderBy) {
      switch (orderBy) {
        case "publishedDateAsc":
          orderByDirection = "asc";
          break;
        case "publishedDateDesc":
          orderByDirection = "desc";
          break;
        default:
          break;
      }
    }
    let fetchedRecipes = [];
    // const array = []
    try {
      const response = await FirebaseFirestoreService.readDocuments({
        collection: "recipes",
        queries: queries,
        orderByField: orderByField,
        orderByDirection: orderByDirection,
        perPage: recipesPerPage,
        cursorId: cursorId,
      });
      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate * 1000);
        // array.push({...data,id})
        return { ...data, id };
      });
      if (cursorId) {
        fetchedRecipes = [...recipes, ...newRecipes];
      } else {
        // console.log({array})
        // his method of adding to array is same as using array.push in the map loops
        fetchedRecipes = [...newRecipes];
      }
    } catch (error) {
      console.log(error.message);
      throw error;
    }
    console.log({ fetchedRecipes });

    return fetchedRecipes;
  }

  function handleRecipesPerPageChange(event) {
    const recipesPerpage = event.target.value;
    setRecipes([]);
    setrecipesPerPage(recipesPerpage);
  }

  function handleLoadMoreRecipes() {
    const lastRecipe = recipes[recipes.length - 1];
    const cursorId = lastRecipe.id;
    handleFetchRecipes(cursorId);
  }

  async function handleFetchRecipes(cursorId = "") {
    try {
      const fetchedRecipes = await fetchRecipe(cursorId);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  const handleAddRecipe = async (newRecipe) => {
    try {
      // newRecipe.createdBy = `${user.uid}`
      const response = await FirebaseFirestoreService.createDocument(
        "recipes",
        newRecipe
      );
      //TODO: fetch new recipes from FIRESTORE
      handleFetchRecipes();
      alert(`Successfully created a recipe with ID = ${response.id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateRecipe = async (newRecipe, recipeId) => {
    try {
      await FirebaseFirestoreService.updateDocument(
        "recipes",
        recipeId,
        newRecipe
      );
      handleFetchRecipes();
      alert(`Successfully Update recipes with ID ${recipeId}`);
      setcurrentRecipe(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditRecipeClick = (recipeId) => {
    const selectedRecipe = recipes.find((recipe) => {
      return recipe.id === recipeId;
    });
    if (selectedRecipe) {
      setcurrentRecipe(selectedRecipe);
      window.scrollTo(0, document.body.scrollHeight);
    }
  };

  function handleEditRecipeCancel() {
    setcurrentRecipe(null);
  }

  function lookupCategoryLabel(categoryKey) {
    const categories = {
      breadsSandwichesAndPizza: "Breads, Sandwiches and Pizza",
      eggsAndBreakfast: "Eggs & Breakfast",
      dessertsAndBakedGoods: " Desserts & Baked Goods",
      fishAndSeafood: "Fish & Seafood",
      vegetables: "Vegetables",
    };
    const label = categories[categoryKey];
    return label;
  }

  function formatDate(date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    const dateString = `${month}-${day}-${year}`;
    return dateString;
  }

  async function handleDeleteRecipe(recipeId) {
    const deleteConfirmation = window.confirm(
      "Deleting this Recipe is Permenant"
    );
    if (deleteConfirmation) {
      try {
        await FirebaseFirestoreService.deleteDocument("recipes", recipeId);
        handleFetchRecipes();
        setcurrentRecipe(null);
        window.scrollTo(0, 0);
        alert("successfully deleted recipes with id " + recipeId);
      } catch (error) {
        alert(error.message);
        throw error;
      }
    }
  }
  return (
    <div className="App">
      {console.log({ user })}
      <div className="title-row">
        <h1 className="title">Firebase Recipe</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className="main">
        <div className="row filters">
          <label className="recipe-label input-label">
            Category:
            <select
              value={categoryFilter}
              onChange={(e) => setcategoryFilter(e.target.value)}
              className="select"
              required
            >
              <option value="">All</option>
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
          <label className="input-label">
            <select
              value={orderBy}
              onChange={(e) => setorderBy(e.target.value)}
              className="select"
            >
              <option value="publishedDateAsc">
                Publish Date (oldest - newest)
              </option>
              <option value="publishedDateDesc">
                Publish Date (newest - oldest)
              </option>
            </select>
          </label>
        </div>
        <div className="center">
          <div className="recipe-list-box">
            {isLoading ? (
              <div className="fire">
                <div className="flames">
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
                <div className="logs"></div>
              </div>
            ) : null}
            {!isLoading && recipes && recipes.length === 0 ? (
              <h5 className="no-recipes">No Recipes Found</h5>
            ) : null}
            {!isLoading && recipes && recipes.length > 0 ? (
              <div className="recipe-list">
                {recipes.map((recipe) => {
                  return (
                    <div className="recipe-card" key={recipe.id}>
                      {!recipe.isPublished ? (
                        <div className="unpublished">UNPUBLISHED</div>
                      ) : null}
                      <div className="recipe-name">{recipe.name}</div>
                      <div className="recipe-field">
                        Category: {lookupCategoryLabel(recipe.category)}
                      </div>
                      <div className="recipe-field">
                        Publish Date: {formatDate(recipe.publishDate)}
                      </div>
                      {user ? (
                        <button
                          className="primary-button edit-button"
                          type="button"
                          onClick={() => handleEditRecipeClick(recipe.id)}
                        >
                          EDIT
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
        {isLoading || (recipes && recipes.length > 0) ? (
          <>
            <label className="input-label">
              Recipes Per Page:
              <select
                value={recipesPerPage}
                onChange={handleRecipesPerPageChange}
                className="select"
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
              </select>
            </label>
            <div className="pagination">
              <button type="button" className="primary-button" onClick={handleLoadMoreRecipes}>LOAD MORE RECIPES</button>
            </div>
          </>
        ) : null}
        {user ? (
          <AddEditRecipeForm
            existingRecipe={currentRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleEditRecipeCancel={handleEditRecipeCancel}
            handleAddRecipe={handleAddRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          ></AddEditRecipeForm>
        ) : null}
      </div>
    </div>
  );
}

export default App;
