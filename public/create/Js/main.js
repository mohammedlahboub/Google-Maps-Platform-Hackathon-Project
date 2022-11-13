  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  import { getDatabase, set, ref, child  } 
  from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCw_6MZZhvHgdXqAzU5T0bukfPS6GCHInc",
    authDomain: "maps-hackathon-ml-a8b0c.firebaseapp.com",
    databaseURL: "https://maps-hackathon-ml-a8b0c-default-rtdb.firebaseio.com",
    projectId: "maps-hackathon-ml-a8b0c",
    storageBucket: "maps-hackathon-ml-a8b0c.appspot.com",
    messagingSenderId: "646906136305",
    appId: "1:646906136305:web:75bb1c7e279f7eed820b50"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// get the database ;
const db = getDatabase();

function InserData(titleValue, priceValue, descValue, photoValue, positionValue){
    set(ref(db, "Listings/"+ titleValue),  {
        Title: titleValue,
        Price: priceValue,
        Photo: photoValue,
        Desc: descValue,
        Position: positionValue,
    })

    .then(()=>{
        RemoveWait()
        alert("Done !")

// Todo : new alert here

    })
    .catch((error)=>{
        RemoveWait()

        alert("Error")

// Todo : new alert here

    })
};




let userNavGeoLocation = navigator.geolocation;

userNavGeoLocation.getCurrentPosition(success, failure);
      
      function success(position){
          const UserLat = position.coords.latitude;
          const UserLng = position.coords.longitude;

          lat_hiden.setAttribute("class",UserLat);
          lng_hiden.setAttribute("class", UserLng);

          
      }

      //? Position Not Found :
      function failure (){
          alert("Can't get location")
// Todo : new alert here


}


const form = document.querySelector(".CreateListingForm_Wrapper")
const CancelFormBtn = form.querySelector(".formCancel_btn");
const PublishFormBtn = form.querySelector(".formPublish_btn");
const lat_hiden = document.querySelector("#lat_hiden")
const lng_hiden = document.querySelector("#lng_hiden")
const resetBtn = document.querySelector(".formResetBtn")

CancelFormBtn.addEventListener("click", () => {
    ListData()
    console.log("Form Closed")
})

PublishFormBtn.addEventListener("click", () => {
let PreviewTitle_value = createListingForm_Title.value;
let PreviewPrice_value = "$ " + createListingForm_Price.value;
let PreviewDesc_value = createListingForm_Desc.value;
let PreviewPhoto_value = listingPreviewPhoto.getAttribute("src")

if (PreviewTitle_value === '' || PreviewPrice_value === '$ ' || PreviewDesc_value === '' || PreviewPhoto_value === '../Media/Photos/photoWillApearHere.png') {
    alert("Complete the Form")
// Todo : new alert here

    // console.log("Form Inmcomplete")


} else {

   

    // Todo : DAtabase ????
    let userLocation = {lat : Number(lat_hiden.getAttribute("class")), lng:Number(lng_hiden.getAttribute("class")),};

    InserData(PreviewTitle_value, PreviewPrice_value, PreviewDesc_value, PreviewPhoto_value, userLocation)
    AddWait()

    resetBtn.click()
    smallphotoPreviewBox.classList.remove("photoPreviewBox_active");

    listingPreviewPhoto.setAttribute("src", "../Media/Photos/photoWillApearHere.png");



}

})



// ! form to preview test
// Form elements
const createListingForm_Title = document.querySelector(".ListingTitle");
const createListingForm_Price = document.querySelector("#ListingPrice");
const createListingForm_Desc = document.querySelector(".CreateListing_description");

// Preview elements
const PreviewTitle = document.querySelector("[data-listingTitle]");
const PreviewPrice = document.querySelector("[data-listingPrice]");
const PreviewDesc = document.querySelector("[data-listingDesc]");
const listingPreviewPhoto = document.querySelector(".listingMarkerPhoto");
// mouseover


//! Title

createListingForm_Title.addEventListener("input", () => {
    const createListingFormTitle = createListingForm_Title.value;
    PreviewTitle.textContent = `${createListingFormTitle}`;
})
createListingForm_Title.addEventListener("mouseover", () => {

    PreviewTitle.classList.add("blueText");
})
createListingForm_Title.addEventListener("mouseleave", () => {

    PreviewTitle.classList.remove("blueText");
})



//! Price
createListingForm_Price.addEventListener("input", () => {
    const createListingFormPrice = createListingForm_Price.value;
    PreviewPrice.textContent = `$ ${createListingFormPrice}`;
})
createListingForm_Price.addEventListener("mouseover", () => {

    PreviewPrice.classList.add("blueText");
})
createListingForm_Price.addEventListener("mouseleave", () => {

    PreviewPrice.classList.remove("blueText");
})

//! Desc
createListingForm_Desc.addEventListener("input", () => {
    const createListingFormDesc = createListingForm_Desc.value;
    PreviewDesc.textContent = `${createListingFormDesc}`;
})
createListingForm_Desc.addEventListener("mouseover", () => {

    PreviewDesc.classList.add("blueText");
})
createListingForm_Desc.addEventListener("mouseleave", () => {

    PreviewDesc.classList.remove("blueText");
})




// ! Form Photo Input 

const addPhotoBtn = document.querySelector(".addPhotoBTN");
const addPhotoInput = document.querySelector("#ListingImagesInput");
const smallphotoPreviewBox = document.querySelector(".photoPreviewBox");

addPhotoBtn.addEventListener("click", () => {
    let file ;
    addPhotoInput.onchange = e =>{
        console.log(e.target.files[0].name)
        file = e.target.files;
        let reader = new FileReader();
        reader.onload = function(){
            // set container image src
            smallphotoPreviewBox.setAttribute("src", reader.result);
            listingPreviewPhoto.setAttribute("src", reader.result);
            smallphotoPreviewBox.classList.add("photoPreviewBox_active");
        }
        reader.readAsDataURL(file[0])
    }
    addPhotoInput.click()
})
const alertDiv = document.createElement("div")
alertDiv.classList.add("alertDiv_active")

alertDiv.innerHTML =`<div class="alertBox_active">
<div class="">

</div>
</div>`
function AddWait(){
    document.body.appendChild(alertDiv);
}

function RemoveWait(){
    document.body.removeChild(alertDiv);
}

// AddWait()
// RemoveWait()