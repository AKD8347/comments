const store = new Store()
let rootNode: any = null
let commentForm: any = null
let comments: any[] = []
let currentComments: any[] = []

function getMockData() {
    store.getMock().then(response => {
        createComments(response.comments)
    })
}

function getSavedData() {
    const savedComments = store.getStorageData()
    createComments(savedComments)
}

function createComments(savedComments: any) {
    comments = []

    rootNode = document.querySelector('.comments__list')

    savedComments.forEach((comment: string | undefined) => {
        // @ts-ignore
        comments.push(new Comment(comment, null, createAnswer))
    })

    currentComments = [...comments]

    renderAll()
}

function renderAll() {
    clearComments()

    let sortFunc
    if (Select.currentSortBY === Select.sortBY.RATING) {
        sortFunc = sortByRating
    } else if (Select.currentSortBY === Select.sortBY.DATE) {
        sortFunc = sortByDate
    } else {
        sortFunc = sortByAnswers
    }

    sortFunc(currentComments, Select.order)
    renderComments()
}

function getCommentsForSave(comments: any) {
    const commentsForSave: any[] = []

    comments.forEach((comment: { getSampleData: () => any }) => {
        commentsForSave.push(comment.getSampleData())
    })

    return commentsForSave
}

function clearComments() {
    rootNode.replaceChildren()
}

function renderComments(comments = currentComments) {
    comments.forEach(comment => {
        comment.render(rootNode)
        if (comment.answers) {
            renderComments(comment.answers)
        }
    })
}

function findComment(commentId: any) {
    for (let i = 0; i < comments.length; ++i) {
        if (comments[i].id === commentId) {
            return comments[i]
        } else {
            const foundAnswer = comments[i].answers.find((answer: { id: any }) => answer.id === commentId)
            if (foundAnswer) {
                return foundAnswer
            }
        }
    }

    return null
}

function getSampleComment(comment: { isFavourite?: any; getSampleData?: () => any; parent?: any }) {
    // @ts-ignore
    const newComment = comment.getSampleData()
    if (!comment.parent) {
        newComment.answers = []
    }
    return newComment
}

function changeTab(node: Element) {
    const oldActiveTab = document.querySelector('.filters-row__item--active')
    // @ts-ignore
    oldActiveTab.classList.remove('filters-row__item--active')
    node.classList.add('filters-row__item--active')
}

function createCommentForm() {
    const filtersNode = document.querySelector('.filters-row')

    commentForm = new CommentForm((data: string | undefined) => {
        // @ts-ignore
        const comment = new Comment(data, null, createAnswer)
        currentComments.push(comment)
        comments.push(comment)

        setCommentsCount()

        renderAll()
    })

    commentForm.renderAfter(filtersNode)
}

function createAnswer(root: { answers: Comment[]; id: any; node: any }, addToAll = false) {
    commentForm.remove()

    commentForm = new CommentForm((data: string | undefined) => {
        // @ts-ignore
        data.parent = root
        const comment = new Comment(data)
        root.answers.push(comment)
        if (addToAll) {
            const foundComment = findComment(root.id)
            foundComment.answers.push(comment)
        }
        commentForm.remove()

        renderAll()
        createCommentForm()
    })

    commentForm.renderAfter(root.node)
}

function setCommentsCount() {
    const commentsCounter = document.querySelector('.filters-row__counter')
    // @ts-ignore
    commentsCounter.innerText = `(${comments.length})`
}

function saveComments() {
    store.save(getCommentsForSave(comments))
}

window.addEventListener("unload", saveComments);

document.addEventListener("DOMContentLoaded", () => {
    getSavedData()

    const select = new Select(renderAll)

    const commentsBtn = document.querySelectorAll('.filters-row__item')[0]
    const favouriteBtn = document.querySelectorAll('.filters-row__item')[2]

    setCommentsCount()

    createCommentForm()

    favouriteBtn.addEventListener('click', () => {
        changeTab(favouriteBtn)
        commentForm.remove()

        const onEditFavourite = (comment: { id: any; isFavourite: any }) => {
            const foundComment = findComment(comment.id)
            if (foundComment) {
                foundComment.isFavourite = comment.isFavourite
            }
        }

        const onEditRating = (comment: { id: any; rating: any }) => {
            const foundComment = findComment(comment.id)
            if (foundComment) {
                foundComment.rating = comment.rating
            }
        }

        const onCreateAnswer = (root: { answers: Comment[]; id: any; node: any }) => {
            createAnswer(root, true)
        }

        currentComments = []
        comments.forEach(comment => {
            if (comment.isFavourite) {
                  currentComments.push(
                      // @ts-ignore
                    new Comment(getSampleComment(comment), onEditFavourite, onCreateAnswer)
                )
            }

            comment.answers.forEach((answer: { isFavourite?: any; getSampleData?: () => any; parent?: any }) => {
                if (answer.isFavourite) {
                    const parent = currentComments[currentComments.length - 1]
                    const newAnswer = getSampleComment(answer)
                    newAnswer.parent = parent
                    parent.answers.push(
                        // @ts-ignore
                        new Comment(newAnswer, onEditFavourite, onCreateAnswer)
                    )
                }
            })
        })

        clearComments()
        renderAll()
    })

    commentsBtn.addEventListener('click', () => {
        changeTab(commentsBtn)
        commentForm.remove()
        createCommentForm()
        saveComments()
        clearComments()
        getSavedData()
    })
});
