const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
const defaultSoundEffects = JSON.parse(localStorage.getItem("defaultSoundEffects"));
const brightMode = localStorage.getItem("brightMode");
let instrument,
    autoWahEffect,
    phaserEffect,
    vibratoEffect,
    reverbEffect,
    pitchEffect,
    distortionEffect,
    feedbackEffect,
    tremoloEffect,
    brightModeOn,
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
        families: ["Frank Ruhl Libre:bold"]
    },
    custom: {
        families: [font],
        urls: ['../../fonts/fonts.css']
    },
    active: function () {
        var text = new Blotter.Text(char, {
            family: font,
            weight: font === "Frank Ruhl Libre" ? "bold" : "normal",
            fill: brightModeOn ? darkGrey : white,
            size: 330,
        });

        var material = new Blotter.RollingDistortMaterial();
        Object.keys(material.uniforms).forEach(function (key, index) {
            if (defaultUniforms[key]) {
                if (key === "uDistortPosition") {
                    material.uniforms[key].value = [Number(data[char].uniforms[key][0]), Number(data[char].uniforms[key][1])];
                } else {
                    material.uniforms[key].value = Number(data[char].uniforms[key])
                }
            }
        })

        var blotter = new Blotter(material, {
            texts: text,
        });
        
        var scope = blotter.forText(text);
        scope.appendTo(document.querySelector("#char"));


        function updateInputValue(visualEffect, soundEffect, currentValue, minVisual, maxVisual, minSound, maxSound, phaser) {
            let visualValue = convertValueToRange(minVisual, maxVisual, currentValue);
            let soundValue = convertValueToRange(minSound, maxSound, currentValue);
            const [x, y] = material.uniforms.uDistortPosition.value;
            if (visualEffect === 'uDistortPositionX' || visualEffect === 'uDistortPositionY') {
                if (visualEffect === 'uDistortPositionX') {
                    material.uniforms.uDistortPosition.value[0] = Number(visualValue);
                    data[char].uniforms.uDistortPosition[0] = Number(visualValue);
                }
                if (visualEffect === 'uDistortPositionY') {
                    material.uniforms.uDistortPosition.value[1] = Number(visualValue);
                    data[char].uniforms.uDistortPosition[1] = Number(visualValue);
                }
            }
            else {
                material.uniforms[visualEffect].value = visualValue;
                // if (!phaser){
                    data[char].uniforms[visualEffect] = visualValue;
                // }else{
                    autowahValue = visualValue;
                // }
            }
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
            if (min < 0) {
                value = parseFloat(value) + parseFloat(min);
            }
            if (max < 0) {
                value = parseFloat(value) + parseFloat(max);
            }
            return value;
        }

        function convertValueToRotation(effect, phaserValue) {
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



        var app = new Vue({
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
                        soundEffect: 'sTremoloEffect',
                        label: 'Tremolo',
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
                            effectRanges[knobVisualEffect].minSound, effectRanges[knobVisualEffect].maxSound, false
                        );

                        switch (knobVisualEffect) {
                            case 'uSineDistortCycleCount': {
                                // autowahValue = app.knobs[1];
                                // autowahValue = updateInputValue(autowahValue.visualEffect, autowahValue.soundEffect, rotationValue,
                                //     effectRanges["uSineDistortSpread"].minVisual, effectRanges["uSineDistortSpread"].maxVisual,
                                //     effectRanges["uSineDistortSpread"].minSound, effectRanges["uSineDistortSpread"].maxSound, true
                                // );
                                // let rotationAutoValue = convertValueToRotation("uSineDistortSpread", rotationValue);
                                // app.knobs[1].rotation = rotationAutoValue;
                                phaserEffect.octaves = currentValue;
                                break;
                            }
                            case 'uSineDistortSpread': {
                                autoWahEffect.octaves = currentValue;
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
                                tremoloEffect.depth.value = currentValue;
                                break;
                            }
                        }
                        instrument.set("detune", -1200);
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
                        rotationValue = convertValueToRotation(knob.visualEffect, false);
                        knob.rotation = rotationValue;
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
            data[char].uniforms["uSineDistortSpread"] = autowahValue;
            console.log(autowahValue);
            console.log(data[char].uniforms["uSineDistortSpread"]);
            localStorage.setItem("data", JSON.stringify(data));
            
            location.assign("../menu");
        });

        $("#darkMode").click(function(){
            switchFilterMode();
            blotter.texts[0].properties.fill = brightModeOn ? darkGrey : white;
            
            // blotter.uniforms = Object.assign(Object.assign({}, defaultUniforms), data[char].uniforms);
            console.log(blotter.uniforms);
            console.log(data[char].uniforms);
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
            blotter.needsUpdate = true;
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

