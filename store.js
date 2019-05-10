'use strict';


let ID = 0;
const STORE = [
 {
    id: 0, title: 'Article on Cats', url: 'http://www.catsrcool.com',
    description: 'article about cats', rating: 5, expanded: true
  },
  {
    id: 1, title: 'Article on Birds', url: 'http://www.birdsrcool.com',
    description: 'article about birds', rating: 4, expanded: true
  },

];

function displayResults(minRating) {
  $('#new-bookmark-list').empty();

  for (let i = 0; i < STORE.length; i++) {
    
    let  bookmark = STORE[i];
    console.log(typeof(minRating) );
    console.log( typeof(bookmark) );
    if(minRating == 'all') {
      console.log(bookmark);
      let bookmarkHTML = 
        `<li class="click-to-hide">
            <h3>${bookmark.title}</h3>
            <p class="hide-this">${bookmark.description}</p>
            <p>${bookmark.rating}</p>
        </li>`;

      console.log(bookmarkHTML);
      let bookmarkListElement = $('#new-bookmark-list');
      bookmarkListElement.append(bookmarkHTML);
      

    } else if (minRating == bookmark.rating){  
      let bookmarkHTML =
        `<li class="click-to-hide">
            <h3>${bookmark.title}</h3>
            <p class="hide-this">${bookmark.description}</p>
            <p>${bookmark.rating}</p>
        </li>`;

      console.log(bookmarkHTML);
      let bookmarkListElement = $('#new-bookmark-list');
      bookmarkListElement.append(bookmarkHTML);
      hideDescription();
    
    }
  }

  

} //  $('#new-bookmark-list').append(bookmarkHTML);
  





$("#filter-bookmark-rating").on("change", handleRatingChange)
//need to review this

function handleRatingChange(event){
  let rating = $('#filter-bookmark-rating').val();//event.target.val()

  displayResults(rating);
}


// function displayToggleResults() {

//   for (let i = 0; i < STORE.length; i++) {
//   let toggleInfo = STORE[i]
//   if ()

// }
// }

function hideDescription() {
  $('.click-to-hide').click(function () {
    $(this).children('.hide-this').toggle();
    
  
    
    
    
  });

  
}




function handleSubmitNewBookmark() {
  $('#add-new-bookmark').on("submit", function(event) {
      event.preventDefault();
      console.log(event.target);
      
    ID += 1
    const newBookmark = {
      id: ID,
      title: $('#bookmark-title').val(),
      url: $('#bookmark-url').val(),
      description: $('#bookmark-description').val(),
      rating: $('#bookmark-rating').val(),
      expanded: false, 
    }
  console.log(newBookmark);
    STORE.push(newBookmark);
    displayResults("all");
   
   
  });
}

handleSubmitNewBookmark();


displayResults("all");
hideDescription();


