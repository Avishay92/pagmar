$(document).ready(function() {
  let isNextActive = false;
  let isCardSelected = false;
  const $btnContainer = $(".next-btn-container");

  const $inputs = $("#instrument input");
  const inputs = $inputs.toArray();

  const $labels = $("#instrument label");
  const label = $labels.toArray();

const alphabetForm = document.querySelector("#alphabet-content");

  // $(document).on('click', 'label', function() {
  //   const currentInput = $(this).find('input');
  //   if (isCardSelected) {
  //     currentInput.checked = false;
  //   }

  //   // if (currentInput[0].checked) {
  //   //   currentInput[0].checked = false;
  //   // }
  // })

  $("input[type=radio][name=alphabetChar]").change(function(){
    localStorage.setItem("font", this.value);
  });

  $("#backBtn").click(() => {
    location.assign("/");
  });

  $("#nextBtn").click(function() {
    location.assign("/create/synth");
  });

  $(alphabetForm).change(() => {
    $btnContainer.removeClass("disable");
  });
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