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
      // $('.format').removeClass('selected');
      $currentFormat.addClass('selected');
    }

  })

});
