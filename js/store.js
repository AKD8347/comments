class Store {
    COMMENTS_KEY = 'comments'

    async getMock() {
        const response = await fetch('../mock')
        return await response.json()
    }

    save(comments) {
        const json = JSON.stringify(comments)
        localStorage.setItem(this.COMMENTS_KEY, json)
    }

    getStorageData() {
        const json = localStorage.getItem(this.COMMENTS_KEY)
        if (json) {
            return JSON.parse(json)
        }

        return []
    }
}
