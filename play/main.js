const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
$(".back").click(function() {
    localStorage.setItem("data", JSON.stringify(data));
    location.assign("../menu");
  });