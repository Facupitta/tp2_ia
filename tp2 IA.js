const grafo = require('./grafo1.json');
const seleccion = require('./seleccion.js');
const cruzamiento = require('./cruzamiento.js');

const nodoInicial = 'A';
const nodoFinal = 'H';

// El cromosoma de un individuo tiene "grafo.length" elementos
// Es un array del estilo [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0]
// Un individuo es un recorrido subconjunto del grafo
function aptitud(cromosoma) {
  const individuo = grafo.filter((_, index) => cromosoma[index]);
  return esIndividuoValido(individuo) ? individuo.reduce((acum, actual) => acum + puntajeCamino(actual), 100) : -9999999;
}

function esIndividuoValido(recorrido) {
  return tieneInicio(recorrido) && tieneFinal(recorrido) && esLineal(recorrido);
}

function tieneInicio(recorrido) {
  return recorrido.some(camino => [camino.extremo1, camino.extremo2].includes(nodoInicial));
}

function tieneFinal(recorrido) {
  return recorrido.some(camino => [camino.extremo1, camino.extremo2].includes(nodoFinal));
}

function esLineal(recorrido) {
  const nodosActuales = nodos(recorrido); 
  return nodosActuales.every(nodo => nodosActuales.filter(nodo2 => nodo2 === nodo).length === ([nodoInicial, nodoFinal].includes(nodo) ? 1 : 2));
}

function nodos(recorrido) {
  return recorrido.flatMap(camino => [camino.extremo1, camino.extremo2]);
}

function puntajeCamino(camino) {
  return -(camino.distancia * camino.trafico);
}



// ------------ MAIN

let iteraciones = 0;
let poblacion = [];
const cantIndividuos = 120;
const cantSeleccionados = cantIndividuos / 2;
const aptitudCorte = 30;
const probabilidadMutacion = 0.2;

function main() {
  generacionInicial();

  while (!corte()) {
  //for (let i=0; i<4; i++) {
    const seleccionados = seleccionar();
    cruzar(seleccionados);
    mutacion();
    
    iteraciones++;
  }
  console.log('Iteraciones: ' + iteraciones);
  console.log('Poblacion: ' + poblacion.length);
  poblacionFinal();
}

// Generar la poblacion inicial
// 1) Al azar: generar todo random (puede haber invalidos)
// 2) Ad-hoc: generar x individuos validos armados por mi
function generacionInicial() {
  // al azar
  for (let i = 0; i < cantIndividuos; i++) {
    poblacion.push(grafo.map(() => Math.random() > 0.5 ? 1 : 0));
  }
}

main();

function seleccionar() {
  return seleccion.ranking(poblacion, cantSeleccionados, aptitud);
}

function cruzar(seleccionados) {
  const cruzados = [];

  logPoblacion();
  
  console.log('seleccionados: ' + hacerChiquito(seleccionados))
  const parejas = [];
  while (parejas.length < cantIndividuos / 2) {
    const i = Math.round(Math.random() * (seleccionados.length - 1));
    const j = Math.round(Math.random() * (seleccionados.length - 1));
    parejas.push([poblacion[seleccionados[i]], poblacion[seleccionados[j]]]);
  }

  cruzados.push(parejas.flatMap(pareja => cruzamiento.cruzaBinomial(pareja, 'XYXYXYXYXYX')));


  /*  
  for (let j = 0; j < cantIndividuos / seleccionados.length; j++) {
    const seleccionadosMezclados = seleccionados.sort(() => Math.random() - 0.5);
    console.log('seleccionados mezclados con j = ' + j + ': ' + hacerChiquito(seleccionadosMezclados))
    const parejas = [];
  
    for (let i = 0; i < seleccionadosMezclados.length; i += 2) {
      parejas.push([poblacion[seleccionadosMezclados[i]], poblacion[seleccionadosMezclados[i + 1]]]);
    }

    cruzados.push(parejas.flatMap(pareja => cruzamiento.cruzaSimple(pareja, Math.random() * grafo.length)));
  }
  */

  poblacion = cruzados.flat();

  logPoblacion();

  // const cruzados = parejas.flatMap(pareja => cruzamiento.cruzaMascaraDoble(pareja, 'XXYYXXYYXXY', 'XXXXYYYYXXX'));

  // Actualizo la poblacion
  /*
  for (i in cruzados) {
    poblacion[seleccionadosMezclados[i]] = cruzados[i];
  }
  */

}

// No siempre se ejecuta, se determina mediante un random
function mutacion() {
  if (Math.random() <= probabilidadMutacion) {
    const individuoRandomIndex = Math.floor(Math.random() * poblacion.length);
    const bitRandomIndex = Math.floor(Math.random() * grafo.length);

    poblacion[individuoRandomIndex][bitRandomIndex] = poblacion[individuoRandomIndex][bitRandomIndex] === 1 ? 0 : 1;
  }
}

function corte() {
  const mejor = poblacion.filter(individuo => aptitud(individuo) > aptitudCorte)[0];
  if (mejor) {
    console.log('Mejor: ', traducirIndividuo(mejor));
    console.log('Aptitud: ', aptitud(mejor))
  }
  return !!mejor;
}

function poblacionFinal() {}


function traducirIndividuo(individuo) {
  return grafo.filter((_, index) => individuo[index])
    .map(camino => `${camino.extremo1} <-> ${camino.extremo2}`);
}


// Debug

function hacerChiquito(individuo) {
  return individuo.reduce((acum, e) => '' + acum + e, '');
}

function logPoblacion() {
  poblacion.forEach((individuo, index) => {
    console.log(index + ': ' + hacerChiquito(individuo));
  })
}