let addToy = false;

const API_DATABASE_URL = "http://localhost:3000/toys"

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }

  });

  const renderToy = (toyObj) => {
    
    const cardDiv = document.createElement("div");
    
    cardDiv.classList.add("card");
      cardDiv.setAttribute("data-id", toyObj.id);
      cardDiv.id = toyObj.id
    
      cardDiv.innerHTML = `
      <h2>${toyObj.name}</h2>
      <img src=${toyObj.image} class="toy-avatar" />
      <p>${toyObj.likes} Likes </p>
      <button data-id="${toyObj.id}" class="like-btn">Like <3</button>
      <button data-id="${toyObj.id}" class="delete-btn">Delete</button>
    `
    
    const collectionDiv = document.querySelector("#toy-collection")
    
    collectionDiv.append(cardDiv)

  }
  
  
  const renderAllToys = (toyArray) => {
    toyArray.forEach(toyObj => {renderToy(toyObj)})
  }


  fetch(API_DATABASE_URL).then(response => response.json())
    .then(fetchedArray => {console.log(fetchedArray);
    renderAllToys(fetchedArray)
  })

  const newToyForm = document.querySelector(".add-toy-form")

  newToyForm.addEventListener("submit", event =>{ event.preventDefault(); 
    const name = event.target.name.value
    const image = event.target.image.value
    const submit = event.target.submit
    console.log("SHOW ME SUBMIT - IN THE FORM:  ", submit)

    fetch(API_DATABASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ 
        "name": name,
        "image": image,
        "likes": 0
      })    
    })
    .then(response => response.json())
    .then(newToy => renderToy(newToy))
  
  })

  const cardsCollection = document.querySelector("#toy-collection")

  cardsCollection.addEventListener("click", event =>{ event.preventDefault(); 

    if(event.target.matches(".delete-btn")){   
      console.log(event.target) 
      const id = event.target.dataset.id
      const deleteToy = document.getElementById(id)
      fetch(`${API_DATABASE_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      .then(response => response.json())
      .then(deleteToy.remove())
    }

    if (event.target.matches(".like-btn")) {
      const pTagWithLikes = event.target.closest(".card").querySelector("p")
      const likeCount = parseInt(pTagWithLikes.textContent)
      const newLikes = likeCount + 1
      const id = event.target.dataset.id
      const bodyObj = {likes: newLikes} 
      fetch(`${API_DATABASE_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      })
      .then(response => response.json())
      .then(updatedToy => {
        console.log(updatedToy)
        pTagWithLikes.textContent = `${updatedToy.likes} Likes`
      })
    }

  })

});