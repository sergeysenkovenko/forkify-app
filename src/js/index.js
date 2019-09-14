import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likeView from './views/likeView'
import { elements, renderLoader, removeLoader } from './views/base';

const state = {}

window.addEventListener("load", () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likeView.toggleLikeMenu(state.likes.getLikesCount());

    state.likes.likes.forEach(el => {
        likeView.renderItem(el);
    })
})

const controlSearch = async () => {
    const query = searchView.getInput();
    if(query && query!== ' ') {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearSearchList();
        try{
            renderLoader(elements.searchRes)
            await state.search.getResult();
            removeLoader();
            searchView.renderResults(state.search.result)
        }
        catch (error){
            alert("Searching error...")
            removeLoader();
        }
    }
}

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

elements.searchPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchList();
        searchView.renderResults(state.search.result, goToPage)
    }
});

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if(id){
        recipeView.clearRecipe();
        if(state.search){
            searchView.highlightSelected(id);
        }
        renderLoader(elements.recipe);
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            removeLoader();
        }
        catch (error) {
            alert("Error processing recipe");
            removeLoader();
        }
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
        )
    }
}

const controlList = () => {
    if(!state.list){
        state.list = new List();
        controlListRender();
    }else if(state.list && state.list.items.length === 0){
            controlListRender();  
          }
}

const controlListRender = () => {
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

const controlLike = () => {
    if(!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)){
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.image,
        );
        likeView.toggleLikeBtn(true);
        likeView.renderItem(newLike);
    }else {
    state.likes.deleteLike(currentID);
    likeView.toggleLikeBtn(false);
    likeView.deleteItem(currentID);
    }
    likeView.toggleLikeMenu(state.likes.getLikesCount())
}

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener("click", e =>{
    if(e.target.matches(".btn-decrease, .btn-decrease *")){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.servingsUpdate(state.recipe);
        }
    }else if(e.target.matches(".btn-increase, .btn-increase *")){
            state.recipe.updateServings('inc');
            recipeView.servingsUpdate(state.recipe);
    }else if(e.target.matches(".shopping__btn, .shopping__btn *")){
        controlList();
        listView.toggleClearListBtn(state.list.getListCount());
    }else if(e.target.matches(".recipe__love, .recipe__love *")){
        controlLike();
    }
});

elements.shoppingList.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.id;

    if(e.target.matches(".shopping__delete, .shopping__delete *")){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if(e.target.matches(".shopping__count-value")){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

    listView.toggleClearListBtn(state.list.getListCount());
});

elements.clearList.addEventListener("click", e => {
    if(e.target.matches(".delete-all__btn, .delete-all__btn *")){
        state.list.deleteAllItems();
        listView.clearList();
    }
    listView.toggleClearListBtn(state.list.getListCount());
});

