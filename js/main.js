import { fetchRandomMeal } from "./api.js";
import { Meal } from "./meal.js";
window.onload = async () => {
    ("use strict");
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {
            console.log("Service Worker registered successfully.");
        })
            .catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
    }
    const randomPageBtn = document.getElementById("random-page-btn");
    const savedPageBtn = document.getElementById("saved-page-btn");
    randomPageBtn?.addEventListener("click", async () => {
        setActivePage("random-recipes-page");
        const mealContainer = document.getElementById("meal-container");
        fetchRandomMeal()
            .then((meal) => {
            if (mealContainer) {
                mealContainer.innerHTML = "";
                mealContainer.appendChild(meal.render());
            }
        })
            .catch((error) => {
            if (mealContainer) {
                mealContainer.innerHTML =
                    "<p>Error fetching meal. Please try again.</p>";
            }
        });
    });
    savedPageBtn?.addEventListener("click", () => {
        setActivePage("saved-recipes-page");
        renderSavedMeals();
    });
    setActivePage("random-recipes-page");
    randomPageBtn?.click();
};
function setActivePage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => page.classList.add("hidden"));
    const activePage = document.getElementById(pageId);
    if (activePage)
        activePage.classList.remove("hidden");
}
function renderSavedMeals() {
    const savedMealsContainer = document.getElementById("saved-meals-container");
    if (!savedMealsContainer)
        return;
    savedMealsContainer.innerHTML = "";
    const savedMeals = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (!savedMeals)
        return;
    savedMeals.forEach((mealData) => {
        const meal = new Meal(mealData.id, mealData.name, mealData.category, mealData.thumbnail, mealData.instructions, mealData.link, mealData.ingredients);
        savedMealsContainer.appendChild(mealData.render());
    });
}
