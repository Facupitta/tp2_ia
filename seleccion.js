function ranking(poblacion, top, aptitud) {
  return poblacion
    .map((individuo, index) => ({aptitud: aptitud(individuo), index}))
    .sort((a, b) => b.aptitud - a.aptitud)
    .slice(0, top)
    .map(elemento => elemento.index); // Tomo "top" elementos
}

// Sacar la suma de aptitudes de toda la poblacion
// a cada elemento asignarle su probabilidad acumulada
// tirar un random
// elegir al que le cae
function ruleta(poblacion, top, aptitud) {
  const seleccionados = [];
  const total = poblacion.reduce((acum, a) => acum + aptitud(a), 0);
  let probabilidadAcum = 0;

  for (i in poblacion) {
    probabilidadAcum += aptitud(poblacion[i]);
    poblacion[i].probabilidadAcum = probabilidadAcum;
  }

  //console.log('total: ' + total + ', acum: ' + poblacion[poblacion.length-1].probabilidadAcum)

  //console.log('acums: ', poblacion.map(i => i.probabilidadAcum));
  while (seleccionados.length < top) {
    const rand = Math.random() * total;
    //console.log('Rand: ' + rand);
    const index = poblacion.findIndex(individuo => individuo.probabilidadAcum >= rand);
    seleccionados.push(index);
  }

  return seleccionados;
}

module.exports = {
  ranking,
  ruleta
}