// --- Notes ---
// https://mir-s3-cdn-cf.behance.net/project_modules/disp/1dd3e221774089.56307491c7600.png
// https://www.surrealmachines.com/wp-content/uploads/xmodnetic-laptop.png.pagespeed.ic.EB89gLdCx-.webp

// - To Do -
// Make components for the knobs
// Need to make two way knobs
// - for this i have to figure out how to have the svg break point in the middle of the arc

// - Vue Stuff -
var app = new Vue({
    el: '#app',
    data: {
        colorArray: ['#23CDE8', '#23F376', '#FFFB43', '#FA9C34', '#21CD92', '#ED31A2', '#E22'],
        effects: [],
        knobs: [{
            id: 0,
            label: 'Test Knob',
            rotation: -132,
            color: '#FA9C34',
            active: true,
            selected: false,
            style: 1
        }, ],
        currentY: 0,
        mousemoveFunction: function (e) {
            var selectedKnob = app.knobs.filter(function (i) {
                return i.selected === true;
            })[0];
            if (selectedKnob) {
                // Knob Rotation
                if (e.pageY - app.currentY !== 0) {
                    selectedKnob.rotation -= (e.pageY - app.currentY);
                }
                app.currentY = e.pageY;

                // Setting Max rotation
                if (selectedKnob.rotation >= 132) {
                    selectedKnob.rotation = 132;
                } else if (selectedKnob.rotation <= -132) {
                    selectedKnob.rotation = -132;
                }
            }
        },
    },
    methods: {
        unselectKnobs: function () {
            for (var i in this.knobs) {
                this.knobs[i].selected = false;
            }
            for (var i in this.effects) {
                for (var j in this.effects[i].knobs) {
                    this.effects[i].knobs[j].selected = false;
                }
                this.effects[i].selected = false;
            }
        }
    }
});

window.addEventListener('mousemove', app.mousemoveFunction);