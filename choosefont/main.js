const notes = ["C", "D", "E", "F", "G", "A", "B"];
let octave = 4;
const alphabeth = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "ם", "נ", "ן", "ס", "ע", "פ", "ף", "צ", "ץ", "ק", "ר", "ש", "ת", ]

let data = {};

alphabeth.foreach(function(value, index){
    Object.assign(data, {[value]: {note: , effects:[]}})
    }
})

const MathUtils = {
  lineEq: function(y2, y1, x2, x1, currentVal) {
    // y = mx + b
    var m = (y2 - y1) / (x2 - x1),
      b = y1 - m * x1;
    return m * currentVal + b;
  },
  lerp: function(a, b, n) {
    (1 - n) * a + n * b;
  }
};

class Renderer {
  function(options, material) {
    this.options = options;
    this.material = material;
    for (let i = 0, len = this.options.uniforms.length; i <= len - 1; ++i) {
      this.material.uniforms[
        this.options.uniforms[i].uniform
      ].value = this.options.uniforms[i].value;
    }
    for (let i = 0, len = this.options.animatable.length; i <= len - 1; ++i) {
      this[this.options.animatable[i].prop] = this.options.animatable[i].from;
      this.material.uniforms[this.options.animatable[i].prop].value = this[
        this.options.animatable[i].prop
      ];
    }
    this.currentScroll = window.pageYOffset;
    this.maxScrollSpeed = 80;
    requestAnimationFrame(function() {
      this.render();
    });
  }
  render() {
    requestAnimationFrame(function() {
      this.render();
    });
  }
}

class RollingDistortMaterial {
  constructor(options) {
    this.material = new Blotter.RollingDistortMaterial();
    new Renderer(options, this.material);
    return this.material;
  }
}

class Material {
  constructor(type, options = {}) {
    let material = new RollingDistortMaterial(options);
    return material;
  }
}

class BlotterEl {
  constructor(el, options, fill) {
    this.DOM = { el: el };
    console.log(el);
    this.DOM.textEl = this.DOM.el.querySelector("canvas");
    this.style = {
      family: "Frank Ruhl Libre",
      size: 140,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 0,
      fill: fill || "#fff"
    };
    Object.assign(this.style, options.style);
    this.material = new Material(options.type, options);
    this.text = new Blotter.Text(this.DOM.textEl.innerHTML, this.style);
    this.blotter = new Blotter(this.material, { texts: this.text });
    this.scope = this.blotter.forText(this.text);
    this.DOM.el.removeChild(this.DOM.textEl);
    this.scope.appendTo(this.DOM.el);
    return this.blotter;
  }
}

let config = {
  type: "RollingDistortMaterial",
  uniforms: [
    {
      uniform: "uSineDistortSpread",
      value: 0.354
    },
    {
      uniform: "uSineDistortCycleCount",
      value: 5
    },
    {
      uniform: "uSineDistortAmplitude",
      value: 0
    },
    {
      uniform: "uNoiseDistortVolatility",
      value: 0
    },
    {
      uniform: "uNoiseDistortAmplitude",
      value: 0.168
    },
    {
      uniform: "uDistortPosition",
      value: [0.38, 0.68]
    },
    {
      uniform: "uRotation",
      value: 48
    },
    {
      uniform: "uSpeed",
      value: 0.421
    }
  ],
  animatable: [{ prop: "uSineDistortAmplitude", from: 0, to: 0.5 }],
  easeFactor: 0.15
};

$(document).ready(function() {
  document.querySelectorAll("[data-blotter]").forEach(function(blotterEl, pos) {
    blotters[blotterEl.dataset.blotter] = new BlotterEl(blotterEl, config);
  });
  console.log(blotters);
});

var synth;
var loopBeat;
var pitchTry;

const play = document.querySelector(".play");
const playLoop = document.querySelector(".playLoop");
const stop = document.querySelector(".stop");
loopBeat = new Tone.Loop(func, "4n");
pitchTry = new Tone.PitchShift().toMaster();
synth = new Tone.Synth().connect(pitchTry);
Tone.Transport.start();
function func() {
  synth.triggerAttackRelease("C4", "8n");
}

play.addEventListener("click", function() {
  synth.triggerAttackRelease("C4", "8n");
});

playLoop.addEventListener("click", function() {
  loopBeat.start(0);
});

stop.addEventListener("click", function() {
  loopBeat.stop();
});

// document.addEventListener('keydown', keyDown);

const letters = [
  [65, "C4"],
  [66, "D4"],
  [67, "E4"],
  [68, "F4"],
  [69, "G4"],
  [70, "A4"],
  [71, "B4"],
  [72, "C5"]
];

// function keyDown(event){
//     // let char = event.char || event.charCode || event.which;
//     var charCode = event.which; // charCode will contain the code of the character inputted
//     var theChar = String.fromCharCode(charCode); // theChar will contain the actual character
//     console.log(theChar);
//     // for (let i = 0; i< letters.length; i++){
//     //     if (letters[i][0]===char){
//     //         synth.triggerAttackRelease(letters[i][1], '4n');
//     //         var blotter = document.querySelector('#let1');
//     //         blotter.style.fill= "#00ff88";
//     //     }
//     // }
// }

$(document).keydown(function(event) {
  var char = event.key; // charCode will contain the code of the character inputted
  blotters[char]["_texts"][0]["_properties"].fill = "red";
  blotters[char].needsUpdate = true;
});

$(document).keyup(function(event) {
    var char = event.key; // charCode will contain the code of the character inputted
    blotters[char]["_texts"][0]["_properties"].fill = "white";
    blotters[char].needsUpdate = true;
  });
