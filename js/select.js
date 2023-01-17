class Select {
    static order = 'DESC'
    static sortBY = {DATE: 'DATE', RATING: 'RATING', ANSWERS: 'ANSWERS'}
    static currentSortBY = Select.sortBY.RATING

    constructor(changeSortCallback) {
        this.changeSortCallback = changeSortCallback

        const selectBox = document.querySelector(".filters-select__box");
        const selectTitle = document.querySelector(".filters-select__title");
        const selectIcon = document.querySelector(".filters-select__trigger");
        const selectOptions = document.querySelectorAll(".filters-select__option");

        const sortByArr = Object.values(Select.sortBY)
        selectOptions.forEach((option, i) => {
            option.dataset.sortBy = sortByArr[i]
        })

        selectTitle.addEventListener("click", () => {
            selectBox.classList.toggle("_open");
        });
        selectIcon.addEventListener("click", () => {
            if (Select.order === 'DESC') {
                selectIcon.style.transform = 'rotate(180deg)'
                Select.order = 'ASC'
            } else {
                selectIcon.style.transform = ''
                Select.order = 'DESC'
            }

            this.changeSortCallback()
        });

        document.addEventListener("click", (e) => {
            const withinBoundaries = e
                .composedPath()
                .includes(document.querySelector(".filters-select"));
            if (!withinBoundaries) {
                selectBox.classList.remove("_open"); // скрываем элемент т к клик был за его пределами
            }
        });

        Array.prototype.forEach.call(selectOptions, (option) => {
            option.addEventListener("click", () => {
                deleteActiveOption();
                option.classList.add("_active");
                selectTitle.innerText = option.innerText;
                selectBox.classList.remove("_open");
                Select.currentSortBY = option.dataset.sortBy

                this.changeSortCallback()
            });
        });

        function deleteActiveOption() {
            Array.prototype.forEach.call(selectOptions, (option) => {
                option.classList.remove("_active");
            });
        }
    }
}
