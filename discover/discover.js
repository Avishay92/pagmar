$.get("../poster/index.html", function(data){
    $("body").children("#poster").html(data);

  });
  
  $("#lost-in-space").click(function(){
      console.log("here");
    $("#poster").show();
  });

