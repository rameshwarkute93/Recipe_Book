const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace this connection string with your MongoDB URI.
// For a local MongoDB instance, it might look like:
const mongoURI = 'mongodb://localhost:27017/recipeDB';

// For MongoDB Atlas, your connection string will look similar to:
// const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/recipeDB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully!'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Define a simple schema for recipes
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  steps: String,
  time: String,
  category: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Example API endpoint to fetch all recipes
app.get("/recipes", async (req, res) => {
    try {
        const recipes = await Recipe.find({}, "name ingredients steps time category"); // Ensure category is included
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes" });
    }
});

// API endpoint to add a new recipe
app.post('/addRecipe', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  try {
    await newRecipe.save();
    res.json({ message: 'Recipe added successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add recipe' });
  }
});

// API endpoint to delete a recipe by its ID
app.delete('/deleteRecipe/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});


app.put("/updateRecipe/:id", async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        res.json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (error) {
        console.error("Error updating recipe:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(5000, () => console.log('Server running on port 5000'));