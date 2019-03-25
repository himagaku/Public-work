// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('hello world :o');

// define variables that reference elements on our page
const dreamsList = document.getElementById('dreams');
const dreamsForm = document.getElementById('bbsform');
const dreamInput = dreamsForm.elements['dream'];

// a helper function to call when our request for dreams is done
const getDreamsListener = function() {
  let dreams = [];
  // parse our response to convert to JSON
  dreams = JSON.parse(this.responseText);

  if(dreamsList.hasChildNodes()) {
    while(dreamsList.childNodes.length > 0) {
      dreamsList.removeChild(dreamsList.firstChild);
    }
  }

  // iterate through every dream and add it to our page
  dreams.forEach( function(row) {
    appendNewDream(row.dream, row.create_datetime);
  });
}

// request the dreams from our app's sqlite database
const dreamRequest = new XMLHttpRequest();
dreamRequest.onload = getDreamsListener;
dreamRequest.open('get', '/getDreams');
dreamRequest.send();

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream, create_datetime) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = dream + " [" + create_datetime + "]";
  dreamsList.appendChild(newListItem);
}

function EncodeHTMLForm(data) {
  var params = [];
  for(var name in data) {
    var value = data[name];
    var param = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    params.push(param);
  }
  return params.join('&').replace(/%20/g,'+');
}

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  // dreams.push(dreamInput.value);

  // 2019-03-25 22:20:22
  //appendNewDream(dreamInput.value);

  var XHR = new XMLHttpRequest();
  var sate = { dream : 'test'};
  sate.dream = dreamInput.value;
  XHR.open("POST", "/", true);
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send(EncodeHTMLForm(sate));
  XHR.onreadystatechange = function() {
    if(XHR.readyState == 4 && XHR.status == 200) {
      dreamRequest.onload = getDreamsListener;
      dreamRequest.open('get', '/getDreams');
      dreamRequest.send();
     // appendNewDream();
    }
  };

  // reset form 
  dreamInput.value = '';
  dreamInput.focus();
};

function resetdreams() {
  dreamRequest.onload = getDreamsListener;
  dreamRequest.open('get', '/resetDreams');
  dreamRequest.send();
};
