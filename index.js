'use strict';


let ID = 0;
let STORE = [];



function formSubmitHandler(event) {
  event.preventDefault();
  let title = $('#bookmark-title').val();
  let url = $('#bookmark-url').val();
  let desc = $('#bookmark-description').val();
  let rating = $('#bookmark-rating').val();
  console.log(title)
  

  


  if (title === '' || title.length < 3) {

    if ($('.url-title-error').hasClass('hidden')){
      $('.url-title-error').removeClass('hidden'); 
      
    }
    $('.url-title-error').text('Add title');
    
  }
  else if(url === '' || url.length < 7){
    if ($('.url-title-error').hasClass('hidden')) {
      $('.url-title-error').removeClass('hidden');
      
    }
    $('.url-title-error').text('Add URL');
  }
  
  else {
    const newBookmark = {
      title, 
      url,
      desc, 
      rating, 
    }
    $('.url-title-error').removeClass('hidden'); 

    console.log(newBookmark);
    api.createNewBookmark(newBookmark).then(response => {
      STORE.push(response);
      displayResults("all");
    });
    
  }
  
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
    `<div class="new-bookmarks"><li class="click-to-hide-li">
            <h3 class="click-to-hide title-style">${bookmark.title} | Rating: ${bookmark.rating} </h3>
            <p class="hide-this hidden">${bookmark.desc}</p>
            <a href=${bookmark.url} class="hide-this hidden"><button class="button-style-inside">Visit</button></a>
            <button data-id="${bookmark.id}" class="delete-button hide-this hidden button-style-inside">Delete</button>
            <button class="edit-button hide-this hidden button-style-inside">Edit</button>
           
           
          <form data-id=${bookmark.id}  class="toggle-edit-form submit-edit-form hidden">
            <input value=${bookmark.title} id="bookmark-title" class="new-bookmark-form" placeholder="title">
            <input value=${bookmark.url} id="bookmark-url" class="new-bookmark-form" placeholder="url"><br>
            <input value=${bookmark.desc} id="bookmark-description" class="new-bookmark-form" placeholder="description">
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
          
          
            
      </li></div>`;
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
Functions to be called at Page load.
*/
let returnApi = api.fetchAllBookmarks();
returnApi.then(data=>{
  STORE = data;
  displayResults("all");
})
//console.log(returnApi);


displayResults("all");
oneTimeEventHandlers();
//createEventHandlers();




