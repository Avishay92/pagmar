const char = localStorage.getItem("char");
const data = JSON.parse(localStorage.getItem("data"));
const defaultUniforms = JSON.parse(localStorage.getItem("defaultUniforms"));
data[char].uniforms = Object.assign(defaultUniforms, data[char].uniforms);

var text = new Blotter.Text(char, {
    family: "Frank Ruhl Libre",
    size: 100,
    fill: "white",
});

function setCharDataUniform(uniform, value) {
    data[char].uniforms[uniform] = value;
}

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

const inputElements = document.querySelectorAll('input');
for (let inputElement of inputElements) {
    inputElement.addEventListener('input', ({
        currentTarget
    }) => {
        const currentValue = currentTarget.value;
        const {
            id: propKey
        } = currentTarget;
        switch (propKey) {
            case 'uDistortPositionY': {
                const [x, y] = material.uniforms.uDistortPosition.value;
                material.uniforms.uDistortPosition.value = [x, Number(currentValue)];
                setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
                break;
            }
            case 'uDistortPositionX': {
                const [x, y] = material.uniforms.uDistortPosition.value;
                material.uniforms.uDistortPosition.value = [Number(currentValue), y];
                setCharDataUniform("uDistortPosition", material.uniforms.uDistortPosition.value);
                break;
            }
            default: {
                material.uniforms[propKey].value = currentValue;
                setCharDataUniform(propKey, currentValue);
            }
        }
    })
}

$(document).ready(function () {
    inputElements.forEach(function (inputElement) {
        switch (inputElement.id) {
            case 'uDistortPositionY': {
                const [x, y] = data[char].uniforms.uDistortPosition;
                inputElement.value = Number(y);
                break;
            }
            case 'uDistortPositionX': {
                const [x, y] = data[char].uniforms.uDistortPosition;
                inputElement.value = Number(x);
                break;
            }
            default: {
                inputElement.value = Number(data[char].uniforms[inputElement.id]);
            }
        }
    })
});

$(window).on("beforeunload", function () {
    localStorage.setItem('data', JSON.stringify(data));
})

$("button").click(function () {
    localStorage.setItem("data", JSON.stringify(data));
    location.assign("../menu");
});