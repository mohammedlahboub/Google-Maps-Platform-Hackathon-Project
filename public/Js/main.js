  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  import { getDatabase, get, ref, child  } 
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

// ! Initialize Map
  function initMap() {
  
    // * Temporrarly Set the Map Center 37.76110813635402, -122.44202851190887
    let mapCenter = {
        lat: 37.76110813635402,
        lng: -122.44202851190887,
    };
  
    // ! Display Map On #map Element
    const map = new google.maps.Map(document.getElementById("map"), {
        center: mapCenter,
        zoom: 14,
        mapId:'2f8fb0ffb1955b9',
    });
    // A marker with a with a URL pointing to a PNG.
    const beachFlagImg = document.createElement('img');
    beachFlagImg.src = './Media/Icons/myLocation.png';
    beachFlagImg.style.width = "40px";
    
    const testPosition = new google.maps.marker.AdvancedMarkerView({
      map:map,
      position: mapCenter,
      content: beachFlagImg,
      title: 'Demo Location',
    });


// Todo : Add Directions ; Done !

    //? Direction Service;
    const directionsService = new google.maps.DirectionsService();

    //? Directions Rederer;
    const directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#22223b"
      },
      suppressMarkers: true
    });

    //? Link Directions to the map ;
    directionsRenderer.setMap(map);

    //? F
    function getRoute(map, listing){
      // create request
      let request
      if (getLocation_Btn.classList.contains("userLocationOn")) {
        request = {
          origin: mapCenter	, // map.getCenter()
          destination:listing.Position,
          travelMode:"DRIVING", // DRIVING BICYCLING TRANSIT WALKING
          unitSystem: google.maps.UnitSystem.IMPERIAL,
  
        }
      } else {
        request = {
          origin: mapCenter,
          destination:listing.Position,
          travelMode:"DRIVING", // DRIVING BICYCLING TRANSIT WALKING
          unitSystem: google.maps.UnitSystem.IMPERIAL,
  
        }
      }
      
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          directionsRenderer.setDirections(result);

          // Todo All of this to be Tested
          const distanceTo = result.routes[0].legs[0].distance.text;
          const distanceTxt = document.querySelector(".distanceTxt")
          distanceTxt.textContent = distanceTo


          const durationTo = result.routes[0].legs[0].duration.text;
          const durationTxt = document.querySelector(".durationTxt")
          durationTxt.textContent = durationTo
          
          // console.log(result, distanceTo, durationTo, )
        }
        else{
          // alert("Error")
        }
      });

    }
    // Todo : Advanced MArkers for Listing Containners : Done
    
    function ListData(){
      AddWait()
      const dbref = ref(db)
      get(child( dbref, "Listings/"))
      .then((snapshot)=>{
        RemoveWait()
          let data = snapshot.val()
  
          for (const listing_data in data) {
              if (Object.hasOwnProperty.call(data, listing_data)) {
                  const listing = data[listing_data];
                  // Todo :  element_data.Title
                  
                // console.log(listing.Position)
        const advancedMarkerView = new google.maps.marker.AdvancedMarkerView({
          map:map,
          content: buildContent(listing),
          position: listing.Position,
          // animation :  google.maps.Animation.BOUNCE ,
          title: listing.Title,
        });
        // console.log("done00")

        const element = advancedMarkerView.element;

        ["focus", "pointerenter"].forEach((event) => {
            element.addEventListener(event, () => {
              highlight(advancedMarkerView, listing);
            });
          });
        
        ["blur", "pointerleave"].forEach((event) => {
            element.addEventListener(event, () => {
              unhighlight(advancedMarkerView, listing);
            });
          });
        
        advancedMarkerView.addListener("click", () => {
            buildFullscreenView(listing)
            // aTag 
            const aTag = document.createElement("a");
            aTag.setAttribute("href",`#${listing.Title}`);
            aTag.click();
            // Todo : add route from user location to the curent listing location
            getRoute(map,listing);

            
          });

          function highlight(markerView, listing) {
            markerView.content.classList.add("highlight");
            markerView.element.style.zIndex = 10;
          }
          function unhighlight(markerView, listing) {
            markerView.content.classList.remove("highlight");
            markerView.element.style.zIndex = "";
          }
          //? Build Listingbody ;
    
    function buildContent(listing) {
        const content = document.createElement("div");
      
        content.classList.add("listingMarkerBody");
        content.classList.add("drop");
        content.innerHTML = `
        <divclass="listingMarkerPhotoBox">
            <img draggable="false" class="listingMarkerPhoto" src="${listing.Photo}" alt="${listing.Title}">
        </divclass=>
        <div class="listingMarkerDescBox">
            <div class="listingMarkerTitle">
                <p data-listingTitle>${listing.Title}</p>
            </div>
            <p class="listingMarkerDesc" data-listingDesc>${listing.Desc}</p>
            <div style="justify-content:flex-start ;" class="listingDescBtnsWrapper">
            
            </div>


            <div class="listingDescBtnsWrapper">
                <button class="listingMarkerBtns listingMarkerPrice">
                    <p data-listingPrice>${listing.Price}</p>
                </button>
            </div>

            
        </div>
        `;
        return content;
      }

    //? Build listing fullScreen View ;

    function buildFullscreenView(listing){
        
        const form = document.querySelector(".form_Wrapper");
        const map_Wrapper = document.querySelector(".map_Wrapper");


        const fullscreenViewBox = document.createElement("div");
        fullscreenViewBox.classList.add("fullscreenViewBox");

        const formContains_fullscreenViewBox = form.querySelectorAll(".fullscreenViewBox").length > 0;

        const FullscreenView = document.createElement("div");
        FullscreenView.classList.add("FullscreenView");
        const fullscreenViewTitle = form.querySelector(".FullscreenViewTitle");

        
        //? FullscreenView HTML Template ;
        // FullscreenView.innerHTML = ` 
        // <div  id="${listing.title}"  class="FullscreenViewTitleandPrice">

        //     <p class="FullscreenViewTitle">${listing.title}</p>
        // <div class="FullscreenViewPrice">
        //     <p>${listing.price}</p>
        // </div>
        // </div>

        // <div class="FullscreenViewPhoto">
        //     <img draggable="false"  src="${listing.photo}" alt="">
        // </div>
        // <div class="FullscreenViewDesc">
        //     <p>${listing.title}</p>
        // </div>`

        FullscreenView.innerHTML = `
        <div id="${listing.Title}" class="fullscreenViewBox">
          <div class="FullscreenView">
              <div class="FullscreenViewPhoto">
                <img draggable="false"  src="${listing.Photo}" alt="${listing.Title}">
                <div class="FullscreenViewPrice">
                  <p>${listing.Price}</p>
                </div>
              </div>
              <div    class="FullscreenViewTitleandPrice">
                <p class="FullscreenViewTitle">${listing.Title}</p>
                  <div class="FullscreenViewDesc">
                    <p>${listing.Desc}</p>
                  </div>
                  <div class="routeSection">
                    <div class="distancepart routeParts">
                      <div class="distanceIcon routeIcons">
                      <span class="material-symbols-outlined">
                      directions_car
                      </span>
                      </div>
                      <p class="distanceTxt"></p>
                    </div>

                      <div class="durationpart routeParts">
                        <div class="durationIcon routeIcons">
                          <span class="material-symbols-outlined">
                            timer
                          </span>
                        </div>
                        <p class="durationTxt"></p>
                </div>
              </div>
              <div class="listingAlert">
        <span class="material-symbols-outlined">
            warning
            </span>
            <p>This Listing is Only For Testing Purpose</p>
    </div>
            </div>
            
                    
                    
           </div>
          </div>`

        fullscreenViewBox.appendChild(FullscreenView);


        if (formContains_fullscreenViewBox && fullscreenViewTitle.textContent !== listing.Title) {
        // Remove the preview
        form.removeChild(form.querySelector(".fullscreenViewBox"));
        directionsRenderer.setMap(map);

        // remove some Space For the preview ;
        form.classList.add("form_Wrapper_actives");
        map_Wrapper.classList.add("map_Wrapper_active")

        // Add another preview with curent listing details
        form.appendChild(fullscreenViewBox);
        } 
        else if (formContains_fullscreenViewBox && fullscreenViewTitle.textContent == listing.Title){
        // remove the preview
        form.removeChild(form.querySelector(".fullscreenViewBox"));
        directionsRenderer.setMap(null);

        // Restore Home page ;
        form.classList.remove("form_Wrapper_actives");
        map_Wrapper.classList.remove("map_Wrapper_active")
        
        } 
        
        else {
        // Make some Space For the preview ;
        form.classList.add("form_Wrapper_actives");
        map_Wrapper.classList.add("map_Wrapper_active")
        directionsRenderer.setMap(map);

        // Add the preview  ;
        form.appendChild(fullscreenViewBox);   
        }

    }



                  
  
              }
          }
  
          
      })
      
  }
  

  ListData()

  //   for (const listing of listings) {

  // }
    // ! End For Loop

    

    
  // Todo : Go to Test Location : Done !
  const goTestLocationBtn = document.querySelector("[data-goTestLocation]")
 

  goTestLocationBtn.addEventListener("click", () => {
    const testPosition2 = new google.maps.marker.AdvancedMarkerView({
      map:map,
      position: mapCenter,
      content: beachFlagImg,
      title: 'Demo Location',
    });
    getLocation_Btn.classList.remove("userLocationOn")

    ListData()

    //* get curent Center
    let currnetMapCenterLat = map.getCenter().lat();  
    let currnetMapCenterLng = map.getCenter().lng();

    if (mapCenter.lat == currnetMapCenterLat || currnetMapCenterLng == mapCenter.lng) {
      
    // console.log("you are in the Test Location")
      
    } else {
      map.setCenter(mapCenter);

      // console.log("Center Got Set")
      
    }
  })
  
  
  
    // Todo : User Location : Done !
    const getLocation_Btn = document.querySelector("[data-getUserLocation]");


    getLocation_Btn.addEventListener("click", () => {

      getLocation_Btn.classList.add("userLocationOn")
    ListData()
        
        let userNavGeoLocation = navigator.geolocation;
        userNavGeoLocation.getCurrentPosition(success, failure);
        
        
        // console.log("User Location Button Clicked")
        //? Position Found :
        function success(position){
            
            let UserLat = position.coords.latitude;
            let UserLng = position.coords.longitude;
  
            let coords = new google.maps.LatLng(UserLat, UserLng);
            // Todo : Replace coords name variable with userLocation;
            
      
            //? Set Map Center to User Location
            map.setCenter(coords)
            const curentPosition = new google.maps.marker.AdvancedMarkerView({
              map:map,
              position: coords,
              content: beachFlagImg,
              title: 'A marker using a custom PNG Image',
            });
            console.log("ladies and gentlemen, we got him !")
      
        }

        //? Position Not Found :
        function failure (){
            console.log("Can't Find Location ?")
        }
})

}
//? Test Listings ;
// const listings = [
//     {
//         title: "Single family house with modern design",
//       price: "FREE",
//       type: "home",
//       photo: "./Media/listings/20220919_151845.jpg",
//       position: {
//         lat: 37.50024109655184,
//         lng: -122.28528451834352,
//       },
//     },
//     {
//         title: "Townhouse with friendly neighbors",
//       price: "$ 3,050,000",
//       type: "building",
//       photo: "./Media/listings/20220918_202204.jpg",
//       position: {
//         lat: 37.44440882321596,
//         lng: -122.2160620727,
//       },
//     },
    
//     {
//         title: "Spacious warehouse great for small business",
//       price: "$ 3,125,000",
//       type: "warehouse",
//       photo: "./Media/listings/image-product-desktop.jpg",
//       position: {
//         lat: 37.39561833718522,
//         lng: -122.21855116258479,
//       },
//     },
//     {
//         title: "A lovely store on busy road",
//       price: "$ 4,225,000",
//       type: "store-alt",
//       photo: "./Media/listings/image-product-mobile.jpg",
//       position: {
//         lat: 37.423928529779644,
//         lng: -122.1087629822001,
//       },
//     },
//   ];

// Todo : End MAP ;







    // ! Form End Btns


window.initMap = initMap;

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

