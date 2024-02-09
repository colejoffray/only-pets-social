   //Adding countries for stripe account creation 
   const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", 
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", 
    "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", 
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", 
    "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
    "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", 
    "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
    "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", 
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", 
    "Yemen", "Zambia", "Zimbabwe"
  ];
  
  
  const select = document.getElementById('status')
  
  console.log(select)
  
  countries.forEach(country => {
    const option = document.createElement('option')
    option.value = country
    option.textContent = country
    select.appendChild(option)
  })




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

 


  //On page search user functionality 
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


   //EDIT A POST
  
   function editPost(id, image, caption, title) {
    document.getElementById('title').value = title
    document.getElementById('caption').value = caption
    document.getElementById('editPostImg').src = image
    document.getElementById('editPost').action = `/post/editPost/${id}`
  }




  //delete a post 
  function deletePost(id)  {
    const form = document.getElementById('deleteForm')
    form.action = `/post/delete/${id}`
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
      <div class='left'>
          <img src='${user.profilePic}' class='responsive-img circle small-search-pic'>
          <a href="/profile/${user._id}" class="small-text white-text text-darken-2">${user.userName}</a>
      </div>
      `;
      searchResultsDiv.appendChild(userDiv);
    });
  }



