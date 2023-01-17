"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Store {
    constructor() {
        this.COMMENTS_KEY = 'comments';
    }
    getMock() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('../mock');
            return yield response.json();
        });
    }
    save(comments) {
        const json = JSON.stringify(comments);
        localStorage.setItem(this.COMMENTS_KEY, json);
    }
    getStorageData() {
        const json = localStorage.getItem(this.COMMENTS_KEY);
        if (json) {
            return JSON.parse(json);
        }
        return [];
    }
}
