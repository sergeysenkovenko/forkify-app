import { elements } from './base';

export const getInput = () => elements.searchInput.value

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearSearchList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchPages.innerHTML = '';
}

export const cutRecipeTitle = (title, limit = 17) => {
    const cutTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                cutTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //returning result title
        return `${cutTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe =>{
    const markup = 
                `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${cutRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
                `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}

const createPaginationBtn = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`

const renderPagination = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1){
        button = createPaginationBtn(page, 'next');
    }else if(page < pages){
        button = `
        ${createPaginationBtn(page, 'next')}
        ${createPaginationBtn(page, 'prev')}
        `
    }else if(page === pages && pages > 1){
        button = createPaginationBtn(page, 'prev');
    }

    elements.searchPages.insertAdjacentHTML("afterbegin", button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(elem => {
        renderRecipe(elem);
    });

    renderPagination(page, recipes.length, resPerPage)
}

export const highlightSelected = id => {
    const resArr = Array.from(document.querySelectorAll(".results__link"));
    resArr.forEach(el => {
        el.classList.remove("results__link--active");
    });
    const elem = document.querySelector(`.results__link[href="#${id}"]`)
    if(elem) elem.classList.add("results__link--active")
}