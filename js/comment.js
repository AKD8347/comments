class Comment {
    node

    #ratingNumber
    #ratingNode
    #favouriteNode
    #answerNode

    get rating() {
        return this.#ratingNumber
    }

    set rating(value) {
        this.#ratingNumber = value
        this.#ratingNode.innerText = value
        if (this.editRatingCallback) {
            this.editRatingCallback(this)
        }
    }

    get favourite() {
        return this.isFavourite ? 'В избранном' : 'В избранное'
    }

    set favourite(value) {
        this.isFavourite = value
        this.#favouriteNode.innerText = this.favourite
        if (this.editFavouriteCallback) {
            this.editFavouriteCallback(this)
        }
    }

    constructor(comment, editFavouriteCallback, clickOnAnswerCallback, editRatingCallback, parent = null) {
        this.id = comment.id ? comment.id : Date.now()
        this.parent = parent
        this.editFavouriteCallback = editFavouriteCallback
        this.clickOnAnswerCallback = clickOnAnswerCallback
        this.editRatingCallback = editRatingCallback
        this.author = new Author(comment.author)
        this.date = comment.date
        this.text = comment.text
        this.isFavourite = comment.isFavourite || false
        this.#ratingNumber = comment.rating || 0

        if (comment.parent) {
            this.parent = comment.parent
        }

        if (comment.answers) {
            this.answers = comment.answers.map(answer => {
                return new Comment(answer, editFavouriteCallback, null, editRatingCallback, this)
            })
        } else {
            this.answers = []
        }
    }

    #getDateString() {
        const date = new Date(this.date)
        return `${date.getDate()}.${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`
    }

    getSampleData() {
        const comment = {...this, rating: this.rating}

        delete comment.node

        if (comment.answers.length) {
            comment.answers = comment.answers.map(answer => {
                const savedAnswer = {...answer, rating: answer.rating}

                delete savedAnswer.root
                delete savedAnswer.node
                delete savedAnswer.parent

                return savedAnswer
            })
        }

        return comment
    }

    render(root) {
        this.node = document.createElement('div')
        this.node.classList.add('comments_comment', 'comment-inf')

        if (this.parent) {
            this.node.classList.add('comment-inf--answer')
        }

        this.node.innerHTML = `
            <div class="comments__comment comment-inf">
              <div class="comment-inf__col">
                <img class="comments__avatar" src="${this.author.icon}" alt="user" />
              </div>

              <div class="comment-inf__col">
                <div class="comment-inf__head">
                  <p class="comments__author comment-inf__author">
                    ${this.author.name}
                  </p>

                  <div class="comment-inf__date">${this.#getDateString()}</div>
                </div>
                <div class="comment-inf__text">
                    ${this.text}
                </div>
                <div class="comment-inf__footer">
                    ${!this.parent ? `
                        <button class="comment-inf__btn">
                            <span class="comment-inf__btn-txt">Ответить</span>
                            <img
                                class="comment-inf__icon"
                                src="./img/icons/arrow-answ.svg"
                                alt=""
                            />
                        </button>` : ''}

                  <button class="comment-inf__btn">
                    <span class="comment-inf__btn-txt comment-inf__btn-txt--fav">
                        ${this.isFavourite ? 'В избранном' : 'В избранное'}
                    </span>
                    <img
                      class="comment-inf__icon"
                      src="./img/icons/like.svg"
                      alt=""
                    />
                  </button>

                  <div class="comment-inf__btn inf-counter">
                    <div class="inf-counter__btn inf-counter__btn--plus">+</div>
                    <div class="inf-counter__value">${this.rating}</div>
                    <div class="inf-counter__btn inf-counter__btn--minus">
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>`

        this.setRatingListeners()
        this.setFavouriteListeners()
        this.setAnswerListener()

        if (root) {
            root.appendChild(this.node)
        }
    }

    setRatingListeners() {
        this.#ratingNode = this.node.querySelector('.inf-counter__value')

        const plusBtn = this.node.querySelector('.inf-counter__btn--plus')
        const minusBtn = this.node.querySelector('.inf-counter__btn--minus')

        plusBtn.addEventListener('click', () => {
            ++this.rating
        })

        minusBtn.addEventListener('click', () => {
            --this.rating
        })
    }

    setFavouriteListeners() {
        this.#favouriteNode = this.node.querySelector('.comment-inf__btn-txt--fav')

        this.#favouriteNode.addEventListener('click', () => {
            this.favourite = !this.isFavourite
            if (this.parent && this.isFavourite) {
                this.parent.favourite = this.isFavourite
            }

            if (!this.parent && !this.isFavourite) {
                this.answers.forEach(answer => answer.favourite = this.isFavourite)
            }
        })
    }

    setAnswerListener() {
        this.#answerNode = this.node.querySelectorAll('.comment-inf__btn')[0]

        this.#answerNode.addEventListener('click', () => {
            if (this.clickOnAnswerCallback) {
                this.clickOnAnswerCallback(this)
            }
        })
    }
}
