

const likes = document.querySelectorAll('.likeButton')
const commentButtons = document.querySelectorAll('.comment-button')

//Add event listeners for Liking Posts, Commenting, Following
commentButtons.forEach(el => {
    el.addEventListener('click', addPostComment)
})

likes.forEach(el => 
    el.addEventListener('click', addLike)
    
)

function addPostComment(){
    scrollPosition = window.scrollY
    const comment = this.closest('.comment-container')
    const commentInput = comment.querySelector('.comment-input')
    const commentText = commentInput.value

    console.log(commentText)

    const postId = this.getAttribute('data-id')
    fetch(`/post/addComment/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            id: postId,
            comment: commentText
        })
    })
    .then(result => {
        console.log(result)
        location.reload()
        window.scrollTo(0, scrollPosition)
    })
    .catch(err => {
        console.error(err)
    })
}


function addLike(){
    scrollPosition = window.scrollY
    const postId = this.getAttribute('data-id')
    fetch(`post/addLike/${postId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        // Add any other headers as needed
        },
        body: JSON.stringify({
            id: postId
        }),
  })
    .then(result => {
        if(!result.ok){
            throw new Error('Network response was not ok')
        }
        console.log(result.msg)
        location.reload();
        window.scrollTo(0, scrollPosition)
    })
    .catch(err => {
        console.error('There was a problem with the fetch operation:', err);
    })
}


