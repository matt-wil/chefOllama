import {useEffect, useState, useRef } from 'react'
import { getRecipeFromMistral } from '../ai'
import ReactMarkdown from 'react-markdown'

const Body = () => {

    const [ingredients, setIngredients] = useState([])
    const [recipeShown, setRecipeShown] = useState(false)
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const recipeSection = useRef(null)

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

    useEffect(() => {
        if (recipe && recipeSection.current) {
            recipeSection.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [recipe])

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
                    <div ref={recipeSection}>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={handleGetRecipe} disabled={loading}>{loading ? "Loading..." : "Get a recipe"}</button>
                    {error && <p>{error}</p>}
                </div>}
            </section>}
            
            {recipeShown && <section>
                <h2>Chef Ollama Recommends:</h2>
                <article className="recipe-container" aria-live="polite">
                    {recipe && 
                    <section className='recipe-container'>
                        <ReactMarkdown>
                            {recipe}
                        </ReactMarkdown>
                    </section>}
                </article>
            </section>}
        </main>
    )
}

export default Body