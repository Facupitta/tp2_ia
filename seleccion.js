function ranking(poblacion, top, aptitud) {
  return poblacion
    .map((individuo, index) => ({aptitud: aptitud(individuo), index}))
    .sort((a, b) => b.aptitud - a.aptitud)
    .slice(0, top)
    .map(elemento => elemento.index); // Tomo "top" elementos
}

function ruleta(poblacion, top, aptitud) {
  const seleccionados = [];
  const total = poblacion.reduce((acum, a) => acum + aptitud(a), 0);
  let probabilidadAcum = 0;

  for (i in poblacion) {
    probabilidadAcum += aptitud(poblacion[i]);
    poblacion[i].probabilidadAcum = probabilidadAcum;
  }

  while (seleccionados.length < top) {
    const rand = Math.random() * total;
    const index = poblacion.findIndex(individuo => individuo.probabilidadAcum >= rand);
    seleccionados.push(index);
  }

  return seleccionados;
}

module.exports = {
  ranking,
  ruleta
}