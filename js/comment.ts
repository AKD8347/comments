// @ts-ignore
class Comment {
	public editRatingCallback: any;
	public isFavourite: any;
	public editFavouriteCallback: any;
	public id: any;
	public parent: any;
	public clickOnAnswerCallback: any;
	public author: any;
	public date: any;
	public text: any;
	public answers: any;
    node: HTMLDivElement | undefined

    #ratingNumber
    // @ts-ignore
    #ratingNode
    // @ts-ignore
    #favouriteNode
    // @ts-ignore
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

    constructor(comment: { id: any; author: { name: any; icon: any; }; date: any; text: any; isFavourite: boolean; rating: number; parent: any; answers: any[]; }, editFavouriteCallback: any, clickOnAnswerCallback: any, parent = null) {
        this.id = comment.id ? comment.id : Date.now()
        this.parent = parent
        this.editFavouriteCallback = editFavouriteCallback
        this.clickOnAnswerCallback = clickOnAnswerCallback
        this.editRatingCallback = this.editRatingCallback
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
                // @ts-ignore
                return new Comment(answer, editFavouriteCallback, null, this)
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
            comment.answers = comment.answers.map((answer: { rating: any; }) => {
                const savedAnswer = {...answer, rating: answer.rating, root: undefined,
                    node: undefined,
                    parent: undefined
                }

                delete savedAnswer.root
                delete savedAnswer.node
                delete savedAnswer.parent

                return savedAnswer
            })
        }

        return comment
    }

    render(root: { appendChild: (arg0: HTMLDivElement) => void; }) {
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
        // @ts-ignore
        this.#ratingNode = this.node.querySelector('.inf-counter__value')

        // @ts-ignore
        const plusBtn = this.node.querySelector('.inf-counter__btn--plus')
        // @ts-ignore
        const minusBtn = this.node.querySelector('.inf-counter__btn--minus')

        // @ts-ignore
        plusBtn.addEventListener('click', () => {
            ++this.rating
        })

        // @ts-ignore
        minusBtn.addEventListener('click', () => {
            --this.rating
        })
    }

    setFavouriteListeners() {
        // @ts-ignore
        this.#favouriteNode = this.node.querySelector('.comment-inf__btn-txt--fav')

        this.#favouriteNode.addEventListener('click', () => {
            // @ts-ignore
            this.favourite = !this.isFavourite
            if (this.parent && this.isFavourite) {
                this.parent.favourite = this.isFavourite
            }

            if (!this.parent && !this.isFavourite) {
                this.answers.forEach((answer: { favourite: any; }) => answer.favourite = this.isFavourite)
            }
        })
    }

    setAnswerListener() {
        // @ts-ignore
        this.#answerNode = this.node.querySelectorAll('.comment-inf__btn')[0]

        this.#answerNode.addEventListener('click', () => {
            if (this.clickOnAnswerCallback) {
                this.clickOnAnswerCallback(this)
            }
        })
    }
}
