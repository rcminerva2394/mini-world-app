
const cardsContainer = document.querySelector('.cards-container');
const loader = document.querySelector('.loader');
const mainContent = document.querySelector('.main-content')

let ready = false;
let cardsloaded = 0;
let totalCards = 0;
let countriesArray = [];




// HELPER FUNCTIONS

  // DOM Element Factory- a helper function
  let domElementFactory = (type, attributes, ...children) => {
    // type
    let domElement = document.createElement(type);
    // for attributes
    for (const key in attributes) {
      domElement.setAttribute(key, attributes[key])
    }
    // for children
    children.forEach(child => {
      domElement.append(child)
    })
    
    return domElement
  }

  // A loader function that will check if all cards are loaded, else loader or spinner will be shown
  let cardloaded = () => {
    cardsloaded++
    if (cardsloaded === totalCards) {
      ready = true;
      loader.hidden = true;
    }
  }

  // A Function that will limit the length of the wikipedia summary paragraph, should be not more than 700 characters
  const limitParagraph = (string) => {
    let shortenedString = string;
    while (shortenedString.length >= 500) {
      shortenedString = shortenedString.split('. ').slice(0, -1).join('. ') + '.';
    }
    return shortenedString;
  };



// The modal template elements
let modalDivContainer = document.querySelector('.modal-country-detailed-info-container');
let backButton = document.querySelector('.back-button');
let modalCountryCard = document.querySelector('.modal-country-card-detailed-info-div');
let modalCountryDetailedInfo = document.querySelector('.modal-country-detailed-info');
let modalCountryFlagDiv = document.querySelector('.modal-country-flag');
let modalCountryName = document.querySelector('.modal-country-name');
let modalPopulation = document.querySelector('.modal-population');
let modalSubRegion = document.querySelector('.modal-sub-region');
let modalCapital = document.querySelector('.modal-capital');
let modalDomain = document.querySelector('.modal-domain')
let modalCurrency = document.querySelector('.modal-currency');
let modalLanguages = document.querySelector('.modal-languages');
let wikipediaSummary = document.querySelector('.wikipedia-summary');
let countryPhotos = document.querySelector('.country-unsplash-photos');



// Create elements for country card image, and basic information, detailed-card-info onclick event and add to DOM
let displayCards = () => {
  cardsloaded = 0;
  totalCards = countriesArray.length;
  // Run function for each object in the countriesArray
  countriesArray.forEach((country) => {

    // Create a parent <div> that wil hold the country flag image and country basic info
    let countryCard = document.createElement('div');
    countryCard.classList.add('country-card');

    // Create the country flag div using the helper function
    let countryCardFlagImageDiv = domElementFactory(
      'div', { class: 'country-flag-image' }, 
      domElementFactory('img', {
        src: country.flags.svg,
        alt: `The flag of ${country.name.common}`,
        title: `The flag of ${country.name.common}`
      })
    )
    countryCard.appendChild(countryCardFlagImageDiv);

     // Create the country basic information div using the helper function
     let countryCardBasicInfoDiv = domElementFactory(
       'div', {class:'country-basic-info'}, 
       domElementFactory('p', {
         class: 'country-name'
       }, country.name.common), domElementFactory('p', {
         class: 'population'
         }, domElementFactory('span', {
         class: 'inner-text-category' }, 'Population: '), country.population), 
       domElementFactory('p', {
         class: 'region'
         }, domElementFactory('span', {
          class: 'inner-text-category' }, 'Region: '), country.region), 
       domElementFactory('p', {
         class: 'capital'
         }, domElementFactory('span', {
         class: 'inner-text-category' }, 'Capital: '), country.capital)
     )

     countryCard.appendChild(countryCardBasicInfoDiv);
     
     // Event listener tied to a loader function that will check if each card is loaded
     countryCard.addEventListener('load', cardloaded());
     cardsContainer.appendChild(countryCard)


    // THE CLICK EVENT LISTENER THAT WILL ROUTE THE USER TO SEE MORE DETAILS ABOUT THE COUNTRY
     countryCard.addEventListener('click', (e) => {
        modalDivContainer.style.display = 'block';
        mainContent.style.display = 'none';
        countryPhotos.innerHTML = '';
        let selectedCountryName = e.currentTarget.children[1].childNodes[0].innerText;  // currentTarget - the current element the handler is attached, I need this to display the detailed country info
        // Fetch the wikiParagraph
        fetchWiki(selectedCountryName);
        fetchUnsplashPhotos(selectedCountryName);
        // Find the index of the selected card to easily manipulate the countriesArray
        let selectedCountryIndex = countriesArray.findIndex((countriesArr) => 
        countriesArr.name.common === selectedCountryName);
        let selectedCountryObj = countriesArray[selectedCountryIndex];

          // The modal card detailed info elements and content
            modalCountryFlagDiv.innerHTML = `<img src= ${selectedCountryObj.flags.svg} alt= 'The flag of ${selectedCountryObj.name.common}' title= 'The flag of ${selectedCountryObj.name.common}'>`
            modalCountryName.innerHTML = selectedCountryName;
            modalPopulation.innerHTML = `<span class= 'inner-text-category'>Population: </span>${selectedCountryObj.population}`;
            modalSubRegion.innerHTML =  `<span class= 'inner-text-category'>Subregion: </span>${selectedCountryObj.subregion}`;
            modalCapital.innerHTML = `<span class= 'inner-text-category'>Capital: </span>${selectedCountryObj.capital}`;
            modalDomain.innerHTML = `<span class= 'inner-text-category'>Top Level Domain: </span>${selectedCountryObj.tld}`;
            modalCurrency.innerHTML = `<span class= 'inner-text-category'>Currency: </span> ${Object.entries(selectedCountryObj.currencies)[0][1].name}`;
            modalLanguages.innerHTML = `<span class= 'inner-text-category'>Languages: </span> ${Object.values(selectedCountryObj.languages).join(', ')}`;

    
          })

    })
  }

     
  //Back Button Event Listener

  backButton.addEventListener('click', (e) => {
    modalDivContainer.style.display = 'none';
    mainContent.style.display = 'block';
  })


// FILTERS

  // Input- Search a Country Filter
  const inputTheCountry = document.querySelector('#search-a-country');

  inputTheCountry.addEventListener('keyup', (e) => {
    const inputTheCountryValue = e.target.value.toLowerCase();
    const countryNames = document.querySelectorAll('.country-name');
    countryNames.forEach((countryName) => {
      if(countryName.innerText.toLowerCase().includes(inputTheCountryValue) === false) {
        countryName.parentElement.parentElement.style.display = 'none'
      } else {
        countryName.parentElement.parentElement.style.display = 'block'
      }
    })
  })

  // Filter by region
  const filteredRegion = document.querySelector('#filtered-region')

  filteredRegion.addEventListener('change', (e) => {
    const regions = document.querySelectorAll('.region');
    regions.forEach((region) => {
      if(region.innerHTML.includes(e.target.value)) {
        region.parentElement.parentElement.style.display = 'block';
      } else {
        region.parentElement.parentElement.style.display = 'none';
      }
    })
  })



// DARK OR LIGHT MODE
let darkLigtMode = document.querySelector('#light-dark-mode-btn');


darkLigtMode.addEventListener('click', () => {
  let body = document.body;
  let headerDark = document.getElementById('header');
  inputTheCountry.classList.toggle('dark-mode-header-card');
  filteredRegion.classList.toggle('dark-mode-header-card');
  body.classList.toggle('dark-mode-gen');
  headerDark.classList.toggle('dark-mode-header-card');
  darkLigtMode.classList.toggle('dark-mode-header-card');

})



// FETCH ASYNC AWAIT- WIKI, REST COUNTRIES, and UNSPLASH

  // Fetch Wiki
    let fetchWiki = async (chosenCountry) => {
      let wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${chosenCountry}`
  
      try {
        const response1 = await fetch(wikiURL)
        let paragraph = await response1.json()
        console.log(await paragraph);
        let text = paragraph.extract
        wikipediaSummary.innerHTML = limitParagraph(text);
      }catch (err) {
        console.log(err)
      }

    }
  
    

  // Fetch countries REST API
  const countriesAPI = 'https://restcountries.com/v3.1/all';// Countries REST API
  const fetchData = async () => {
    try {
        const response = await fetch(countriesAPI)
        countriesArray = await response.json()
        displayCards()   
    } catch (err) {
        console.error(err)
    }
  }

  // On Load
  fetchData()


  // The Unsplash API is free and available, but THS IS NOT the proper way of storing API keys publictly
  const UnsplashApiKey = 'FoNQIbFid85SPqHI84SEXo9IunbgKYKVmwLfbv594u8'

  let fetchUnsplashPhotos = async (selectedCountry) => {
    const unsplashApiUrl = `https://api.unsplash.com/search/photos?query=${selectedCountry}&per_page=21&page=1&client_id=${UnsplashApiKey}`
    let countriesPhotosArray = [];
    let photosResult;
    try {
      const response = await fetch(unsplashApiUrl);
      countriesPhotosArray = await response.json();
      console.log(await countriesPhotosArray.results);
      photosResult = countriesPhotosArray.results;
      photosResult.forEach((photo) => {
        let eachPhoto = domElementFactory('a', {
          href: photo.links.html,
          target: '_blank'
        }, domElementFactory('img', {
           src: photo.urls.regular,
           alt: photo.alt_description,
           title: photo.alt_description
           }));
        countryPhotos.appendChild(eachPhoto);
      })
    } catch (error) {
      console.log(error)
    }
  }


