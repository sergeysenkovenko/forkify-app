export const elements = {
    searchInput: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    searchResList: document.querySelector(".results__list"),
    searchRes: document.querySelector(".results"),
    searchBtn: document.querySelector(".search__btn"),
    searchPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe"),
    shoppingList: document.querySelector(".shopping__list"),
    likesMenu: document.querySelector(".likes__field"),
    likesList: document.querySelector(".likes__list"),
    clearList: document.querySelector(".delete-all__btn")
}

export const elementsStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
                    <div class="${elementsStrings.loader}">
                        <svg>
                            <use href="img/icons.svg#icon-cw"></use>
                        </svg>
                    </div>
                   `
    parent.insertAdjacentHTML("afterbegin", loader);
    elements.searchBtn.setAttribute("disabled", "disabled");
    elements.searchBtn.classList.add("disabled");
}

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);
    if(loader){
        loader.parentElement.removeChild(loader);
        elements.searchBtn.removeAttribute("disabled", "disabled");
        elements.searchBtn.classList.remove("disabled");
    }
}