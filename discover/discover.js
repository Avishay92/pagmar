$.get("../poster/index.html", function(data){
    $("body").children("#poster").html(data);
  });
  
  $("#lost-in-space").click(function(){
      $("#poster").show();
  });

  $(document).ready(()=>{
    setTimeout(()=>{
        console.log("fade")
      $(".title").removeClass('fade');
      })
  })