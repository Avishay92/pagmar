const white = "#f4f6fa";
const grey = "#202020";
const black = "#202020";
const fontForm = document.querySelectorAll(".card");
const $btnContainer = $(".next-btn-container");

$(document).ready(function() {
  let isNextActive = false;
  let isCardSelected = false;

  const $inputs = $("#instrument input");
  const inputs = $inputs.toArray();

  const $labels = $("#instrument label");
  const label = $labels.toArray();
  const alphabetForm = document.querySelector("#alphabet-content");


$("input[type=radio][name=alphabetChar]").change(function(){
    localStorage.setItem("font", this.id);
  });

  $("#backBtn").click(() => {
    location.assign("/");
  });

  $("#nextBtn").click(function() {
    location.assign("/create/synth");
  });

    for (let k=0; k<numberOfFonts; k++){
      $("#"+k).on('click', function(){
        toggleColor(k);
      });  
    }
});

$('#tabs > span').click((event)=>{
  if (event.target.className === "selected"){
  }else{
    $('#tabs > span').each((el, val)=>{
      $(val).toggleClass("selected")
      if (val.className === "selected"){
        $(`#${val.id}-content`).show()
      }else{
        $(`#${val.id}-content`).hide()
      }
    })
  }
})
let isFontAlreadyChecked = [false, false, false, false, false];
let oldCheck, numberOfFonts = 5;
function toggleColor(i){
oldCheck=isFontAlreadyChecked[i];
  if (!oldCheck){
    isFontAlreadyChecked[i] = true;
    $('#'+i).css("background-color", white);
    $('#'+i).css("color", grey);
    for (let j=0; j<numberOfFonts;j++){
      if (j!==i){
          $('#'+j).css("background-color",grey);
          $('#'+j).css("color",white);
          isFontAlreadyChecked[j] = false;
      }
    }
    $btnContainer.removeClass('disable');
  } 
  else {
    isFontAlreadyChecked[i] = false;
    $('#'+i).css("background-color",grey);
    $('#'+i).css("color",white);
    $btnContainer.addClass('disable');
  }
}

fontForm.forEach(function(value, index) {
  $(value).mouseenter(function() {
    let id = value.id;
    $('#'+id).css("background-color", white);
    $('#'+id).css("color",grey);
  });
  $(value).mouseleave(function() {
    let id = value.id;
    if (isFontAlreadyChecked[id] === false){
        $('#'+id).css("background-color", grey);
        $('#'+id).css("color",white);
    }
  });
});