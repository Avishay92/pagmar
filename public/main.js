const body = document.body;
const docEl = document.documentElement;

WebFont.load({
    google: {
        families: ["Frank Ruhl Libre:700"]
    },
    custom: {
        families: ['ploni_dl_1.1_aaabold'],
        urls: ['./fonts/plonibold.css']
    },
    active: () => {
        sessionStorage.fonts = true;
        setTimeout(createBlotterText, 500);
    }
});

const MathUtils = {
    lineEq: (y2, y1, x2, x1, currentVal) => {
        var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        return m * currentVal + b;
    },
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, x2, y1, y2) => {
        var a = x1 - x2;
        var b = y1 - y2;
        return Math.hypot(a, b);
    }
};

let winsize;
const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
calcWinsize();
window.addEventListener('resize', calcWinsize);

const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
        posx = ev.pageX;
        posy = ev.pageY;
    }
    else if (ev.clientX || ev.clientY) {
        posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
        posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return { x: posx, y: posy };
}

let mousePos = { x: winsize.width / 2, y: winsize.height / 2 };
window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));

const elem = document.querySelector('.content__text');

const createBlotterText = () => {
    const text = new Blotter.Text("Fontune", {
        family: "'ploni_dl_1.1_aaabold'",
        weight: 900,
        size: 160,
        paddingLeft: 300,
        paddingRight: 300,
        paddingTop: 100,
        paddingBottom: 10,
        fill: 'white'
    });

    const material = new Blotter.LiquidDistortMaterial();
    material.uniforms.uSpeed.value = 1;
    material.uniforms.uVolatility.value = 0;
    material.uniforms.uSeed.value = 0.1;
    const blotter = new Blotter(material, { texts: text });
    const scope = blotter.forText(text);
    scope.appendTo(elem);

    let lastMousePosition = { x: winsize.width / 2, y: winsize.height / 2 };
    let volatility = 0;

    const render = () => {
        const docScrolls = { left: body.scrollLeft + docEl.scrollLeft, top: body.scrollTop + docEl.scrollTop };
        const relmousepos = { x: mousePos.x - docScrolls.left, y: mousePos.y - docScrolls.top };
        const mouseDistance = MathUtils.distance(lastMousePosition.x, relmousepos.x, lastMousePosition.y, relmousepos.y);

        volatility = MathUtils.lerp(volatility, Math.min(MathUtils.lineEq(0.9, 0, 100, 0, mouseDistance), 0.9), 0.05);
        material.uniforms.uVolatility.value = volatility;

        lastMousePosition = { x: relmousepos.x, y: relmousepos.y };
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
};

$('.content__text').arrive('canvas', function () {
    $(this).attrchange({
        trackValues: true, callback: function (event) {
            $('.content__text').css({ opacity: 1 });
        }
    });
})