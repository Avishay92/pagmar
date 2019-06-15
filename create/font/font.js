$(document).ready(function() {
  let isNextActive = false;
  let isCardSelected = false;
  const $btnContainer = $(".next-btn-container");

  const $inputs = $("#instrument input");
  const inputs = $inputs.toArray();

  const $labels = $("#instrument label");
  const label = $labels.toArray();


const alphabetForm = document.querySelector("#alphabet");

  // $(document).on('click', 'label', function() {
  //   const currentInput = $(this).find('input');
  //   if (isCardSelected) {
  //     currentInput.checked = false;
  //   }

  //   // if (currentInput[0].checked) {
  //   //   currentInput[0].checked = false;
  //   // }
  // })

  $("#backBtn").click(() => {
    location.assign("/");
  });

  $("#nextBtn").click(function() {
    location.assign("/create/synth");
  });

  $(alphabet).change(() => {
    $btnContainer.removeClass("disable");
  });
});
