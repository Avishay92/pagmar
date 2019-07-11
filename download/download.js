const lineColors = {
  bright: "#f4f6fa",
  dark: "#a7a8ab"
};

$(document).ready(function() {
  $("#fontName").on("input", function() {
    this.style.setProperty(
      "--clr-line",
      this.value.length === 0 ? lineColors.dark : lineColors.bright
    );
  });


  $('.formats-container').on('click', '.format', function() {
    const $currentFormat = $(this);
    const isFormatSelected = $currentFormat.hasClass('selected');
    if (isFormatSelected) {
      $currentFormat.removeClass('selected');
    } else {
      $currentFormat.addClass('selected');
    }
    if (document.querySelector('div.format.selected')){
      $("#download").addClass('accent');
    }else{
      $("#download").removeClass('accent');
    }
  })
});

function myFunction() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// $("#download").click(()=>{
  // if (document.querySelector('div.format.selected')){
    // document.getElementById('my_iframe').src = './MyFont.zip';
  // }
// })

