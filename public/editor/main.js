
const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
const brightMode = localStorage.getItem("brightMode");
let instrument,
    autoWahEffect,
    phaserEffect,
    vibratoEffect,
    pitchEffect,
    distortionEffect,
    reverbEffect,
    brightModeOn,
    app,
    material,
    blotter,
    autowahValue;
instrument = defaultSoundEffects[Object.keys(defaultSoundEffects)[0]];
initializeEffects();
initializeInstrument();
initializeFilterMode();

data[char].uniforms = Object.assign(Object.assign({}, defaultUniforms), data[char].uniforms);
data[char].soundEffects = Object.assign(Object.assign({}, defaultSoundEffects), data[char].soundEffects);
const note = data[char].note;

const font = localStorage.getItem("font");

WebFont.load({
    google: {
        families: ["Frank Ruhl Libre:700"]
    },
    custom: {
        families: [font],
        urls: ['../../fonts/fonts.css']
    },
    active: function () {
        const fontSize = 400;
        var text = new Blotter.Text(char, {
            family: font,
            weight: font === "Frank Ruhl Libre" ? "700" : "normal",
            fill: brightModeOn ? darkGrey : white,
            size: fontSize,
            paddingLeft: fontSize / 2,
            paddingRight: fontSize / 2
        });

        material = new Blotter.RollingDistortMaterial();
        Object.keys(material.uniforms).forEach(function (key, index) {
            if (defaultUniforms[key]) {
                if (key === "uDistortPosition") {
                    material.uniforms[key].value = [Number(data[char].uniforms[key][0]), Number(data[char].uniforms[key][1])];
                } else {
                    material.uniforms[key].value = Number(data[char].uniforms[key])
                }
            }
        })

        blotter = new Blotter(material, {
            texts: text,
        });
        
        var scope = blotter.forText(text);
        scope.appendTo(document.querySelector("#char"));

        function updateInputValue(visualEffect, soundEffect, currentValue, minVisual, maxVisual, minSound, maxSound) {
            let visualValue = convertValueToRange(minVisual, maxVisual, currentValue);
            let soundValue = convertValueToRange(minSound, maxSound, currentValue);
            material.uniforms[visualEffect].value = visualValue;
            data[char].uniforms[visualEffect] = visualValue;
            data[char].soundEffects[soundEffect] = soundValue;
            return soundValue;
        }

        function convertValueToRange(min, max, value) {
            const controllerRange = 264;
            let range, precent;
            value += 132;
            precent = parseFloat(value / controllerRange).toPrecision(3);
            range = Math.abs(min) + Math.abs(max);
            value = parseFloat(range * precent).toPrecision(3);
            if (min < 0 || value < min) {
                value = parseFloat(value) + parseFloat(min);
            }
            if (max < 0 || value > max) {
                value = parseFloat(value) + parseFloat(max);
            }
            return Number(value);
        }

        function convertValueToRotation(effect) {
            const controllerRange = 264;
            const min = effectRanges[effect].minVisual;
            const max = effectRanges[effect].maxVisual;
            let range, precent, currValue;
            if (effect === 'uDistortPositionX') {
                currValue = data[char].uniforms["uDistortPosition"][0];
            }
            else if (effect === 'uDistortPositionY') {
                currValue = data[char].uniforms["uDistortPosition"][1];
            }
            else {
                currValue = data[char].uniforms[effect];
            }
            if (min < 0) {
                currValue = parseFloat(currValue) - parseFloat(min);
            }
            if (max < 0) {
                currValue = parseFloat(currValue) - parseFloat(max);
            }
            range = Math.abs(min) + Math.abs(max);
            precent = parseFloat(currValue / range).toPrecision(3);
            currValue = parseFloat(controllerRange * precent).toPrecision(3);
            currValue -= 132;
            return currValue;
        }



        app = new Vue({
            el: '#app',
            data: {
                colorArray: ['#FF395D', '#23F376', '#FFFB43', '#FA9C34', '#21CD92', '#ED31A2', '#E22'],
                knobs: [
                    {
                        id: 0,
                        visualEffect: 'uSineDistortCycleCount',
                        soundEffect: 'sPhaserEffect',
                        label: 'Phaser',
                        rotation: -132,
                        color: '#FF395D',
                        active: true,
                        selected: false,
                        style: 1
                    },
                    {
                        id: 1,
                        visualEffect: 'uSineDistortSpread',
                        soundEffect: 'sAutoWahEffect',
                        label: 'AutoWah',
                        rotation: -132,
                        color: '#01ED95',
                        active: true,
                        selected: false,
                        style: 1
                    },
                    {
                        id: 2,
                        visualEffect: 'uSineDistortAmplitude',
                        soundEffect: 'sVibratoEffect',
                        label: 'Vibrato',
                        rotation: -132,
                        color: '#69FFFE',
                        active: true,
                        selected: false,
                        style: 1
                    },
                    {
                        id: 3,
                        visualEffect: 'uNoiseDistortAmplitude',
                        soundEffect: 'sPitchEffect',
                        label: 'Pitch shift',
                        rotation: -132,
                        color: '#EDAC01',
                        active: true,
                        selected: false,
                        style: 1
                    },
                    {
                        id: 4,
                        visualEffect: 'uNoiseDistortVolatility',
                        soundEffect: 'sDistortionEffect',
                        label: 'Distortion',
                        rotation: -132,
                        color: '#9256D7',
                        active: true,
                        selected: false,
                        style: 1
                    },
                    {
                        id: 5,
                        visualEffect: 'uRotation',
                        soundEffect: 'sReverbEffect',
                        label: 'Reverb',
                        rotation: -132,
                        color: '#ED31A2',
                        active: true,
                        selected: false,
                        style: 1
                    },
                ],
                currentY: 0,
                mousemoveFunction: function (e) {
                    var selectedKnob = app.knobs.filter(function (i) {
                        return i.selected === true;
                    }
                    )[0];

                    if (selectedKnob) {
                        $("#apply-all-button").attr("src", "../assets/icons/applyICN.svg");

                        // Knob Rotation
                        if (e.pageY - app.currentY !== 0) {
                            selectedKnob.rotation -= (e.pageY - app.currentY);
                        }
                        app.currentY = e.pageY;

                        let knobVisualEffect = selectedKnob.visualEffect;
                        let knobSoundEffect = selectedKnob.soundEffect;
                        let rotationValue = selectedKnob.rotation;
                        let currentValue = updateInputValue(knobVisualEffect, knobSoundEffect, rotationValue,
                            effectRanges[knobVisualEffect].minVisual, effectRanges[knobVisualEffect].maxVisual,
                            effectRanges[knobVisualEffect].minSound, effectRanges[knobVisualEffect].maxSound
                        );

                        switch (knobVisualEffect) {
                            case 'uSineDistortCycleCount': {
                                const autowahKnob = app.knobs[1];
                                let autowahConvertValue = updateInputValue(autowahKnob.visualEffect, autowahKnob.soundEffect, rotationValue,
                                    effectRanges["uSineDistortSpread"].minVisual, effectRanges["uSineDistortSpread"].maxVisual,
                                    effectRanges["uSineDistortSpread"].minSound, effectRanges["uSineDistortSpread"].maxSound);
                                data[char].autowahValue = true;
                                phaserEffect.octaves = currentValue;
                                break;
                            }
                            case 'uSineDistortSpread': {
                                data[char].autowahValue = false;
                                autoWahEffect.octavas = currentValue;
                                break;
                            }

                            case 'uSineDistortAmplitude': {
                                vibratoEffect.depth.value = currentValue;
                                break;
                            }
                            case 'uNoiseDistortAmplitude': {
                                pitchEffect.pitch = currentValue;
                                break;
                            }
                            case 'uNoiseDistortVolatility': {
                                distortionEffect.distortion = currentValue;
                                break;
                            }
                            case 'uRotation': {
                               reverbEffect.roomSize.input.value = currentValue;
                               reverbEffect.dampening.input.value = 10000;
                               break;
                            }
                        }
                        instrument.triggerAttackRelease(note, '16n');

                        // Setting Max rotation
                        if (selectedKnob.rotation >= 132) {
                            selectedKnob.rotation = 132;
                        } else if (selectedKnob.rotation <= -132) {
                            selectedKnob.rotation = -132;
                        }
                    }
                },
                initializeContorllers: function (e) {
                    app.knobs.forEach(function (knob) {
                        if (knob.label === "AutoWah"){
                            if (data[char].autowahValue === true){
                                rotationValue=-132;
                            }
                            else{
                                rotationValue = convertValueToRotation(knob.visualEffect);
                                knob.rotation = rotationValue;
                            }
                        }
                        else{
                            rotationValue = convertValueToRotation(knob.visualEffect);
                            knob.rotation = rotationValue;
                        }
                        
                    })
                    $("#app").show();

                }
            },
            methods: {
                unselectKnobs: function () {
                    for (var i in this.knobs) {
                        this.knobs[i].selected = false;
                    }
                }
            }
        });

        app.initializeContorllers();
        window.addEventListener('mousemove', app.mousemoveFunction);

        $(window).on("beforeunload", function () {
            localStorage.setItem('data', JSON.stringify(data));
        })

        $("#back").click(function () {
            localStorage.setItem("brightMode", brightModeOn);
            localStorage.setItem("data", JSON.stringify(data));
            location.assign("../menu");
        });

        $("#darkMode").click(function(){
            switchFilterMode();
            var text = new Blotter.Text(char, {
                family: font,
                weight: font === "Frank Ruhl Libre" ? "700" : "normal",
                fill: brightModeOn ? darkGrey : white,
                size: 400,
            });
    
            material = new Blotter.RollingDistortMaterial();
            Object.keys(material.uniforms).forEach(function (key, index) {
                if (defaultUniforms[key]) {
                    if (key === "uDistortPosition") {
                        material.uniforms[key].value = [Number(data[char].uniforms[key][0]), Number(data[char].uniforms[key][1])];
                    } else {
                        material.uniforms[key].value = Number(data[char].uniforms[key])
                    }
                }
            })
    
            
            blotter = new Blotter(material, {
                texts: text,
            });
            
            var scope = blotter.forText(text);
            document.querySelector("#char").innerHTML = null;
            scope.appendTo(document.querySelector("#char"));
          });


        $("#applyAll").click(function () {
            Object.keys(data).forEach(function (currChar) {
                data[currChar].uniforms = data[char].uniforms;
                data[currChar].soundEffects = data[char].soundEffects;
            })
            $("#apply-all-button").attr("src", "../assets/icons/apply2ICN.svg");
        });

        $("#reset").click(function () {

            data[char].soundEffects = Object.assign({}, defaultSoundEffects);
            data[char].uniforms = Object.assign({}, defaultUniforms);
            app.initializeContorllers();
            Object.keys(blotter.material.uniforms).forEach(function (key, index) {
                if (defaultUniforms[key]) {
                    if (key === "uDistortPosition") {
                        blotter.material.uniforms[key].value = [
                            Number(defaultUniforms[key][0]),
                            Number(defaultUniforms[key][1])
                        ];
                    } else {
                        blotter.material.uniforms[key].value = Number(defaultUniforms[key]);
                    }
                }
            });

            Object.values(blotter._scopes)[0].render();
        });
    }
});

