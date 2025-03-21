import React from 'react'
import { getRecipeFromMistral } from '../ai'

const Body = () => {

    const [ingredients, setIngredients] = React.useState([])
    const [recipeShown, setRecipeShown] = React.useState(false)
    const [recipe, setRecipe] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(null)

    const ingredientsListItems = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    const handleGetRecipe = async () => {
        setLoading(true)
        setError(null)
        try {
            const generateRecipe = await getRecipeFromMistral(ingredients)
            setRecipe(generateRecipe)
            console.log(generateRecipe)
            setRecipeShown(true)
        } catch (err) {
            setError(err.message || "An error occurred fetching the recipe.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            
            {ingredients.length > 0 && <section>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
                {ingredients.length > 3 && <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={handleGetRecipe} disabled={loading}>{loading ? "Loading..." : "Get a recipe"}</button>
                    {error && <p>{error}</p>}
                </div>}
            </section>}
            
            {recipeShown && <section>
                <h2>Chef Ollama Recommends:</h2>
                <article className="suggested-recipe-container" aria-live="polite">
                    <p>Based on the ingredients you have available, I would recommend </p>
                    {recipe && <p>{recipe}</p>}
                </article>
            </section>}
        </main>
    )
}

export default Body