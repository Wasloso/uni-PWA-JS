import { fetchRandomMeal } from "./api.js";
import { renderRandomMeal, renderSavedMeals, setActivePage } from "./meal.js";

window.onload = async (): Promise<void> => {
  ("use strict");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => {
        console.log("Service Worker registered successfully.");
      })
      .catch((error: unknown) => {
        console.error("Service Worker registration failed:", error);
      });
  }

  const randomPageBtn = document.getElementById("random-page-btn");
  const savedPageBtn = document.getElementById("saved-page-btn");

  randomPageBtn?.addEventListener("click", () => {
    setActivePage("random-recipes-page");
    renderRandomMeal();
  });

  savedPageBtn?.addEventListener("click", () => {
    setActivePage("saved-recipes-page");
    renderSavedMeals();
  });

  setActivePage("random-recipes-page");
  renderRandomMeal();
};
