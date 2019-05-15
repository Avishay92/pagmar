let data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));

//html string for all letters
let letterElements = Object.values(data)
  .map(function (value, index) {
    return `<div class="grid__item" data-blotter="${value.char}">
        </div>`;
  })
  .join("");

let pitchTry = new Tone.PitchShift().toMaster();
let synth = new Tone.MembraneSynth().connect(pitchTry);
var env = new Tone.Envelope({
  "attack": 0.5,
  "decay": 0.5,
  "sustain": 0.2,
  "release": 0.2,
});

const gridElement = (document.querySelector(
  ".grid"
).innerHTML = letterElements);

function resetChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    Object.keys(material.uniforms).forEach(function (key, index) {
      if (defaultUniforms[key]){
        if (key === "uDistortPosition"){
          material.uniforms[key].value = [Number(defaultUniforms[key][0]), Number(defaultUniforms[key][1])];
        }else{
          material.uniforms[key].value = Number(defaultUniforms[key])
        }
      }
    })
    blotter.needsUpdate = true;
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css('opacity', '0.2');
  }
}

function activateChar(char) {
  let blotter = data[char] && data[char].blotter;
  if (blotter) {
    let material = blotter.material;
    let uniforms = Object.assign(Object.assign({}, defaultUniforms), data[char].uniforms);
    Object.keys(material.uniforms).forEach(function (key, index) {
      if (defaultUniforms[key]){
        if (key === "uDistortPosition"){
          material.uniforms[key].value = [Number(uniforms[key][0]), Number(uniforms[key][1])];
        }else{
          material.uniforms[key].value = Number(uniforms[key])
        }
      }
    })
    blotter.needsUpdate = true;
    const note = data[char].note;
    Tone.context.resume().then(() => {
      synth.triggerAttackRelease(note, '4n');
    })
    var gridItem = document.querySelector(`[data-blotter=${data[char].char}]`);
    $(gridItem).css('opacity', '1');
  }
}

//builds blotter and insert pointers to data
$(document).ready(function () {
  document
    .querySelectorAll("[data-blotter]")
    .forEach(function (gridItemElement) {
      const style = {
        family: "Frank Ruhl Libre",
        //weight: "bold",
        fill: "#fff",
        size: 100
      };
      const char = gridItemElement.dataset.blotter;
      let material = new Blotter.RollingDistortMaterial();
      const text = new Blotter.Text(char, style);
      const blotter = new Blotter(material, {
        texts: text
      });
      data[char].blotter = blotter;
      resetChar(char);
      const scope = blotter.forText(text);
      scope.appendTo(gridItemElement);
      $(gridItemElement).mouseenter(function () {
        activateChar(char);
      });
      $(gridItemElement).mouseleave(function () {
        resetChar(char);
      });
      $(gridItemElement).click(function () {
        localStorage.setItem("char", char);
        location.assign("../editor")
      })
    });
});

$(document).keydown(function (event) {
  var char = event.key; // charCode will contain the code of the character inputted
  activateChar(char);
});

$(document).keyup(function (event) {
  var char = event.key; // charCode will contain the code of the character inputted
  resetChar(char);
});

$("#logo").click(function(){
  location.assign("../")
})