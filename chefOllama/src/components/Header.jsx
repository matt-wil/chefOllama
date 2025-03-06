import chefOllamaLogo from "/Users/mattwilliams/Desktop/ChefOllamaApp/chefOllama/chefOllama/src/assets/Chefllama2.png"

export default function Header() {
    return (
        <header>
            <img src={chefOllamaLogo}/>
            <h1>Chef Ollama</h1>
        </header>
    )
}