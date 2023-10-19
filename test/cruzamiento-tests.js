const cruzamiento = require('./../cruzamiento.js');



testCruzaSimple([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 3);
testCruzaBinomial([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 'XXYYXYXXYXY');
testCruzaMascaraDoble([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 'XXYYXYXXYXY', 'YXYXYXXYYXX');







function testCruzaSimple(padreA, padreB, ptoCorte) {
  const res = cruzamiento.cruzaSimple([padreA, padreB], ptoCorte);
  testCruza(cruzamiento.cruzaSimple, res, padreA, padreB, ptoCorte, '-', '-');
}

function testCruzaBinomial(padreA, padreB, mascara) {
  const res = cruzamiento.cruzaBinomial([padreA, padreB], mascara);
  testCruza(cruzamiento.cruzaBinomial, res, padreA, padreB, '-', mascara, '-');
}

function testCruzaMascaraDoble(padreA, padreB, mascara, mascara2) {
  const res = cruzamiento.cruzaMascaraDoble([padreA, padreB], mascara, mascara2);
  testCruza(cruzamiento.cruzaMascaraDoble, res, padreA, padreB, '-', mascara, mascara2);
}

function testCruza(algoritmo, hijos, padreA, padreB, ptoCorte, mascara, mascara2) {
  console.log(` ------------------------
  algoritmo: ${algoritmo.name}
  ptoCorte: ${ptoCorte}
  mascara: ${mascara}
  mascara2: ${mascara2}
  Padre A: ${JSON.stringify(padreA)}
  Padre B: ${JSON.stringify(padreB)}
  Hijo A:  ${JSON.stringify(hijos[0])}
  Hijo B:  ${JSON.stringify(hijos[1])}
  ------------------------
  `);
}