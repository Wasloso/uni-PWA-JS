import { Meal } from "./meal.js";
export async function fetchRandomMeal() {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    const response = await fetch(url);
    if (!response.ok) {
        return Promise.reject("Failed to fetch random meal");
    }
    const data = await response.json();
    const mealData = data.meals[0];
    if (!mealData) {
        return Promise.reject("No meal data found");
    }
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = mealData[`strIngredient${i}`];
        const measure = mealData[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`${measure} ${ingredient}`);
        }
        else {
            break;
        }
    }
    return new Meal(mealData.idMeal, mealData.strMeal, mealData.strCategory, mealData.strMealThumb, mealData.strInstructions, mealData.strYoutube, ingredients);
}
