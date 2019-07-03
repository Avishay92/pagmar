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
    // @avishay - change css to make the button enable/disabled, grayed-out/colored
    if (document.querySelector('div.format.selected')){
      // something is selected - enable
    }else{
      // nothing is selected - disable
    }
  })
});

$("#download").click(()=>{
  if (document.querySelector('div.format.selected')){
    document.getElementById('my_iframe').src = './fontune.zip';
  }
})