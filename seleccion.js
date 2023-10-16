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
    poblacion[i].probabilidadAcum = probabilidadAcum + aptitud(poblacion[i]);
  }

  for (let i = 0; i < top; i++) {
    const rand = Math.random() * total;
    console.log('acums: ', poblacion.map(i => i.probabilidadAcum));
    console.log('Rand: ' + rand);
    const index = poblacion.findIndex(individuo => individuo.probabilidadAcum <= rand);
    seleccionados.push(index);
    poblacion.splice(index, 1);
  }

  return seleccionados;
}

module.exports = {
  ranking,
  ruleta
}