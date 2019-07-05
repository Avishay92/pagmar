WebFont.load({
  google: {
    families: ["Frank Ruhl Libre:700"]
    
  },
  custom: {
      families: ['ploni_dl_1.1_aaabold'],
      urls: ['../../fonts/fonts.css']
  },
  active: function (){
    const text = new Blotter.Text('Fontune', {
      family: "'ploni_dl_1.1_aaabold'",
      size: 180,
      fill: '#ffffff',
      paddingLeft: 300,
      paddingRight: 300,
    });

    let material = new Blotter.LiquidDistortMaterial();

    material.uniforms.uSpeed.value = 0;
    material.uniforms.uVolatility.value = 0;
    material.uniforms.uSeed.value = 0;

    let blotter = new Blotter(material, {
      texts: text
    });

    let scope = blotter.forText(text);
    let elem = document.getElementById('plain-text');
    scope.appendTo(elem);

    $(".container").mousemove(function(e) {	
      material.uniforms.uSpeed.value = 0.05;
      const formula = ((e.pageX * e.pageY) / 1000000) / 1.5;
      if (formula){
        formula*-1;
      }
      material.uniforms.uVolatility.value = formula;
      material.uniforms.uSeed.value = formula;
      console.log(material.uniforms);
    });
    $(".container").mouseleave(function(e) {	
      material.uniforms.uSpeed.value = 0.1;
      material.uniforms.uVolatility.value = 0.1;
      material.uniforms.uSeed.value = 0;
  
    });
  }
});

