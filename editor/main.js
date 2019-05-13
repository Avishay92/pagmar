var synth, loopBeat, pitchEffect, wetEffect, distortionEffect;


const play = document.querySelector(".play");
const playLoop = document.querySelector(".playLoop");
const stop = document.querySelector(".stop");
const pitchShiftUp = document.querySelector(".pitchShiftUp");
const pitchShiftDown = document.querySelector(".pitchShiftDown");
loopBeat = new Tone.Loop(func, '4n');
pitchEffect = new Tone.PitchShift().toMaster();
wetEffect = new Tone.Effect(0.9).chain(pitchEffect);
distortionEffect= new Tone.Distortion(0.8).chain(wetEffect);

synth = new Tone.Synth().connect(distortionEffect);


Tone.Transport.start();
var text = new Blotter.Text("פ", {
    family : "Frank Ruhl Libre",
    size : 400,
    fill : "white",
    paddingLeft: 300,
    paddingRight: 100
});

var material = new Blotter.RollingDistortMaterial();
material.uniforms.uSineDistortCycleCount.value = 10;
material.uniforms.uSineDistortSpread.value = 0.0;
material.uniforms.uSineDistortAmplitude.value = 1;
material.uniforms.uNoiseDistortVolatility.value = 90.0;
material.uniforms.uNoiseDistortAmplitude.value = 0.09;
material.uniforms.uDistortPosition.value = [7, 0.03]; // this is the [X,Y] position;
material.uniforms.uRotation.value =  370.0;
material.uniforms.uSpeed.value = 0.18;

// material.uniforms = JSON.parse(localStorage.getItem("material"))


// $(window).on("beforeunload", function(){
//     localStorage.setItem('material', JSON.stringify(material.uniforms));
// })

var blotter = new Blotter(material, {
  texts: text,
});



var scope = blotter.forText(text);
scope.appendTo(document.body);


/// my code

const inputs = document.querySelectorAll('input');

for(let input of inputs) {
    input.addEventListener('input', ({currentTarget}) => {
        console.clear();
        const currentValue = currentTarget.value;
        const {id: propKey} = currentTarget;
        synth.triggerAttackRelease(synth.frequency.value, '4n');

        console.log(propKey)
        console.log(currentValue)

        if (propKey === 'uSineDistortSpread') {
            distortionEffect.distortion = currentValue;
            return;
        }
        if (propKey === 'uSineDistortAmplitude') {
            wetEffect.wet.value = currentValue;
            return;
         }
         if (propKey === 'uNoiseDistortVolatility') {
            pitchEffect.pitch = currentValue;
             return;
         }
        if (propKey === 'uDistortPositionY') {
            const [x,y] = material.uniforms.uDistortPosition.value;
            material.uniforms.uDistortPosition.value = [x, Number(currentValue)];
            return;
        }

        if (propKey === 'uDistortPositionX') {
            const [x,y] = material.uniforms.uDistortPosition.value;
            material.uniforms.uDistortPosition.value = [Number(currentValue),y];
            return;
        }

        material.uniforms[propKey].value = currentValue;

    
    })
}



function func(){
    synth.triggerAttackRelease('C4', '8n');
}

play.addEventListener("click",
function(){
  synth.triggerAttackRelease('C4', '8n');
});

playLoop.addEventListener("click",
function(){
loopBeat.start(0);
});

stop.addEventListener("click",
function(){
loopBeat.stop();
});

pitchShiftUp.addEventListener("click",
function(){
distortionEffect.distortion += 0.1;
console.log(distortionEffect.distortion);
}); 

pitchShiftDown.addEventListener("click",
function(){

    distortionEffect.distortion -= 0.1;
console.log(distortionEffect.distortion);

});     


