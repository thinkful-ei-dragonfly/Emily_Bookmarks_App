'use strict';


let ID = 0;
let STORE = [
  // {
  //   id: 0, title: 'LOCAL Article on Cats', url: 'http://www.catsrcool.com',
  //   description: 'article about cats', rating: 5, expanded: true
  // },
  // {
  //   id: 1, title: 'LOCAL Article on Birds', url: 'http://www.birdsrcool.com',
  //   description: 'article about birds', rating: 4, expanded: true
  // },

];

/*
EVENT HANDLERS
  - formSubmitHandler
  - formToggleHandler
  - detailToggleHandler
  - deleteButtonHandler
  - editHandler //TODO
*/

function formSubmitHandler(event) {
  event.preventDefault();
  const newBookmark = {
    title: $('#bookmark-title').val(),
    url: $('#bookmark-url').val(),
    description: $('#bookmark-description').val(),
    rating: $('#bookmark-rating').val(),
    expanded: false,
  }
  console.log(newBookmark);
  api.createNewBookmark(newBookmark).then(response=>{
    STORE.push(response)
    displayResults("all");
  });
  //STORE.push(newBookmark);
  //displayResults("all");
}

function formToggleHandler(event){
  event.preventDefault();
  $('.hide-form').toggleClass('hidden');
}


function detailToggleHandler(event){
  console.log("running")
  let targetElement = event.target;
  let siblings = $(targetElement).siblings(".hide-this");
  siblings.toggle();
}

function deleteButtonHandler(event) {
  var dataId = $(this).attr("data-id");
  
  api.deleteBookMark(dataId)
    .then(response => {
      STORE = STORE.filter((bookmark) => bookmark.id != dataId);
      let rating = $('#filter-bookmark-rating').val();
      displayResults(rating);
    });
  
  console.log(STORE);
  
}

function editButtonHandler(event){
  event.preventDefault();
  let targetElement = event.target;
  $(targetElement).siblings(".toggle-edit-form").toggleClass('hidden');

}

function editFormSubmitHandler(event){
  event.preventDefault();
  console.log("got em")
  const data_id = event.target.getAttributes("data-id");
  const bookmarkTitle = event.target.getAttributes("")

  const newBookmark = {
    id:data_id,
    title: $('#bookmark-title').val(),
    url: $('#bookmark-url').val(),
    description: $('#bookmark-description').val(),
    rating: $('#bookmark-rating').val(),
    
  }
  console.log(newBookmark);
  let patchRequest = api.updateBookMark(newBookmark);
  patchRequest.then(response => {
    for (let i = 0; i < response.length; i++){
      if (response[i].id == STORE.id) {
        STORE.push(response[i].id);
        displayResults("all");
      }
    }
    
  });


}

function minRatingChangeHandler(event){
  let rating = $('#filter-bookmark-rating').val();//event.target.val()
  displayResults(rating);
}


/*
We need to create event listners. 
*/
function oneTimeEventHandlers(){
  $('#add-new-bookmark').on("submit",formSubmitHandler); 
  $('#click-to-toggle-form').click(formToggleHandler); //
  $("#filter-bookmark-rating").on("change", minRatingChangeHandler)
}
function createEventHandlers(){
  $(".click-to-hide").click(detailToggleHandler); //Needs to re-called after store update + re-render.
  $(".delete-button").on("click",deleteButtonHandler); 

  $(".edit-button").on("click", editButtonHandler);
  $(".submit-edit-form").on("submit", editFormSubmitHandler);
}

/*
Render Function
*/
function bookmarkToHtml(bookmark) {
  let bookmarkHTML =
    `<li class="click-to-hide-li border-style">
            <h3 class="click-to-hide">${bookmark.title} | ${bookmark.rating} </h3>
            <p class="hide-this hidden">${bookmark.description}</p>
            <a href=${bookmark.url} class="hide-this hidden"><button>Visit</button></a>
            <button data-id="${bookmark.id}" class="delete-button hide-this hidden">Delete</button>
            <button class="edit-button hide-this hidden">Edit</button>
            
           
          <form data-id=${bookmark.id}  class="toggle-edit-form submit-edit-form hidden">
            <input value=${bookmark.title} id="bookmark-title" class="new-bookmark-form" placeholder="title">
            <input value=${bookmark.url} id="bookmark-url" class="new-bookmark-form" placeholder="url"><br>
            <input value=${bookmark.description} id="bookmark-description" class="new-bookmark-form" placeholder="description">
            <select placeholder=${bookmark.rating} id="bookmark-rating" class="new-bookmark-form">
                <option selected disabled>${bookmark.rating}</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            </select>
            <input  type="submit" id="submit-new-bookmark" value="Update">

          </form>
          
          
            
      </li>`;
  return bookmarkHTML;

}

function displayResults(minRating) {
  //step 1: empty existing list 
  $('#new-bookmark-list').empty();
  //step 2: loop through items in store
  for (let i = 0; i < STORE.length; i++) {
    let bookmark = STORE[i];
    if (minRating == 'all') {
      let bookmarkHtml = bookmarkToHtml(bookmark);
      let bookmarkListElement = $('#new-bookmark-list');
      bookmarkListElement.append(bookmarkHtml);
    } else if (minRating == bookmark.rating) {
      let bookmarkHTML = bookmarkToHtml(bookmark);

      let bookmarkListElement = $('#new-bookmark-list');
      bookmarkListElement.append(bookmarkHTML);
    }
  }

  createEventHandlers();

}

/*
api calls
*/
//
const api = function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/emily/bookmarks';

  const listApiFetch = function (...args) {
    // setup var in scope outside of promise chain
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // if response is not 2xx, start building error object
          error = { code: res.status };

          // if response is not JSON type, place Status Text in error object and
          // immediately reject promise
          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }

        // otherwise, return parsed JSON
        return res.json();
      })
      .then(data => {
        // if error exists, place the JSON message into the error object and 
        // reject the Promise with your error object so it lands in the next 
        // catch.  IMPORTANT: Check how the API sends errors -- not all APIs
        // will respond with a JSON object containing message key
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        // otherwise, return the json as normal resolved Promise
        return data;
      });
  };






  const fetchAllBookmarks = function (bookmark){
    return listApiFetch(BASE_URL);
  };

    

  const createNewBookmark = function (bookmark){
    return listApiFetch(BASE_URL, {
      "method": "POST",
      "headers": {"Content-Type": "application/json"},
      "body": JSON.stringify(bookmark)
    }); 
   
  };
  const updateBookMark = function (bookmark) {
    return listApiFetch(BASE_URL + "/" + bookmark.id, {
      "method": "PATCH",
      "headers": { "Content-Type": "application/json" },
      "body": JSON.stringify(bookmark)
    });
 
  };

  const deleteBookMark = function (bookmark_id) {
    return listApiFetch(BASE_URL + "/" + bookmark_id, {
      "method": "DELETE",
    });
      
  };
    
  return {
    fetchAllBookmarks,
    createNewBookmark,
    updateBookMark,
    deleteBookMark,

  };

}();












/*
Functions to be called at Page load.
*/
let returnApi = api.fetchAllBookmarks();
returnApi.then(data=>{
  console.log(data)
  STORE = data;
  displayResults("all");
})
//console.log(returnApi);


displayResults("all");
oneTimeEventHandlers();
//createEventHandlers();






// ////////
// function hideDescription() {
//   $('#document').ready(function () {
//     $('.click-to-hide').toggle();



//   });
// }

// function hideForm() {
//   $(document).ready(function () {
//     $('#click-to-toggle-form').click(function (event) {
//       event.preventDefault();
//       $('.hide-form').toggleClass('hidden');
//     });

//   });
// }



// ///////
// function deleteBookmarkHandler() {
//   $("#delete-button").on("click", function () {
//     var dataId = $(this).attr("data-id");
//     console.log(dataId);
//   });
// }
// //

// function handleSubmitNewBookmark() {
//   $('#add-new-bookmark').on("submit", function (event) {



//   });
// }

















// $("#filter-bookmark-rating").on("change", handleRatingChange)
// //need to review this

// function handleRatingChange(event) {
//   let rating = $('#filter-bookmark-rating').val();//event.target.val()

//   displayResults(rating);
// }


// // function displayToggleResults() {

// //   for (let i = 0; i < STORE.length; i++) {
// //   let toggleInfo = STORE[i]
// //   if ()

// // }
// // }





// // handleSubmitNewBookmark();

// // hideDescription();
// // hideForm();
// // deleteBookmarkHandler();




