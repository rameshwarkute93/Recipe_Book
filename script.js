let recipes = [];

function addRecipe() {
    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value.split(',');
    const steps = document.getElementById('recipe-steps').value;
    const time = document.getElementById('recipe-time').value;
    const category = document.getElementById('recipe-category').value;

    const newRecipe = { name, ingredients, steps, time, category };

    fetch('http://localhost:5000/addRecipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Recipe added:", data);
        fetchRecipes();  // Refresh the recipe list
        resetForm();  // Clear the form after adding
    })
    .catch(error => console.error("Error adding recipe:", error));
}


function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = ""; // Clear previous results

    if (recipes.length === 0) {
        recipeList.innerHTML = "<p style='color: red;'>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const recipeBox = document.createElement("div");
        recipeBox.classList.add("recipe-box");

        recipeBox.innerHTML = `
            <h3>${recipe.name}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
            <p><strong>Steps:</strong> ${recipe.steps}</p>
            <p><strong>Time:</strong> ${recipe.time}</p>
            <p><strong>Category:</strong> ${recipe.category}</p>
            <div class="actions">
                <button class="edit-btn" onclick="editRecipe('${recipe._id}')">Edit</button>
                <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
            </div>
        `;

        recipeList.appendChild(recipeBox);
    });
}


function searchRecipes() {
    const searchInput = document.getElementById("search-box").value.toLowerCase();

    fetch("http://localhost:5000/recipes")
        .then(response => response.json())
        .then(recipes => {
            const filteredRecipes = recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(searchInput) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchInput)) ||
                (recipe.category && recipe.category.toLowerCase().includes(searchInput)) // Ensure category is checked
            );

            displayRecipes(filteredRecipes);
        })
        .catch(error => console.error("Error searching recipes:", error));
}


function filterByCategory() {
    const category = document.getElementById('category-filter').value;
    displayRecipes(category === "All" ? recipes : recipes.filter(r => r.category === category));
}

function editRecipe(recipeId) {
    fetch(`http://localhost:5000/recipes`)
        .then(response => response.json())
        .then(recipes => {
            const recipe = recipes.find(r => r._id === recipeId);

            // Fill the form with the existing recipe data
            document.getElementById('recipe-id').value = recipe._id;  // Store recipe ID
            document.getElementById('recipe-name').value = recipe.name;
            document.getElementById('recipe-ingredients').value = recipe.ingredients.join(', ');
            document.getElementById('recipe-steps').value = recipe.steps;
            document.getElementById('recipe-time').value = recipe.time;
            document.getElementById('recipe-category').value = recipe.category;

            // Change submit button text
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.innerText = "Update Recipe";

            // Remove previous event listeners
            submitBtn.replaceWith(submitBtn.cloneNode(true));  // Remove old event listener
            const newSubmitBtn = document.getElementById('submit-btn');

            // Add new event listener
            newSubmitBtn.addEventListener('click', updateRecipe);
        });
}


function deleteRecipe(recipeId) {
    fetch(`http://localhost:5000/deleteRecipe/${recipeId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log("Recipe Deleted:", data); // Debugging
        fetchRecipes(); // Refresh after deletion
    })
    .catch(error => console.error("Error deleting recipe:", error));
}

function updateRecipe() {
    const recipeId = document.getElementById('recipe-id').value;  // Get stored recipe ID
    if (!recipeId) {
        console.error("No recipe ID found for update.");
        return;
    }

    const name = document.getElementById('recipe-name').value;
    const ingredients = document.getElementById('recipe-ingredients').value.split(',');
    const steps = document.getElementById('recipe-steps').value;
    const time = document.getElementById('recipe-time').value;
    const category = document.getElementById('recipe-category').value;

    const updatedRecipe = { name, ingredients, steps, time, category };

    fetch(`http://localhost:5000/updateRecipe/${recipeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Recipe updated:", data);
        fetchRecipes(); // Refresh the recipe list
        resetForm(); // Clear the form and reset button
    })
    .catch(error => console.error("Error updating recipe:", error));
}


function resetForm() {
    document.getElementById('recipe-id').value = '';  // Clear hidden ID
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-ingredients').value = '';
    document.getElementById('recipe-steps').value = '';
    document.getElementById('recipe-time').value = '';
    document.getElementById('recipe-category').value = '';

    // Reset button to "Add Recipe"
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Add Recipe";

    // Remove old event listeners and add back "Add Recipe" function
    submitBtn.replaceWith(submitBtn.cloneNode(true));  // Remove update event listener
    document.getElementById('submit-btn').addEventListener('click', addRecipe);
}


function fetchRecipes() {
    fetch("http://localhost:5000/recipes")
        .then(response => response.json())
        .then(recipes => {
            const recipeList = document.getElementById("recipe-list");
            recipeList.innerHTML = ""; // Clear previous recipes

            recipes.forEach(recipe => {
                const recipeBox = document.createElement("div");
                recipeBox.classList.add("recipe-box");

                recipeBox.innerHTML = `
                    <h3>${recipe.name}</h3>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                    <p><strong>Steps:</strong> ${recipe.steps}</p>
                    <p><strong>Time:</strong> ${recipe.time}</p>
                    <p><strong>Category:</strong> ${recipe.category}</p>
                    <div class="actions">
                        <button class="edit-btn" onclick="editRecipe('${recipe._id}')">Edit</button>
                        <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                    </div>
                `;

                recipeList.appendChild(recipeBox);
            });
        })
        .catch(error => console.error("Error fetching recipes:", error));
}


fetchRecipes();