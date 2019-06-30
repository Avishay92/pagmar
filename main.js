const text = new Blotter.Text('Fontune', {
    family: "'ploni_dl_1.1_aaabold', serif",
    size: 180,
    fill: '#ffffff',
  });

  let material = new Blotter.LiquidDistortMaterial();

  material.uniforms.uSpeed.value = 0.05;
  material.uniforms.uVolatility.value = 0.1;
  material.uniforms.uSeed.value = 0.1;

  let blotter = new Blotter(material, {
    texts: text
  });

  let scope = blotter.forText(text);
  let elem = document.getElementById('plain-text');
  scope.appendTo(elem);

  $("#plain-text").mousemove(function(e) {	
     material.uniforms.uSpeed.value = 0.1;
    const formula = ((e.pageX * e.pageY) / 400000) / 1.5;
    material.uniforms.uVolatility.value = formula;
    material.uniforms.uSeed.value = formula;
  });
  
  $("#plain-text").mouseleave(function(e) {	
  material.uniforms.uSpeed.value = 0.05;
  const formula = ((e.pageX * e.pageY) / 400000) / 1.5;
  material.uniforms.uVolatility.value = formula;
  material.uniforms.uSeed.value = formula;
  });
