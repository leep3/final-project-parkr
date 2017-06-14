function showCreateSpaceModal(){
  var back = document.getElementById('modal-backdrop');
  var add = document.getElementById('create-space-modal');

  back.classList.remove('hidden');
  add.classList.remove('hidden'); 
}

function clearCreateSpaceModal(){
  var elem = document.getElementsByClassName('space-input-element');
  for(var i=0; i<2; i++){
    var text = elem[i].querySelector('input');
    text.value='';
  }
  document.getElementById("space-location-input").selectedIndex=0;
  document.getElementById("space-day-input").selectedIndex=0;
  text=elem[3].querySelector('input');
  text.value='';
  text=elem[5].querySelector('input');
  text.value='';
  text=elem[6].querySelector('input');
  text.value='';
}

function hideCreateSpaceModal(){
  var back = document.getElementById('modal-backdrop');
  var add = document.getElementById('create-space-modal');

  back.classList.add('hidden');
  add.classList.add('hidden');
  clearCreateSpaceModal();
}

function insertNewSpace(){
  var name = document.getElementById('space-name-input').value || '';
  var address = document.getElementById('space-address-input').value || '';
  var city = document.getElementById('space-location-input').value || '';
  var price = document.getElementById('space-price-input').value || '';
  var picture = document.getElementById('space-picture-input').value || '';
  var description = document.getElementById('space-description-input').value || '';
  var day =document.getElementById('space-day-input').value || '';

  if(name.trim()&&address.trim()&&city.trim()&&price.trim()&&picture.trim()&&day.trim()){
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/add", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		Name: name,
        Address: address,
        City: city,
        Price: price,
        Day: day,
        Picture: picture,
        Description: description
	}));
	xhr.onreadystatechange = function(){
		if(xhr.readyState == XMLHttpRequest.DONE){
			if(xhr.responseText == "Invalid address"){
				alert("Error adding spot. Please check your entry and try again.");
			}
			else{
				hideCreateSpaceModal();
			}
		}
	}
  }
  else{
	  alert("You must specify all the values marked by a *");
  }
}

function removeSpace(){
    var address = document.getElementsByClassName('detail-address')[0].textContent;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/delete", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		Address: address
	}));
}

function reserveSpace(){
    var address = document.getElementsByClassName('detail-address')[0].textContent;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/reserve", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		Address: address
	}));
}

function reserveButtonAction(event) {
    var reserveButton = event.toElement;
    reserveButton.classList.add('reserved');
    reserveButton.innerHTML = 'Reserved!';
    var cancelButton = reserveButton.parentNode.querySelector('.modal-cancel-reserve-button');
    cancelButton.classList.remove('hidden');
    reserveButton.parentNode.parentNode.parentNode.parentNode.classList.add('reserved');
	//reserveButton.parentNode.parentNode.parentNode.parentNode.childNodes.classList.add('park-opacque');
	//console.log(reserveButton.parentNode.parentNode.parentNode.parentNode);
	reserveButton.parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.nextSibling.nextSibling.classList.add('park-opacque');
}

function reserveCancelButtonAction(event) {
    var cancelButton = event.toElement;
    cancelButton.classList.add('hidden');
    var reserveButton = cancelButton.parentNode.querySelector('.modal-reserve-button');
    reserveButton.classList.remove('reserved');
    reserveButton.innerHTML = 'Reserve';
    reserveButton.parentNode.parentNode.parentNode.parentNode.classList.remove('reserved');
	reserveButton.parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.nextSibling.nextSibling.classList.remove('park-opacque');
}

function showLargerViewModal(event) {
    var back = document.getElementById('modal-backdrop');
    back.classList.remove('hidden');

    var address = event.toElement.parentNode.parentNode.querySelector('.larger-view-modal');
    address.classList.remove('hidden');
}

function hideLargerViewModal() {

    var back = document.getElementById('modal-backdrop');
    back.classList.add('hidden');
    var address = event.toElement.parentNode.parentNode.parentNode;
    address.classList.add('hidden');
}

// These are for filtering.

var contentID = ["location", "days", "price"];
var locationElements = ['c', 'u', 'd', 'm']; // I use the word that only it has. ex) Only Corvallis has 'c' in it.
var daysElements = ['su', 'mo', 'tu', 'we', 'th', 'f', 'sa'];
var priceElements = [10, 15, 20, 25, 100000];
var allElements = [locationElements, daysElements, priceElements];
var numberElements = [locationElements.length, daysElements.length, priceElements.length];
var spaceArticles = document.getElementsByTagName('article');

sorting = function (i, j) {
    var temp;
    for (var k = 0; k < numberElements[i]; k++) {
        if (k !== j) {
            temp = document.getElementById(contentID[i]).querySelectorAll("a")[k];
            temp.classList.remove('select');
        }
    } 
    temp = document.getElementById(contentID[i]).querySelectorAll("a")[j];
    if (document.getElementById(contentID[i]).getElementsByClassName('select').length) {
        temp.classList.remove('select');
    }
    else {
        temp.classList.add('select');
    }
    for (var k = 0; k < spaceArticles.length; k++) {
        spaceArticles[k].classList.remove('hidden');
    }  
    for (var x = 0; x < contentID.length; x++) {
        var count = allElements[x].length;
        if (x !== 2 && document.getElementById(contentID[x]).getElementsByClassName('select').length !== 0) {
            for (var y = 0; y < allElements[x].length; y++) {
                temp = document.getElementById(contentID[x]).getElementsByClassName('select')[0].innerHTML.toLowerCase().indexOf(allElements[x][y]);
                if (temp !== -1) {
                    for (var z = 0; z < spaceArticles.length; z++) {
                        if (spaceArticles[z].getElementsByClassName(contentID[x])[0].innerHTML.toLowerCase().indexOf(allElements[x][y]) === -1) {
                            spaceArticles[z].classList.add('hidden');
                        }

                    }
                    count = 0;
                }
            }
            if (count === allElements[x].length) {
                for (var z = 0; z < spaceArticles.length; z++) {
                    spaceArticles[z].classList.add('hidden');
                }
            }

        } else if (x === 2 && document.getElementById(contentID[x]).getElementsByClassName('select').length !== 0) {
            var max;
            var min;
            for (var y = 0; y < allElements[x].length; y++) {
                temp = document.getElementById(contentID[x]).getElementsByClassName('select')[0].innerHTML[3] + document.getElementById(contentID[x]).getElementsByClassName('select')[0].innerHTML[4];
                if (temp == 10) {
                    max = 10;
                    min = 0;
                } else if (temp == 15) {
                    max = 15;
                    min = 10;
                } else if (temp == 20) {
                    max = 20;
                    min = 15;
                } else if (temp == 25) {
                    max = 25;
                    min = 20;
                } else {
                    max = 9007199254740991;
                    min = 25;
                }
            }
            for (var z = 0; z < spaceArticles.length; z++) {
                if (min >= parseFloat(spaceArticles[z].getElementsByClassName(contentID[x])[0].innerHTML) || max < parseFloat(spaceArticles[z].getElementsByClassName(contentID[x])[0].innerHTML)) {
                    spaceArticles[z].classList.add('hidden');
                }
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', function(event){
  var createSpaceButton = document.getElementById('create-space-button');
  createSpaceButton.addEventListener('click',showCreateSpaceModal); 

  var closeCreateSpace1 = document.querySelectorAll('.modal-close-button')[spaceArticles.length];
  closeCreateSpace1.addEventListener('click',hideCreateSpaceModal);

  var closeCreateSpace2 = document.querySelector('.modal-cancel-button');
  closeCreateSpace2.addEventListener('click',hideCreateSpaceModal);  


    // largerView and reservation.

  var largerViewButton = document.getElementsByClassName('space');
  var reserveButton = document.getElementsByClassName('modal-reserve-button');
  var cancelReserveButton = document.getElementsByClassName('modal-cancel-reserve-button');
  for (var i = 0 ; i < largerViewButton.length ; i++) {
      largerViewButton[i].getElementsByTagName('img')[0].addEventListener('click', showLargerViewModal);
      largerViewButton[i].querySelector('.modal-close-button').addEventListener('click', hideLargerViewModal);
      reserveButton[i].addEventListener('click', reserveButtonAction);
      reserveButton[i].addEventListener('click', reserveSpace);
      cancelReserveButton[i].addEventListener('click', reserveCancelButtonAction);
  }

  var modalAcceptButton = document.querySelector('.modal-accept-button');
  if(modalAcceptButton){
    modalAcceptButton.addEventListener('click',insertNewSpace);
  }

	// These are for filtering.
  var sortingLocation1 = document.getElementById(contentID[0]).querySelectorAll("a")[0];
  sortingLocationFunction1 = function () { var i = 0; var j = 0; sorting(i, j); };
  sortingLocation1.addEventListener('click', sortingLocationFunction1);

  var sortingLocation2 = document.getElementById(contentID[0]).querySelectorAll("a")[1];
  sortingLocationFunction2 = function () { var i = 0; var j = 1; sorting(i, j); };
  sortingLocation2.addEventListener('click', sortingLocationFunction2);

  var sortingLocation3 = document.getElementById(contentID[0]).querySelectorAll("a")[2];
  sortingLocationFunction3 = function () { var i = 0; var j = 2; sorting(i, j); };
  sortingLocation3.addEventListener('click', sortingLocationFunction3);

  var sortingLocation4 = document.getElementById(contentID[0]).querySelectorAll("a")[3];
  sortingLocationFunction4 = function () { var i = 0; var j = 3; sorting(i, j); };
  sortingLocation4.addEventListener('click', sortingLocationFunction4);

  var sortingDays1 = document.getElementById(contentID[1]).querySelectorAll("a")[0];
  sortingDaysFunction1 = function () { var i = 1; var j = 0; sorting(i, j); };
  sortingDays1.addEventListener('click', sortingDaysFunction1);

  var sortingDays2 = document.getElementById(contentID[1]).querySelectorAll("a")[1];
  sortingDaysFunction2 = function () { var i = 1; var j = 1; sorting(i, j); };
  sortingDays2.addEventListener('click', sortingDaysFunction2);

  var sortingDays3 = document.getElementById(contentID[1]).querySelectorAll("a")[2];
  sortingDaysFunction3 = function () { var i = 1; var j = 2; sorting(i, j); };
  sortingDays3.addEventListener('click', sortingDaysFunction3);

  var sortingDays4 = document.getElementById(contentID[1]).querySelectorAll("a")[3];
  sortingDaysFunction4 = function () { var i = 1; var j = 3; sorting(i, j); };
  sortingDays4.addEventListener('click', sortingDaysFunction4);

  var sortingDays5 = document.getElementById(contentID[1]).querySelectorAll("a")[4];
  sortingDaysFunction5 = function () { var i = 1; var j = 4; sorting(i, j); };
  sortingDays5.addEventListener('click', sortingDaysFunction5);

  var sortingDays6 = document.getElementById(contentID[1]).querySelectorAll("a")[5];
  sortingDaysFunction6 = function () { var i = 1; var j = 5; sorting(i, j); };
  sortingDays6.addEventListener('click', sortingDaysFunction6);

  var sortingDays7 = document.getElementById(contentID[1]).querySelectorAll("a")[6];
  sortingDaysFunction7 = function () { var i = 1; var j = 6; sorting(i, j); };
  sortingDays7.addEventListener('click', sortingDaysFunction7);

  var sortingPrice1 = document.getElementById(contentID[2]).querySelectorAll("a")[0];
  sortingPriceFunction1 = function () { var i = 2; var j = 0; sorting(i, j); };
  sortingPrice1.addEventListener('click', sortingPriceFunction1);

  var sortingPrice2 = document.getElementById(contentID[2]).querySelectorAll("a")[1];
  sortingPriceFunction2 = function () { var i = 2; var j = 1; sorting(i, j); };
  sortingPrice2.addEventListener('click', sortingPriceFunction2);

  var sortingPrice3 = document.getElementById(contentID[2]).querySelectorAll("a")[2];
  sortingPriceFunction3 = function () { var i = 2; var j = 2; sorting(i, j); };
  sortingPrice3.addEventListener('click', sortingPriceFunction3);

  var sortingPrice4 = document.getElementById(contentID[2]).querySelectorAll("a")[3];
  sortingPriceFunction4 = function () { var i = 2; var j = 3; sorting(i, j); };
  sortingPrice4.addEventListener('click', sortingPriceFunction4);

  var sortingPrice5 = document.getElementById(contentID[2]).querySelectorAll("a")[4];
  sortingPriceFunction5 = function () { var i = 2; var j = 4; sorting(i, j); };
  sortingPrice5.addEventListener('click', sortingPriceFunction5);
});






