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
var _CommentForm_buttonNode, _CommentForm_counterNode, _CommentForm_textareaNode, _CommentForm_submitError, _CommentForm_MAX_TEXT_LENGTH;
class CommentForm {
    get text() {
        return __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").value;
    }
    set text(value) {
        __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").value = value;
    }
    constructor(onSubmit) {
        // @ts-ignore
        _CommentForm_buttonNode.set(this, void 0);
        // @ts-ignore
        _CommentForm_counterNode.set(this, void 0);
        // @ts-ignore
        _CommentForm_textareaNode.set(this, void 0);
        // @ts-ignore
        _CommentForm_submitError.set(this, void 0);
        _CommentForm_MAX_TEXT_LENGTH.set(this, 1000);
        this.onSubmit = onSubmit;
    }
    renderAfter(afterNode) {
        this.render();
        afterNode.after(this.node);
    }
    render() {
        this.node = document.createElement('form');
        this.node.classList.add('comments__form', 'com-form');
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
                Макс. ${__classPrivateFieldGet(this, _CommentForm_MAX_TEXT_LENGTH, "f")} символов
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
         `;
        __classPrivateFieldSet(this, _CommentForm_buttonNode, this.node.querySelector('.com-form__submit'), "f");
        __classPrivateFieldSet(this, _CommentForm_counterNode, this.node.querySelector('#count'), "f");
        __classPrivateFieldSet(this, _CommentForm_submitError, this.node.querySelector('.com-form__submit-error'), "f");
        this.setTextareaListener();
        this.setSubmitListener();
    }
    remove() {
        // @ts-ignore
        this.node.remove();
    }
    setTextareaListener() {
        const resize = () => {
            const symbols = __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").value.length;
            __classPrivateFieldGet(this, _CommentForm_counterNode, "f").innerText = symbols + `/${__classPrivateFieldGet(this, _CommentForm_MAX_TEXT_LENGTH, "f")}`;
            __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").style.cssText = "height: 60px;";
            __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").style.cssText = "height:" + __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").scrollHeight + "px";
        };
        const onInputHandler = () => {
            resize();
            if (this.text.length > __classPrivateFieldGet(this, _CommentForm_MAX_TEXT_LENGTH, "f")) {
                __classPrivateFieldGet(this, _CommentForm_counterNode, "f").classList.add('_error');
                __classPrivateFieldGet(this, _CommentForm_buttonNode, "f").disabled = true;
                __classPrivateFieldGet(this, _CommentForm_submitError, "f").style.opacity = '1';
            }
            else if (this.text.length === 0) {
                __classPrivateFieldGet(this, _CommentForm_counterNode, "f").innerText = ` Макс. ${__classPrivateFieldGet(this, _CommentForm_MAX_TEXT_LENGTH, "f")} символов`;
                __classPrivateFieldGet(this, _CommentForm_buttonNode, "f").disabled = true;
                __classPrivateFieldGet(this, _CommentForm_submitError, "f").style.opacity = '0';
            }
            else {
                __classPrivateFieldGet(this, _CommentForm_counterNode, "f").classList.remove('_error');
                __classPrivateFieldGet(this, _CommentForm_buttonNode, "f").disabled = false;
                __classPrivateFieldGet(this, _CommentForm_submitError, "f").style.opacity = '0';
            }
        };
        // @ts-ignore
        __classPrivateFieldSet(this, _CommentForm_textareaNode, this.node.querySelector("#mainMSG"), "f");
        __classPrivateFieldGet(this, _CommentForm_textareaNode, "f").addEventListener("input", onInputHandler);
    }
    setSubmitListener() {
        // @ts-ignore
        this.node.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.onSubmit && this.text.length) {
                this.onSubmit({
                    text: this.text,
                    date: Date.now(),
                    author: new Author({ name: 'Максим Авдеенко', icon: 'img/user_1.png' })
                });
                this.text = '';
                __classPrivateFieldGet(this, _CommentForm_counterNode, "f").innerText = ` Макс. ${__classPrivateFieldGet(this, _CommentForm_MAX_TEXT_LENGTH, "f")} символов`;
            }
        });
    }
}
_CommentForm_buttonNode = new WeakMap(), _CommentForm_counterNode = new WeakMap(), _CommentForm_textareaNode = new WeakMap(), _CommentForm_submitError = new WeakMap(), _CommentForm_MAX_TEXT_LENGTH = new WeakMap();
