'use strict';

// div on index.html that holds the 3 images for the user to select on the page
var imageContainer = document.getElementById('image-choices');

// image tags where images are stored
var imagesOnPage = imageContainer.getElementsByTagName('img');

// stores all images created in an array
var imageLibrary = [];

// max number of clicks allowed
var maxTotalClicks = 25;

// holds indices of images in previous selection Options
var previousImagesSelections = [];

// holds indices of images in current selection Options
var currentImageSelections = [];

var getStorageVotes = function(){
  var votes = JSON.parse(localStorage.getItem('votes'));
  return votes;
};

var setStorageVotes = function(votes){
  localStorage.setItem('votes', JSON.stringify(votes));
};

// Image constructor with name of image, and format (jgp, gif, png)
var Image = function(name, format) {
  this.name = name;
  this.filePath = `img/${name}.${format}`;
  this.numTimesDisplayed = 0;

  this.numClicks = function(){
    var imageNames = JSON.parse(localStorage.getItem('imageNames'));
    return getStorageVotes()[imageNames.indexOf(this.name)];
  };

  var isInitialized = JSON.parse(localStorage.getItem('initialized'));
  if(!isInitialized) {
    var votes = getStorageVotes();
    votes.push(0);
    setStorageVotes(votes);
    
    //imageNames array keeps track of names for all images by index number in image library - declared in barchart.js
    var storedImageNames = JSON.parse(localStorage.getItem('imageNames'));
    storedImageNames.push(name);
    localStorage.setItem('imageNames', JSON.stringify(storedImageNames));
  }
  imageLibrary.push(this);
};

// generates a random number between min and max inclusive
var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1 ) + min);
};

// adds indices of the images to to be displayed from the library
var getNewImageSelections = function() {
  var counter = 0;
  var randomImageIndex;
  console.log(imageLibrary);
  while (counter < 3) {
    randomImageIndex = generateRandomNumber(0, imageLibrary.length - 1);
    // check for dupes in image container and previous image container with current selection
    if (previousImagesSelections.includes(randomImageIndex) || currentImageSelections.includes(randomImageIndex)){
      randomImageIndex = generateRandomNumber(0, imageLibrary.length -1);
    } else {
      currentImageSelections[counter] = randomImageIndex;
      counter++;
    }
  }
};

// shows image to display using indices from currentImageSelections
var showNewImageSelections = function() {
  var imageToDisplay;
  for(var i = 0; i < currentImageSelections.length; i++) {
    imageToDisplay = imageLibrary[currentImageSelections[i]];
    imagesOnPage[i].src = imageToDisplay.filePath;
    imagesOnPage[i].alt, imagesOnPage[i].title = imageToDisplay.name;
    imagesOnPage[i].id = currentImageSelections[i];
    imageToDisplay.numTimesDisplayed++;
  }
};

// displays num of click each image received in the image library
var displayImageStats = function(){
  var imageStatsContainer = document.getElementById('image-stats');
  var ulEl = document.createElement('ul');
  var liEl;
  var images = JSON.parse(localStorage.getItem('imageNames'));
  var votes = getStorageVotes();
  for(var i = 0; i < images.length; i++) {
    liEl = document.createElement('li');
    liEl.textContent = `${votes[i]} votes for ${images[i]}`;
    ulEl.appendChild(liEl);
  }
  imageStatsContainer.appendChild(ulEl);
};

var handleUserClick = function(event) {
  event.preventDefault();

  // get image clicked
  var imageCickedId = event.target.id;
  //var imageCicked = imageLibrary[imageCickedId];

  var votes = getStorageVotes();
  
  // add 1 to image stats
  votes[imageCickedId]++;
  setStorageVotes(votes);

  var totalClicksInStorage = JSON.parse(localStorage.getItem('totalClicks'));

  if (totalClicksInStorage < maxTotalClicks) {
    // add 1 to total clicks
    totalClicksInStorage++;
  }

  localStorage.setItem('totalClicks', JSON.stringify(totalClicksInStorage));

  // update bar chart
  //votesBarChart.update();

  if(totalClicksInStorage === maxTotalClicks){
    console.log('Max clicks submitted. Removing event listener...');
    imageContainer.removeEventListener('click', handleUserClick);
    displayImageStats();
    showChart();
  } else {
    // make previous = current
    previousImagesSelections = currentImageSelections;

    // reset current 
    currentImageSelections = [];

    // display new images
    getNewImageSelections();
    showNewImageSelections();
  }
};

var initializeImageLibrary = function() {
  // create images for image library
  new Image('bag', 'jpg');
  new Image('banana', 'jpg');
  new Image('bathroom', 'jpg');
  new Image('boots', 'jpg');
  new Image('breakfast', 'jpg');
  new Image('bubblegum', 'jpg');
  new Image('chair', 'jpg');
  new Image('cthulhu', 'jpg');
  new Image('dog-duck', 'jpg');
  new Image('dragon', 'jpg');
  new Image('pen', 'jpg');
  new Image('pet-sweep', 'jpg');
  new Image('scissors', 'jpg');
  new Image('shark', 'jpg');
  new Image('sweep', 'png');
  new Image('tauntaun', 'jpg');
  new Image('unicorn', 'jpg');
  new Image('usb', 'gif');
  new Image('water-can', 'jpg');
  new Image('wine-glass', 'jpg');
};

if (!localStorage.getItem('totalClicks')) {
  localStorage.setItem('totalClicks', '0');
  localStorage.setItem('votes', JSON.stringify([]));
  localStorage.setItem('imageNames', JSON.stringify([]));
  initializeImageLibrary();
  localStorage.setItem('initialized', 'true');

  getNewImageSelections();
  showNewImageSelections();
  // add event listener on userClick
  imageContainer.addEventListener('click', handleUserClick);
} else {
  var totalClicks = JSON.parse(localStorage.getItem('totalClicks'));
  if(totalClicks === maxTotalClicks){
    alert('you have reached the max votes');
    console.log('Max clicks submitted. No event listener...');
    displayImageStats();
    showChart();
  } else {
    imageContainer.addEventListener('click', handleUserClick);
    initializeImageLibrary();
    getNewImageSelections();
    showNewImageSelections();
  }
}



