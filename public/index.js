function showCreateSpaceModal(){
  var back = document.getElementById('modal-backdrop');
  var add = document.getElementById('create-space-modal');

  back.classList.remove('hidden');
  add.classList.remove('hidden'); 
}

function clearCreateSpaceModal(){
  var elem = document.getElementsByClassName('space-input-element');
  for(var i=0; i<5; i++){
    var text = elem[i].querySelector('input');
    text.value='';
  }

  text=elem[3].querySelector('input');
  text.checked=true;
  document.getElementById("space-day-input").selectedIndex=0;
  text=elem[6].querySelector('input');
  text.value='';
  text=elem[7].querySelector('input');
  text.value='';
}

function hideCreateSpaceModal(){
  var back = document.getElementById('modal-backdrop');
  var add = document.getElementById('create-space-modal');

  back.classList.add('hidden');
  add.classList.add('hidden');
  clearCreateSpaceModal();
}

window.addEventListener('DOMContentLoaded', function(event){
  var createSpaceButton = document.getElementById('create-space-button');
  createSpaceButton.addEventListener('click',showCreateSpaceModal); 

  var closeCreateSpace1 = document.querySelector('.modal-close-button');
  closeCreateSpace1.addEventListener('click',hideCreateSpaceModal);

  var closeCreateSpace2 = document.querySelector('.modal-cancel-button');
  closeCreateSpace2.addEventListener('click',hideCreateSpaceModal);  


});
