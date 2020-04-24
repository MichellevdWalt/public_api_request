
let twelvePeople;

// Function to get 12 users from API.
async function results(){
    let receiveData;
    const get = await fetch('https://randomuser.me/api/?results=12&nat=GB')
    .then (data => data.json())
    .then (data => receiveData = data)
    .catch(error => console.log("Something went wrong: " + error));
    twelvePeople = await receiveData.results;
}

//Function to create cards
function createCards(image, name, email, location, number){
    const galleryDiv = document.querySelector('.gallery');   
    const createDiv = document.createElement('div');
    createDiv.className = 'card active';
    createDiv.id = number;
    galleryDiv.appendChild(createDiv);
   
    createDiv.innerHTML = `
        <div class="card-img-container">
            <img class="card-img" src="${image}" alt="profile picture" </img>
        </div>
        <div class="card-info-container">
            <h3 id="card-name" class="card-name cap">${name}</h3>
            <p class= "card-text">${email}</p>
            <p class="card-text cap">${location}</p>
        </div>
    `; 
 }
 
 //Function to call createcards() and populate the cards with necessary data collected from results().
 async function addDetails(){
    let count = 0;
    await results();
        for (var i = 0; i < 12; i +=1){
           createCards(twelvePeople[i].picture.medium, 
                twelvePeople[i].name.first + " " + twelvePeople[i].name.last, 
                twelvePeople[i].email, 
                twelvePeople[i].location.city + ', ' + twelvePeople[i].location.country, 
                count)
      count += 1;
 };
}

//Function to format date of birth into birthday
function birthday(date){
    let getDate = new Date(date.dob.date);
    getDate = getDate.toString();
    getDate = getDate.slice(4,15); 
    return getDate;
}

//Function to add functionality to close button in modal.
function closeModalOnClick(){
    const modals = document.querySelectorAll('.modal-container');
    for (var i = 0; i< modals.length; i+= 1) {
        modals[i].id = i;
         if(modals[i].style.display === ""){
          modals[i].remove();
         }
    }
}

//Function to disable previous or next button in modal if it's the first or last item. (Works in filtered items as well).
function disablePrevNext(){
    const prevButton = document.querySelector('.modal-prev');
    const nextButton = document.querySelector('.modal-next');
    let currentNumber = 0;
    const activeCardsName = document.querySelectorAll ('.active #card-name');
    const activeCards = document.querySelectorAll('.active');
    const modalName = document.querySelector('#modal-name');

    for (var j = 0; j<activeCardsName.length; j+=1){
        if(activeCardsName[j].textContent === modalName.textContent){
            currentNumber = j;
        }
   }
     let prevActiveNumber = parseInt(currentNumber -1);
    
     if(prevActiveNumber< 0){
         prevButton.disabled = true;
     }else{
         prevButton.disabled = false;
     }
     let nextActiveNumber = parseInt(currentNumber +1);
     if (nextActiveNumber > activeCards.length -1){
        nextButton.disabled = true;
     } else {
         nextButton.disabled = false;
     }
}

//To add functionality to previous button in modal
function modalPrevButton(){
    const closeButton = document.querySelector('#modal-close-btn');
    const modalName = document.querySelector('#modal-name');
    const activeCardsName = document.querySelectorAll ('.active #card-name');
    let currentNumber = 0;
    const activeCards = document.querySelectorAll('.active'); 
    
   for (var j = 0; j<activeCardsName.length; j+=1){
        if(activeCardsName[j].textContent === modalName.textContent){
            currentNumber = j;
        }
   }
   
   let prevActiveNumber = parseInt(currentNumber -1);
   closeButton.click();
   activeCards[prevActiveNumber].click(); 
}


//To add functionality to next button in modal
function modalNextButton(){
    const closeButton = document.querySelector('#modal-close-btn');
    const modalName = document.querySelector('#modal-name');
    const activeCardsName = document.querySelectorAll ('.active #card-name');
    let currentNumber = 0;
    const activeCards = document.querySelectorAll('.active'); 
    
   for (var j = 0; j<activeCardsName.length; j+=1){
        if(activeCardsName[j].textContent === modalName.textContent){
            currentNumber = j;
        }
   }
   
   let nextActiveNumber = parseInt(currentNumber + 1);
   closeButton.click();
   activeCards[nextActiveNumber].click();   
   disablePrevNext();
  
}

//Function to create HTML for modal.
function createModal(target){

    const galleryDiv = document.querySelector('.gallery');
    const createModalDiv = document.createElement('div');
    createModalDiv.className = 'modal-container';
    createModalDiv.style.display ="";
    galleryDiv.appendChild(createModalDiv);

    createModalDiv.innerHTML = `
     <div class="modal">
         <button onclick="closeModalOnClick()" type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${target.picture.medium}" alt="profile picture">
                <h3 id="modal-name" class="modal-name cap">${target.name.first + " " + target.name.last}</h3>
                <p class="modal-text">${target.email}</p>
                <p class="modal-text cap">${target.location.city + ', ' + target.location.country}</p>
                <hr>
                <p class="modal-text">${target.cell}</p>
                <p class="modal-text">${target.location.street.number + ' ' 
                                        + target.location.street.name + ', ' 
                                        + target.location.city + ', ' 
                                        + target.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthday(target)}</p>
            </div>   
     </div>

     <div class="modal-btn-container">
     <button onclick="modalPrevButton()" type="button" id="modal-prev" class="modal-prev btn">Prev</button>
     <button onclick="modalNextButton()" type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    `;

    disablePrevNext();
}

//Function to populate modal with necessary data    
async function showModal(){
    await results();
    await addDetails();
    const activeCards = document.querySelectorAll('.active');
    
    for (var i = 0; i<twelvePeople.length; i+= 1){
        let j = i;
        activeCards[i].addEventListener('click', (e)=> {
        let itemDetail = twelvePeople[j];
        createModal(itemDetail);
        })
    }
    
    search();
}
showModal();


//function to add searchbar to HTML.
function addSearch(){
    const searchDiv = document.querySelector('.search-container');
    const searchForm = document.createElement('form');
    searchDiv.appendChild(searchForm);

    const searchInput = document.createElement('input');
    searchInput.type = "search";
    searchInput.id = "search-input";
    searchInput.className = "search-input";
    searchInput.placeholder = "Search...";
    searchForm.appendChild(searchInput);

    const searchSubmit = document.createElement('input');
    searchSubmit.type = "submit";
    searchSubmit.value = "Search";
    searchSubmit.id = "search-submit";
    searchSubmit.className = "search-submit";
    searchForm.appendChild(searchSubmit);
}
addSearch();

//To display no results error message if no search results are found.
function noResults(){
    const activeCards = document.querySelectorAll('.active');
    const errorMessage = document.querySelector('#error');
    if(activeCards.length === 0){
        errorMessage.textContent = "Sorry, no results found";
     } else if(activeCards.length > 0){
         errorMessage.textContent = "";
     }
}

// Function to filter results and change status/ class name of cards to active or inactive
function search(){
    const searchInput = document.querySelector('.search-input');
    const searchSubmit = document.querySelector('.search-submit');
    const cardsName = document.querySelectorAll('.card .card-name');
    

    searchSubmit.addEventListener("click", (e)=>{
        e.preventDefault();
        const searchValue = searchInput.value;
        console.log(searchValue);
      cardsName.forEach(name => {
          if(name.textContent.toLowerCase().includes(searchValue.toLowerCase())){
              console.log("match");
              name.parentNode.parentNode.style.display = "";
                if (name.parentNode.parentNode.className === "card inactive"){
                    name.parentNode.parentNode.classList.remove("inactive");    
                    name.parentNode.parentNode.classList.add("active");}
         } else if(name.parentNode.parentNode.className === "card active"){
            name.parentNode.parentNode.classList.remove("active");
            name.parentNode.parentNode.classList.add("inactive");
            name.parentNode.parentNode.style.display = "none";
            console.log("no match");
            name.parentNode.parentNode.style.display = "none";}
      
        })
        noResults();
     })
     
     }







