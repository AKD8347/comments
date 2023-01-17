class Select {
	public changeSortCallback: any;
    static order = 'DESC'
    static sortBY = {DATE: 'DATE', RATING: 'RATING', ANSWERS: 'ANSWERS'}
    static currentSortBY = Select.sortBY.RATING

    constructor(changeSortCallback: () => void) {
        this.changeSortCallback = changeSortCallback

        const selectBox = document.querySelector(".filters-select__box");
        const selectTitle = document.querySelector(".filters-select__title");
        const selectIcon = document.querySelector(".filters-select__trigger");
        const selectOptions = document.querySelectorAll(".filters-select__option");
        // @ts-ignore
        const sortByArr = Object.values(Select.sortBY)
        selectOptions.forEach((option, i) => {
            // @ts-ignore
            option.dataset.sortBy = sortByArr[i]
        })

        // @ts-ignore
        selectTitle.addEventListener("click", () => {
            // @ts-ignore
            selectBox.classList.toggle("_open");
        });
        // @ts-ignore
        selectIcon.addEventListener("click", () => {
            if (Select.order === 'DESC') {
                // @ts-ignore
                selectIcon.style.transform = 'rotate(180deg)'
                Select.order = 'ASC'
            } else {
                // @ts-ignore
                selectIcon.style.transform = ''
                Select.order = 'DESC'
            }

            this.changeSortCallback()
        });

        document.addEventListener("click", (e) => {
            const withinBoundaries = e
                .composedPath()
                // @ts-ignore
                .includes(document.querySelector(".filters-select"));
            if (!withinBoundaries) {
                // @ts-ignore
                selectBox.classList.remove("_open"); // скрываем элемент т к клик был за его пределами
            }
        });

        Array.prototype.forEach.call(selectOptions, (option) => {
            option.addEventListener("click", () => {
                deleteActiveOption();
                option.classList.add("_active");
                // @ts-ignore
                selectTitle.innerText = option.innerText;
                // @ts-ignore
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
