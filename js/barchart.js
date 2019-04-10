'use strict';

/******************************** Charts Variables and functions ******************************************/
var votesBarChart;

//keeps track of votes tally for all images by index number in image library
var votes = [];

//keeps track of names for all images by index number in image library
var imageNames = [];

// drawsBarChartOnCanvas
var drawChart = function() {
  var ctx = document.getElementById('votes-chart').getContext('2d');
  votesBarChart = new Chart (ctx, {
    type: 'bar',
    data: {
      labels: imageNames,
      datasets: [{
        label: 'Votes Tally',
        backgroundColor: 'rgb(255, 98, 0)',
        borderColor: 'rgb(255, 98, 0)',
        hoverBackgroundColor: 'rgb(255, 96, 182)',
        data: votes
      }]
    },
    options: {
      responsive: false,
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          max: 5,
          min: 0,
          stepSize: 1.0
        }
      }]
    }
  });
};
