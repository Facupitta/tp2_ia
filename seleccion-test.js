const seleccion = require('./seleccion.js');

const poblacion = [
  [0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,1,1],
  [0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,1,0,1],
  [0,0,0,0,0,0,0,0,1,1,0],
  [0,0,0,0,0,0,0,0,1,1,1],
  [0,0,0,0,0,0,0,1,0,0,0]
];

function aptitud(individuo) {
  return individuo.reduce((acum, val, index) => acum + val*Math.pow(2, 10-index));
};


//testCruzaSimple([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 3);
//testCruzaBinomial([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 'XXYYXYXXYXY');
//testCruzaMascaraDoble([0,1,1,0,0,1,0,1,0,1,1], [1,0,0,0,1,1,1,0,0,1,0], 'XXYYXYXXYXY', 'YXYXYXXYYXX');
testSeleccionRanking(poblacion, 3, aptitud);
testSeleccionRuleta(poblacion, 3, aptitud);

function testSeleccionRanking(poblacion, top, aptitud) {
  test(seleccion.ranking, poblacion, top, aptitud);
}

function testSeleccionRuleta(poblacion, top, aptitud) {
  test(seleccion.ruleta, poblacion, top, aptitud);
}


function test(algoritmo, poblacion, top, aptitud) {
  const res = algoritmo(poblacion, top, aptitud);
  console.log(` ------------------------
  Algoritmo: ${algoritmo.name}
  Poblacion: ${JSON.stringify(poblacion)}
  Top: ${top}
  Indices seleccionados:  ${JSON.stringify(res)}
  ------------------------
  `);
}