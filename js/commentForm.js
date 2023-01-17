class CommentForm {
    node
    #buttonNode
    #counterNode
    #textareaNode
    #submitError
    #MAX_TEXT_LENGTH = 1000

    get text() {
        return this.#textareaNode.value
    }

    set text(value) {
        this.#textareaNode.value = value
    }

    constructor(onSubmit) {
        this.onSubmit = onSubmit
    }

    renderAfter(afterNode) {
        this.render()
        afterNode.after(this.node)
    }

    render() {
        this.node = document.createElement('form')
        this.node.classList.add('comments__form', 'com-form')
        this.node.innerHTML = `
            <div class="com-form__col">
              <img
                class="com-form__avatar comments__avatar"
                src="img/user_1.png"
                alt="user"
              />
            </div>

            <div class="com-form__col">
              <p class="com-form__author comments__author">Максим Авдеенко</p>
              <div id="count" class="com-form__symbols">
                Макс. ${this.#MAX_TEXT_LENGTH} символов
              </div>
              <textarea
                id="mainMSG"
                class="com-form__message"
                contenteditable="true"
                cols="70"
                rows="1"
                placeholder="Введите текст сообщения..."
              ></textarea>
            </div>

            <div class="com-form__col">
                <div class="com-form__submit-error" style="opacity: 0">
                    Слишком длинное сообщение
                </div>
              <button class="com-form__submit" disabled type="submit">Отправить</button>
            </div>
         `

        this.#buttonNode = this.node.querySelector('.com-form__submit')
        this.#counterNode = this.node.querySelector('#count')
        this.#submitError = this.node.querySelector('.com-form__submit-error')

        this.setTextareaListener()
        this.setSubmitListener()
    }

    remove() {
        this.node.remove()
    }

    setTextareaListener() {
        const resize = () => {
            const symbols = this.#textareaNode.value.length;
            this.#counterNode.innerText = symbols + `/${this.#MAX_TEXT_LENGTH}`;
            this.#textareaNode.style.cssText = "height: 60px;";
            this.#textareaNode.style.cssText = "height:" + this.#textareaNode.scrollHeight + "px";
        }

        const onInputHandler = () => {
            resize()

            if (this.text.length > this.#MAX_TEXT_LENGTH) {
                this.#counterNode.classList.add('_error')
                this.#buttonNode.disabled = true
                this.#submitError.style.opacity = '1'
            } else if (this.text.length === 0) {
                this.#counterNode.innerText = ` Макс. ${this.#MAX_TEXT_LENGTH} символов`
                this.#buttonNode.disabled = true
                this.#submitError.style.opacity = '0'
            } else {
                this.#counterNode.classList.remove('_error')
                this.#buttonNode.disabled = false
                this.#submitError.style.opacity = '0'
            }
        }

        this.#textareaNode = this.node.querySelector("#mainMSG");
        this.#textareaNode.addEventListener("input", onInputHandler);
    }

    setSubmitListener() {
        this.node.addEventListener('submit', (e) => {
            e.preventDefault()
            if (this.onSubmit && this.text.length) {
                this.onSubmit({
                    text: this.text,
                    date: Date.now(),
                    author: new Author({name: 'Максим Авдеенко', icon: 'img/user_1.png'})
                })

                this.text = ''
                this.#counterNode.innerText = ` Макс. ${this.#MAX_TEXT_LENGTH} символов`
            }
        })
    }
}
