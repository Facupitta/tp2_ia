const grafo = require('./grafos/grafo1.json');
const seleccion = require('./seleccion.js');
const cruzamiento = require('./cruzamiento.js');

const nodoInicial = 'A';
const nodoFinal = 'H';

const pesoMaximo = grafo.reduce((acum, camino) => acum + pesoCamino(camino), 0);
const penalizacionMaxima = 10 + grafo.length * 2;

console.log(pesoMaximo);

// El cromosoma de un individuo tiene "grafo.length" elementos
// Es un array del estilo [0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0]
// Un individuo es un recorrido subconjunto del grafo
// Los caminos validos valen mas de 1000 (para que tengan mas chance en ruleta), y los invalidos entre 0 y 200
function aptitud(cromosoma) {
  const individuo = grafo.filter((_, index) => cromosoma[index]);
  const puntaje = esRecorridoValido(individuo) ? 2000 - 1000 * individuo.reduce((acum, actual) => acum + pesoCamino(actual), 0) / pesoMaximo : 200 - 200 * penalizacion(individuo) / penalizacionMaxima;
  return puntaje
}

function esRecorridoValido(recorrido) {
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

function penalizacion(recorrido) {
  const puntos = nodos(recorrido);
  const sinRepetidos = puntos.filter((nodo, index) => puntos.indexOf(nodo) === index);
  // Le sumo 1 por aparicion incorrecta de cada nodo (si es un extremo deberia aparecer 1 sola vez, si es intermedio 2)
  let ret = sinRepetidos.reduce((acum, nodo) => acum + Math.abs(([nodoInicial, nodoFinal].includes(nodo) ? 1 : 2) - puntos.filter(nodo2 => nodo === nodo2).length), 0);
  // Le sumo 5 por cada extremo que falte
  ret += 10 - 5 * sinRepetidos.filter(nodo => nodo === nodoInicial || nodo === nodoFinal).length;
  
  return ret;
}

function nodos(recorrido) {
  return recorrido.flatMap(camino => [camino.extremo1, camino.extremo2]);
}

function pesoCamino(camino) {
  return camino.distancia * camino.trafico;
}



// ------------ MAIN

let iteraciones = 0;
let poblacion = [];

// Parámetros
const cantIndividuos = 1200;
const cantSeleccionados = cantIndividuos / 2;
const probabilidadMutacion = 0.8;

function main() {
  generacionInicial();

  while (!corte()) {
    const seleccionados = seleccionar();
    cruzar(seleccionados);
    mutacion();

    console.log(`#${iteraciones} | ${promedioAptitud()}`);
    
    iteraciones++;
  }

  console.log('Mejor individuo: ' + JSON.stringify(mejorIndividuoPoblacion()));
}


main();



// Generar la poblacion inicial al azar
function generacionInicial() {
  for (let i = 0; i < cantIndividuos; i++) {
    poblacion.push(grafo.map(() => Math.random() > 0.5 ? 1 : 0));
  }
}

function seleccionar() {
  // return seleccion.ranking(poblacion, cantSeleccionados, aptitud);
  return seleccion.ruleta(poblacion, cantSeleccionados, aptitud);
}

function cruzar(seleccionados) {
  const cruzados = [];
  
  const parejas = [];
  while (parejas.length < cantIndividuos / 2) {
    const i = Math.round(Math.random() * (seleccionados.length - 1));
    const j = Math.round(Math.random() * (seleccionados.length - 1));
    parejas.push([poblacion[seleccionados[i]], poblacion[seleccionados[j]]]);
  }

  // cruzados.push(parejas.flatMap(pareja => cruzamiento.cruzaSimple(pareja, 5)));
  // cruzados.push(parejas.flatMap(pareja => cruzamiento.cruzaBinomial(pareja, 'XYXYXYXYXYX')));
  cruzados.push(parejas.flatMap(pareja => cruzamiento.cruzaMascaraDoble(pareja, 'XXYYXXYYXYX', 'YYYXXXYYYXY')));

  poblacion = cruzados.flat();

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
  return iteraciones >= 15;
}

function traducirCromosoma(cromosoma) {
  return grafo.filter((_, index) => cromosoma[index])
    .reduce((acum, camino) => `${acum}, ${camino.extremo1} <-> ${camino.extremo2}`, '')
    .substring(2);
}

function promedioAptitud() {
  return ('' + poblacion.reduce((acum, i) => acum + aptitud(i), 0) / poblacion.length).replace('.', ',');
}

function mejorIndividuoPoblacion() {
  return poblacion.map(cromosoma => ({
    cromosoma,
    aptitud: aptitud(cromosoma),
    interpretacion: traducirCromosoma(cromosoma)
  }))
    .sort((a, b) => aptitud(b) - aptitud(a))
    [0]
}