
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


function showOverlay(element) {
    const overlay = element.querySelector('.overlay');
    overlay.style.display = 'flex';
  }
  
  function hideOverlay(element) {
    const overlay = element.querySelector('.overlay');
    overlay.style.display = 'none';
  }

  function confirmDelete(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      // User confirmed, proceed with deletion
      deletePost(postId);
    }else{
        window.location.href = '/profile'
    }
  }
  
  function editPost(postId) {
    // Handle the edit functionality (e.g., redirect to the edit page)
    window.location.href = `/post/edit/${postId}`;
  }
  
  function deletePost(postId) {
    // Handle the delete functionality (e.g., show a confirmation modal)
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      fetch(`/post/delete/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if(!res.ok){
            console.log('Network error, post could not be deleted')
        }
        location.reload()
      })
      .catch(err => {
        console.error(err)
      })

    }
  }

  let timerId;

  function searchUsers() {
    const searchInput = document.getElementById('searchInput').value;

    // Clear the previous timer
    clearTimeout(timerId);

    // Use a timer to introduce a slight delay before making the AJAX request
    timerId = setTimeout(() => {
      // Use AJAX to send a request to the server with the search input
      fetch(`/search/users?query=${searchInput}`)
        .then(response => response.json())
        .then(data => {
          // Handle the data received from the server
          displaySearchResults(data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    }, 300); // Adjust the delay as needed
  }

  function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('searchResults');

    // Check if the input is empty after backspace
    if (document.getElementById('searchInput').value === '') {
        // Clear all past results if the input is empty
        searchResultsDiv.innerHTML = '';
        return;
      }

    // Clear previous results
    searchResultsDiv.innerHTML = '';

    console.log(results)

    // Loop through the results and populate the searchResultsDiv
    results.forEach(user => {
      const userDiv = document.createElement('div');
      userDiv.innerHTML = `
        <div class="search-results-container">
          <img src='${user.profilePic}' class='responsive-img circle small-search-pic'>
          <a href="/profile/${user._id}" class="small-text red-text text-darken-2">${user.userName}</a>
        </div>
      `;
      searchResultsDiv.appendChild(userDiv);
    });
  }


