var MealPlanner = {
    meals: [],
    nutrients: {},
    recipiesContainer: document.getElementById("recipies"),
    recipeDetails: document.getElementById("recipe-details")
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
                <button class="btn btn-recipe" data-recipe-id="${recipe.id}">
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
    var btns = document.getElementsByClassName("btn-recipe")
    Array.from(btns).forEach(element => {
        element.addEventListener("click", getRecipe)
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    const form = document.getElementById("recipe-input-form")
    form.addEventListener("submit", getRecipies)
});

var getRecipe = (event) => {
    const url = `https://api.spoonacular.com/recipes/${event.target.dataset.recipeId}/information?apiKey=0adeda532af84a148480f5b2a623f963`
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(url, requestOptions)
    .then(res => res.json())
    .then(renderRecipe)
}

var renderRecipe = (response) => {
    // Render here
    //MealPlanner.recipeDetails
    MealPlanner.recipeDetails.querySelector("#ingredients").innerHTML = "<ol>" + response.extendedIngredients.map(ingredient => `<li>
        <div class="tab-row">
            <div class="row-label">${ingredient.name}</div>
            <div class="row-value">${ingredient.measures.us.amount + " " + ingredient.measures.us.unitShort}</div>
        </div>
    </li>`).join("") + "</ol>" 
    MealPlanner.recipeDetails.querySelector("#steps").innerHTML = response.instructions

    let equipments = []
    response.analyzedInstructions.forEach(analyzedInstruction => {
        analyzedInstruction.steps.forEach(step => {
            equipments = equipments.concat(step.equipment.map(equipment => equipment.name))
        })
    })

    equipments = Array.from(new Set(equipments))
    MealPlanner.recipeDetails.querySelector("#equipment").innerHTML = "<ol>" + equipments.map(equipment => `<li>
        <div class="tab-row">
            ${equipment}
        </div>
    </li>`).join("") + "</ol>"

    MealPlanner.recipeDetails.style.display = ""
}

var btns = document.getElementsByClassName("btn-recipe")
Array.from(btns).forEach(element => {
    element.addEventListener("click", getRecipe)
});