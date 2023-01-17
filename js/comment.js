"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Comment_instances, _Comment_ratingNumber, _Comment_ratingNode, _Comment_favouriteNode, _Comment_answerNode, _Comment_getDateString;
// @ts-ignore
class Comment {
    get rating() {
        return __classPrivateFieldGet(this, _Comment_ratingNumber, "f");
    }
    set rating(value) {
        __classPrivateFieldSet(this, _Comment_ratingNumber, value, "f");
        __classPrivateFieldGet(this, _Comment_ratingNode, "f").innerText = value;
        if (this.editRatingCallback) {
            this.editRatingCallback(this);
        }
    }
    get favourite() {
        return this.isFavourite ? 'В избранном' : 'В избранное';
    }
    set favourite(value) {
        this.isFavourite = value;
        __classPrivateFieldGet(this, _Comment_favouriteNode, "f").innerText = this.favourite;
        if (this.editFavouriteCallback) {
            this.editFavouriteCallback(this);
        }
    }
    constructor(comment, editFavouriteCallback, clickOnAnswerCallback, parent = null) {
        _Comment_instances.add(this);
        _Comment_ratingNumber.set(this, void 0);
        // @ts-ignore
        _Comment_ratingNode.set(this, void 0);
        // @ts-ignore
        _Comment_favouriteNode.set(this, void 0);
        // @ts-ignore
        _Comment_answerNode.set(this, void 0);
        this.id = comment.id ? comment.id : Date.now();
        this.parent = parent;
        this.editFavouriteCallback = editFavouriteCallback;
        this.clickOnAnswerCallback = clickOnAnswerCallback;
        this.editRatingCallback = this.editRatingCallback;
        this.author = new Author(comment.author);
        this.date = comment.date;
        this.text = comment.text;
        this.isFavourite = comment.isFavourite || false;
        __classPrivateFieldSet(this, _Comment_ratingNumber, comment.rating || 0, "f");
        if (comment.parent) {
            this.parent = comment.parent;
        }
        if (comment.answers) {
            this.answers = comment.answers.map(answer => {
                // @ts-ignore
                return new Comment(answer, editFavouriteCallback, null, this);
            });
        }
        else {
            this.answers = [];
        }
    }
    getSampleData() {
        const comment = Object.assign(Object.assign({}, this), { rating: this.rating });
        delete comment.node;
        if (comment.answers.length) {
            comment.answers = comment.answers.map((answer) => {
                const savedAnswer = Object.assign(Object.assign({}, answer), { rating: answer.rating, root: undefined, node: undefined, parent: undefined });
                delete savedAnswer.root;
                delete savedAnswer.node;
                delete savedAnswer.parent;
                return savedAnswer;
            });
        }
        return comment;
    }
    render(root) {
        this.node = document.createElement('div');
        this.node.classList.add('comments_comment', 'comment-inf');
        if (this.parent) {
            this.node.classList.add('comment-inf--answer');
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

                  <div class="comment-inf__date">${__classPrivateFieldGet(this, _Comment_instances, "m", _Comment_getDateString).call(this)}</div>
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
            </div>`;
        this.setRatingListeners();
        this.setFavouriteListeners();
        this.setAnswerListener();
        if (root) {
            root.appendChild(this.node);
        }
    }
    setRatingListeners() {
        // @ts-ignore
        __classPrivateFieldSet(this, _Comment_ratingNode, this.node.querySelector('.inf-counter__value'), "f");
        // @ts-ignore
        const plusBtn = this.node.querySelector('.inf-counter__btn--plus');
        // @ts-ignore
        const minusBtn = this.node.querySelector('.inf-counter__btn--minus');
        // @ts-ignore
        plusBtn.addEventListener('click', () => {
            ++this.rating;
        });
        // @ts-ignore
        minusBtn.addEventListener('click', () => {
            --this.rating;
        });
    }
    setFavouriteListeners() {
        // @ts-ignore
        __classPrivateFieldSet(this, _Comment_favouriteNode, this.node.querySelector('.comment-inf__btn-txt--fav'), "f");
        __classPrivateFieldGet(this, _Comment_favouriteNode, "f").addEventListener('click', () => {
            // @ts-ignore
            this.favourite = !this.isFavourite;
            if (this.parent && this.isFavourite) {
                this.parent.favourite = this.isFavourite;
            }
            if (!this.parent && !this.isFavourite) {
                this.answers.forEach((answer) => answer.favourite = this.isFavourite);
            }
        });
    }
    setAnswerListener() {
        // @ts-ignore
        __classPrivateFieldSet(this, _Comment_answerNode, this.node.querySelectorAll('.comment-inf__btn')[0], "f");
        __classPrivateFieldGet(this, _Comment_answerNode, "f").addEventListener('click', () => {
            if (this.clickOnAnswerCallback) {
                this.clickOnAnswerCallback(this);
            }
        });
    }
}
_Comment_ratingNumber = new WeakMap(), _Comment_ratingNode = new WeakMap(), _Comment_favouriteNode = new WeakMap(), _Comment_answerNode = new WeakMap(), _Comment_instances = new WeakSet(), _Comment_getDateString = function _Comment_getDateString() {
    const date = new Date(this.date);
    return `${date.getDate()}.${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
};
