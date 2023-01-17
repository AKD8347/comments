function sortByRating(comments: any[], order: string) {
    if (order === 'ASC') {
        comments.sort((a, b) => a.rating >= b.rating ? 1 : -1)
    } else {
        comments.sort((a, b) => a.rating <= b.rating ? 1 : -1)
    }

    comments.forEach(comment => {
        if (comment.answers.length) {
            sortByRating(comment.answers, order)
        }
    })
}

function sortByDate(comments: any[], order: string) {
    if (order === 'ASC') {
        comments.sort((a, b) => a.date >= b.date ? 1 : -1)
    } else {
        comments.sort((a, b) => a.date <= b.date ? 1 : -1)
    }

    comments.forEach(comment => {
        if (comment.answers.length) {
            sortByDate(comment.answers, order)
        }
    })
}

function sortByAnswers(comments: any[], order: string) {
    if (order === 'ASC') {
        comments.sort((a, b) => a.answers.length >= b.answers.length ? 1 : -1)
    } else {
        comments.sort((a, b) => a.answers.length <= b.answers.length ? 1 : -1)
    }
}
