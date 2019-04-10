'use strict';

// div on index.html that holds the 3 images for the user to select on the page
var imageContainer = document.getElementById('image-choices');

// image tags where images are stored
var imagesOnPage = imageContainer.getElementsByTagName('img');

// stores all images created in an array
var imageLibrary = [];

// keeps track of total number of clicks 
var totalClicks = 0;

// max number of clicks allowed
var maxTotalClicks = 25;

// holds indices of images in previous selection Options
var previousImagesSelections = [];

// holds indices of images in current selection Options
var currentImageSelections = [];



// Image constructor with name of image, and format (jgp, gif, png)
var Image = function(name, format) {
  this.name = name;
  this.filePath = `img/${name}.${format}`;
  this.numClicks = 0;
  this.numTimesDisplayed = 0;
  imageLibrary.push(this);

  //votes array keeps tally for all images by index number in image library - declared in barchart.js
  votes.push(0);

  //imageNames array keeps track of names for all images by index number in image library - declared in barchart.js
  imageNames.push(name);
};

// generates a random number between min and max inclusive
var generateRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1 ) + min);
};

// adds indices of the images to to be displayed from the library
var getNewImageSelections = function() {
  var counter = 0;
  var randomImageIndex;
  while (counter < 3) {
    randomImageIndex = generateRandomNumber(0, imageLibrary.length -1);
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
  for(var i = 0; i < imageLibrary.length; i++) {
    liEl = document.createElement('li');
    liEl.textContent = `${imageLibrary[i].numClicks} votes for ${imageLibrary[i].name}`;
    ulEl.appendChild(liEl);
  }
  imageStatsContainer.appendChild(ulEl);
};

var handleUserClick = function(event) {
  event.preventDefault();

  // get image clicked
  var imageCickedId = event.target.id;
  var imageCicked = imageLibrary[imageCickedId];

  // add 1 to image stats
  imageCicked.numClicks++;

  //add 1 to total votes fir pic index in votes array
  votes[imageCickedId]++;

  // add 1 to total clicks
  totalClicks++;

  // update bar chart
  votesBarChart.update();

  if(totalClicks === maxTotalClicks){
    console.log('Max clicks submitted. Removing event listener...');
    imageContainer.removeEventListener('click', handleUserClick);
    displayImageStats();
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

// add event listener on userClick
imageContainer.addEventListener('click', handleUserClick);

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

getNewImageSelections();
showNewImageSelections();
drawChart();
