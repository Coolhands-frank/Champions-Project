import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// initilizing and specifying firebase database
const appSettings = {
    databaseURL: "https://champions-2-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsementMessage")

// Target html dom elements
const textAreaEl = document.getElementById("text-area")
const inputFromEl = document.getElementById("input-from-field")
const inputToEl = document.getElementById("input-to-field")
const publishBtnEl = document.getElementById("publishBtn")
const endorsementEl = document.getElementById("endorsements")

// Function that handle endorsement submission
publishBtnEl.addEventListener("click", function(){

    // Get the values of the text area and input fields
    let textValue = textAreaEl.value
    let fromValue = inputFromEl.value
    let toValue = inputToEl.value

    // Create an endorsement object with the values
    let endorsementObj = {
        fromPerson: `From ${fromValue}`,
        message: `${textValue}`,
        to: `To ${toValue}`
    }
    
    push(endorsementInDB, endorsementObj)
    
    clearInputAreas()
    
})

// Function to handle snapshot data
onValue(endorsementInDB, function(snapshot){

    if (snapshot.exists()){

        // Convert snapshot data to array
        let endorsementArray = Object.entries(snapshot.val())
        
        clearEndorsementEl()

        // Loop through endorsement array and add endorsements to endorsement element
        for (let i=0; i < endorsementArray.length; i++) {
            let eachEndorsement = endorsementArray[i]
        
            addEndorsementsToEndorsementEl(eachEndorsement)
        }
        
    }else {
        // Display message if no endorsements yet
        endorsementEl.innerHTML = "No endorsements yet"
    }
})

//function to clear endorsement element before adding new endorsement snapshot from database
function clearEndorsementEl(){
    endorsementEl.innerHTML = ""
}

// Function to clear input Areas after publishing
function clearInputAreas() {
    textAreaEl.value = ""
    inputFromEl.value = ""
    inputToEl.value = ""
}

// Function to add endorsements to the endorsement element
function addEndorsementsToEndorsementEl(endorsement){

    // Get endorsement data from firebase
    let endorsementID = endorsement[0]
    let endorsementFrom = endorsement[1].fromPerson
    let endorsementMessage = endorsement[1].message
    let endorsementTo = endorsement[1].to
   
    let newDivElement = document.createElement("div")
    let newFromH4Element = document.createElement("h4")
    let newPElement = document.createElement("p")
    let newToH4Element = document.createElement("h4")
    
    // Add classes and event listener to newDivElement
    newDivElement.classList.add("endorsement-div")
    newDivElement.addEventListener("dblclick", function(){
        let getEndorsementToBeDeleted = ref(database, `endorsementMessage/${endorsementID}`)
        
        remove(getEndorsementToBeDeleted)
    })
    

    newFromH4Element.textContent = endorsementFrom
    newPElement.textContent = endorsementMessage
    newToH4Element.textContent = endorsementTo
    
    // Append new elements to newDivElement
    newDivElement.appendChild(newFromH4Element)
    newDivElement.appendChild(newPElement)
    newDivElement.appendChild(newToH4Element)
    
    // Append newDivElement to endorsementEl
    endorsementEl.append(newDivElement)
    
}

