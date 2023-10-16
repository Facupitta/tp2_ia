function cruzaSimple(pareja, ptoCorte) {
  const padreA = pareja[0];
  const padreB = pareja[1];

  const hijoA = [...padreA.slice(0, ptoCorte), ...padreB.slice(ptoCorte)];
  const hijoB = [...padreB.slice(0, ptoCorte), ...padreA.slice(ptoCorte)];

  return [
    hijoA,
    hijoB
  ];
}

// mascara ej: 'XXYYXYXXYXY'
function cruzaBinomial(pareja, mascara) {
  const mascaraComplemento = mascara.replaceAll('X', '?').replaceAll('Y', 'X').replaceAll('?', 'Y');
  return cruzaMascaraDoble(pareja, mascara, mascaraComplemento);
}

function cruzaMascaraDoble(pareja, mascara1, mascara2) {
  const padreA = pareja[0];
  const padreB = pareja[1];

  const hijoA = mascara1.split('').map((c, index) => c === 'X' ? padreA[index] : padreB[index]);
  const hijoB = mascara2.split('').map((c, index) => c === 'X' ? padreA[index] : padreB[index]);

  return [
    hijoA,
    hijoB
  ];
}

module.exports = {
  cruzaSimple,
  cruzaBinomial,
  cruzaMascaraDoble
}