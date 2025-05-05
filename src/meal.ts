import { fetchRandomMeal } from "./api.js";

export class Meal {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  instructions: string;
  link: string;
  ingredients: string[];

  constructor(
    id: string,
    name: string,
    category: string,
    thumbnail: string,
    instructions: string,
    link: string,
    ingredients: string[]
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.thumbnail = thumbnail;
    this.instructions = instructions;
    this.link = link;
    this.ingredients = ingredients;
  }

  getFormattedInstructions(): string {
    return this.instructions.replace(/\r?\n/g, "<br>");
  }

  render(): HTMLDivElement {
    const mealDiv = document.createElement("div");
    mealDiv.className = "meal";

    mealDiv.innerHTML = `
    <div class="meal-card">
      <div class="meal-header">
        <img src="${this.thumbnail}" alt="${this.name}" class="meal-image">
        <h2>${this.name}</h2>
      </div>
      <div class="meal-info">
        <p><strong>Category:</strong> ${this.category}</p>
      </div>
      <div class="meal-ingredients">
        <h3>Ingredients</h3>
        <ul>
          ${this.ingredients.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
      <div class="meal-instructions">
        <h3>Instructions</h3>
        <p>${this.getFormattedInstructions()}</p>
      </div>
      <div class="meal-footer">
        <p><a href="${
          this.link
        }" target="_blank" class="meal-link">Watch on YouTube</a></p>
        <button class="favorite-button" data-meal-id="${
          this.id
        }">Add to Favorites</button>
      </div>
    </div>
  `;

    const button = mealDiv.querySelector(
      ".favorite-button"
    ) as HTMLButtonElement;

    this.updateFavoriteButton(button);

    button.addEventListener("click", () => {
      this.toggleFavorite(button);
    });

    return mealDiv;
  }

  private updateFavoriteButton(button: HTMLButtonElement): void {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favorites.some((meal: any) => meal.id === this.id)) {
      button.classList.add("added");
      button.textContent = "Remove from Favorites";
    } else {
      button.classList.remove("added");
      button.textContent = "Add to Favorites";
    }
  }

  private toggleFavorite(button: HTMLButtonElement): void {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (favorites.some((meal: any) => meal.id === this.id)) {
      favorites = favorites.filter((meal: any) => meal.id !== this.id);
    } else {
      const mealObject = {
        id: this.id,
        name: this.name,
        category: this.category,
        thumbnail: this.thumbnail,
        instructions: this.instructions,
        link: this.link,
        ingredients: this.ingredients,
      };
      favorites.push(mealObject);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    this.updateFavoriteButton(button);
  }
}

export async function renderRandomMeal(): Promise<void> {
  const mealData = await fetchRandomMeal();
  const meal = new Meal(
    mealData.id,
    mealData.name,
    mealData.category,
    mealData.thumbnail,
    mealData.instructions,
    mealData.link,
    mealData.ingredients
  );

  const mealContainer = document.getElementById("meal-container");
  if (mealContainer) {
    mealContainer.innerHTML = ""; // Clear previous content
    mealContainer.appendChild(meal.render());
  }
}

export function renderSavedMeals(): void {
  const savedMeals = JSON.parse(localStorage.getItem("favorites") || "[]");
  const savedMealsContainer = document.getElementById("saved-meals-container");
  if (savedMealsContainer) {
    savedMealsContainer.innerHTML = ""; // Clear previous content
    savedMeals.forEach((mealData: any) => {
      const meal = new Meal(
        mealData.id,
        mealData.name,
        mealData.category,
        mealData.thumbnail,
        mealData.instructions,
        mealData.link,
        mealData.ingredients
      );
      savedMealsContainer.appendChild(meal.render());
    });
  }
}

export function setActivePage(pageId: string): void {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.add("hidden"));
  const activePage = document.getElementById(pageId);
  if (activePage) activePage.classList.remove("hidden");
}
