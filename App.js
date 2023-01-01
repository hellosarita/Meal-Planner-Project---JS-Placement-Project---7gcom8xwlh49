var MealPlanner = {
    meals: [],
    nutrients: {},
    recipiesContainer: document.getElementById("recipies")
}
var getRecipies = (event) => {
    // get Receipes
    event.preventDefault()
    const payload = {
        "timeFrame": "day",
        "targetCalories": calculateCalorie(event.target),
        "diet": "vegetarian",
        "exclude": "shellfish, olives",
        apiKey: "0adeda532af84a148480f5b2a623f963"
    }
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const url = "https://api.spoonacular.com/mealplanner/generate?" + new URLSearchParams(payload).toString()

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(renderRecipes)
    .catch(error => console.log('error', error));
}

var calculateCalorie = (form) => {
    let activity = form.activity.value
    let bmr = calculateBMR(
        form.gender.value,
        parseInt(form.weight.value),
        parseInt(form.height.value),
        parseInt(form.age.value)
    )

    if (activity === "light") {
        return bmr * 1.375
    } else if (activity === "moderate") {
        return bmr * 1.55
    }
    return bmr * 1.725
}

var calculateBMR = (gender, weight, height, age) => {
    if (gender == "female") {
        return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
    }
    return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age)
}

var getRecipeListCard = (recipe, index) => {
    console.log(recipe)
    let moment = index == 0 ? "Breakfast" : index == 1 ? "Lunch" : "Dinner"
    return `<div class="recipie">
        <h2 class="recipie-moment">${moment}</h2>
        <div class="recipie-card">
            <img src="https://img.freepik.com/free-photo/traditional-indian-soup-lentils-indian-dhal-spicy-curry-bowl-spices-herbs-rustic-black-wooden-table_2829-18717.jpg?w=740&amp;t=st=1672508714~exp=1672509314~hmac=89f318c0f4b23e4b1b78ae5e67edcea1879b9853ac130e733681b2b3e3d826f7" class="card-images">
            <div class="recipie-detail">
                <h3>${recipe.title}</h3>
                <p>Calories - 300</p>
                <button class="btn" data-recipe-id="${recipe.id}">
                    Get Recipe
                </button>
            </div>
        </div>
    </div>`
}

var renderRecipes = (result) => {
    MealPlanner.meals = result.meals
    MealPlanner.nutrients = result.nutrients
    let htmlContent = MealPlanner.meals.map((meal, index) => getRecipeListCard(meal, index)).join("")
    MealPlanner.recipiesContainer.innerHTML = htmlContent
}

document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.getElementById("recipe-input-form")
    form.addEventListener("submit", getRecipies)
});