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

	hideCreateSpaceModal();
  }
  else{
	  alert("You must specify all the values marked by a *");
  }
}

function removeSpace(event){
	var address = event.toElement.parentNode.parentNode.querySelector('.detail-address').textContent;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/delete", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		Address: address
	}));
}

function reserveSpace(event){
	var address = event.toElement.parentNode.parentNode.querySelector('.detail-address').textContent;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/reserve", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		Address: address
	}));
}

function showLargerViewModal() {
    var back = document.getElementById('modal-backdrop');
    var larger = document.getElementById('larger-view-modal');

    back.classList.remove('hidden');
    larger.classList.remove('hidden');
}

function hideLargerViewModal() {
    var back = document.getElementById('modal-backdrop');
    var larger = document.getElementById('larger-view-modal');

    back.classList.add('hidden');
    larger.classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', function(event){
  var createSpaceButton = document.getElementById('create-space-button');
  createSpaceButton.addEventListener('click',showCreateSpaceModal); 

  var closeCreateSpace1 = document.querySelector('.modal-close-button');
  closeCreateSpace1.addEventListener('click',hideCreateSpaceModal);

  var closeCreateSpace2 = document.querySelector('.modal-cancel-button');
  closeCreateSpace2.addEventListener('click',hideCreateSpaceModal);  

  var largerViewButton = document.getElementsByClassName('space');
  for (var i = 0 ; i < largerViewButton.length ; i++) {
      console.log('working');
      largerViewButton[i].addEventListener('click',showLargerViewModal);
  }

  var closeLargerView = document.getElementById('larger-view-modal').querySelector('.modal-close-button');
  closeLargerView.addEventListener('click',hideLargerViewModal);

  var modalAcceptButton = document.querySelector('.modal-accept-button');
  if(modalAcceptButton){
    modalAcceptButton.addEventListener('click',insertNewSpace);
  }

});






