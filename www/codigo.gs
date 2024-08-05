function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function calculateIDTEL(data) {
  const { total, tipotel, edad } = data;
  let existeTel = '';
  let tipoDeTel = '';

  if (edad >= 6 && edad <= 7) {
    if (total <= 66) {
      existeTel = 'Presencia de TEL';
      if (tipotel !== '' && tipotel !== null && tipotel !== undefined) {
        if (tipotel <= 21) {
          tipoDeTel = 'TEL Mixto';
        } else if (tipotel >= 22) {
          tipoDeTel = 'TEL Expresivo';
        }
      }
    } else if (total >= 67) {
      existeTel = 'Ausencia de TEL';
    }
  } else if (edad >= 8 && edad <= 9) {
    if (total <= 111) {
      existeTel = 'Presencia de TEL';
      if (tipotel !== '' && tipotel !== null && tipotel !== undefined) {
        if (tipotel <= 76) {
          tipoDeTel = 'TEL Mixto';
        } else if (tipotel >= 77) {
          tipoDeTel = 'TEL Expresivo';
        }
      }
    } else if (total >= 112) {
      existeTel = 'Ausencia de TEL';
    }
  }

  // Concatenar tipoDeTel solo si existeTel es 'Presencia de TEL' y tipoDeTel no está vacío
  console.log(`existeTel: ${existeTel},tipoDeTel: ${tipoDeTel}` );
  if (existeTel === 'Presencia de TEL' && tipoDeTel) {
    return { diagnostico: `${existeTel}`, tipo: `${tipoDeTel}` };
  } else {
    return { diagnostico: `${existeTel}`, tipo: '' };
  }
}



//LISTO
function calculateSTSG(data) {
  // Desestructurando los datos de entrada
  const { pr, pe, edad } = data;
  console.log(`pr: ${pr},pe: ${pe},edad: ${edad}` );
  // Inicializando variables
  let puntPromedioRecep = 0;
  let desviacionStandarRecep = 0;
  let puntPromedioExp = 0;
  let desviacionStandarExp = 0;
  let percentilPR = '';
  let percentilPE = '';

  // Definiendo los rangos de edad y sus correspondientes valores y percentiles
  const edadRangos = [
    {
      min: 3, max: 4, desviacionRecep: 5.1, promedioRecep: 29.0, desviacionExp: 6.6, promedioExp: 14.5,
      percentilesPR: [
        { min: 0, max: 22, rango: "menos de p10" },
        { min: 23, max: 24, rango: "p10-p25" },
        { min: 25, max: 29, rango: "p25-p50" },
        { min: 30, max: 32, rango: "p50-p75" },
        { min: 33, max: 35, rango: "p75-p90" },
        { min: 36, max: Infinity, rango: "mas de p90" }
      ],
      percentilesPE: [
        { min: 0, max: 5, rango: "menos de p10" },
        { min: 6, max: 8, rango: "p10-p25" },
        { min: 9, max: 14, rango: "p25-p50" },
        { min: 15, max: 18, rango: "p50-p75" },
        { min: 19, max: 23, rango: "p75-p90" },
        { min: 24, max: Infinity, rango: "mas de p90" }
      ]
    },
    {
      min: 4, max: 5, desviacionRecep: 3.9, promedioRecep: 32.4, desviacionExp: 6.7, promedioExp: 20.6,
      percentilesPR: [
        { min: 0, max: 27, rango: "menos de p10" },
        { min: 28, max: 29, rango: "p10-p25" },
        { min: 30, max: 32, rango: "p25-p50" },
        { min: 33, max: 34, rango: "p50-p75" },
        { min: 35, max: 37, rango: "p75-p90" },
        { min: 38, max: Infinity, rango: "mas de p90" }
      ],
      percentilesPE: [
        { min: 0, max: 10, rango: "menos de p10" },
        { min: 11, max: 16, rango: "p10-p25" },
        { min: 17, max: 19, rango: "p25-p50" },
        { min: 20, max: 23, rango: "p50-p75" },
        { min: 24, max: 29, rango: "p75-p90" },
        { min: 30, max: Infinity, rango: "mas de p90" }
      ]
    },
    {
      min: 5, max: 6, desviacionRecep: 4.0, promedioRecep: 37.6, desviacionExp: 5.2, promedioExp: 29.3,
      percentilesPR: [
        { min: 0, max: 32, rango: "menos de p10" },
        { min: 33, max: 33, rango: "p10-p25" },
        { min: 34, max: 37, rango: "p25-p50" },
        { min: 38, max: 40, rango: "p50-p75" },
        { min: 41, max: 42, rango: "p75-p90" },
        { min: 43, max: Infinity, rango: "mas de p90" }
      ],
      percentilesPE: [
        { min: 0, max: 22, rango: "menos de p10" },
        { min: 23, max: 23, rango: "p10-p25" },
        { min: 24, max: 30, rango: "p25-p50" },
        { min: 31, max: 33, rango: "p50-p75" },
        { min: 34, max: 35, rango: "p75-p90" },
        { min: 36, max: Infinity, rango: "mas de p90" }
      ]
    },
    {
      min: 6, max: 7, desviacionRecep: 3.7, promedioRecep: 40.3, desviacionExp: 6.3, promedioExp: 34.4,
      percentilesPR: [
        { min: 0, max: 35, rango: "menos de p10" },
        { min: 36, max: 37, rango: "p10-p25" },
        { min: 38, max: 40, rango: "p25-p50" },
        { min: 41, max: 41, rango: "p50-p75" },
        { min: 42, max: 45, rango: "p75-p90" },
        { min: 46, max: Infinity, rango: "mas de p90" }
      ],
      percentilesPE: [
        { min: 0, max: 25, rango: "menos de p10" },
        { min: 26, max: 30, rango: "p10-p25" },
        { min: 31, max: 36, rango: "p25-p50" },
        { min: 37, max: 39, rango: "p50-p75" },
        { min: 40, max: 42, rango: "p75-p90" },
        { min: 43, max: Infinity, rango: "mas de p90" }
      ]
    },
    {
      min: 7, max: Infinity, desviacionRecep: 3.6, promedioRecep: 40.6, desviacionExp: 6.2, promedioExp: 39.8,
      percentilesPR: [
        { min: 0, max: 35, rango: "menos de p10" },
        { min: 36, max: 37, rango: "p10-p25" },
        { min: 38, max: 41, rango: "p25-p50" },
        { min: 42, max: 42, rango: "p50-p75" },
        { min: 43, max: 44, rango: "p75-p90" },
        { min: 45, max: Infinity, rango: "mas de p90" }
      ],
      percentilesPE: [
        { min: 0, max: 35, rango: "menos de p10" },
        { min: 36, max: 36, rango: "p10-p25" },
        { min: 37, max: 39, rango: "p25-p50" },
        { min: 40, max: 41, rango: "p50-p75" },
        { min: 42, max: 43, rango: "p75-p90" },
        { min: 44, max: Infinity, rango: "mas de p90" }
      ]
    }
  ];

  // Encontrar el rango correspondiente a la edad
  const rango = edadRangos.find(r => edad >= r.min && edad < r.max);

  // Verificar si el rango es válido
  if (!rango) {
    return { clasificacion: "Edad no válida", desviacionEstandar: null };
  }

  // Asignar valores del rango
  puntPromedioRecep = rango.promedioRecep;
  desviacionStandarRecep = rango.desviacionRecep;
  puntPromedioExp = rango.promedioExp;
  desviacionStandarExp = rango.desviacionExp;

  // Función auxiliar para obtener el percentil
  const getPercentil = (value, percentiles) => {
    const percentil = percentiles.find(p => value >= p.min && value <= p.max);
    return percentil ? percentil.rango : 'no encontrado'; // Agregando mensaje de no encontrado
  };

  // Obtener percentiles
  percentilPR = getPercentil(pr, rango.percentilesPR);
  percentilPE = getPercentil(pe, rango.percentilesPE);

  // Calcular desviaciones estándar
  const desviacionPR = (pr - puntPromedioRecep) / desviacionStandarRecep;
  const desviacionPE = (pe - puntPromedioExp) / desviacionStandarExp;
    const resultado = `Puntaje Percentil PR: ${percentilPR}, Puntaje Percentil PE: ${percentilPE}, Desviacion Estandar PR: ${desviacionPR}, Desviacion Estandar PE: ${desviacionPE}`;

  return resultado;
}


/**
function calculateTEPROSIF_desviacion(data) {
  const { totalPSFDesviacion, edad } = data;

  var retorno = clasificarDesempeño(edad, totalPSFDesviacion);

  function clasificarDesempeño(edad, psf) {
    const rangos = {
      "3": { prom: 27.0, de: 15.1 },
      "4": { prom: 13.4, de: 10.0 },
      "5": { prom: 7.9, de: 6.4 },
      "6": { prom: 4.9, de: 5.1 }
    };

    let rangoEdad = "";

    if (edad >= 3 && edad < 4) {
      rangoEdad = "3";
    } else if (edad >= 4 && edad < 5) {
      rangoEdad = "4";
    } else if (edad >= 5 && edad < 6) {
      rangoEdad = "5";
    } else if (edad >= 6) {
      rangoEdad = "6";
    } else {
      return { clasificacion: "Edad no válida", desviacionEstandar: null };
    }

    const { prom, de } = rangos[rangoEdad];
    let clasificacion;

    if (psf <= prom) {
      clasificacion = "NORMAL";
    } else if (psf <= prom + de) {
      clasificacion = "Riesgo";
    } else {
      clasificacion = "Déficit";
    }

    return { clasificacion: clasificacion, desviacionEstandar: de };
  }

  return 'Clasificación: ' + retorno.clasificacion + ', Desviación Estándar: ' + retorno.desviacionEstandar;
} */

//LISTO
function calculateTEPROSIF_R(data) {
  const { totalPSF, edad } = data;
  var resultado1 = clasificarDesempeño(edad, totalPSF);   

  function clasificarDesempeño(edad, psf) {
  if (edad == 3) {
    if (psf <= 42) {
      return "NORMAL";
    } else if (psf >= 43 && psf <= 57) {
      return "Riesgo";
    } else {
      return "Déficit";
    }
  } else if (edad == 4) {
    if (psf <= 23) {
      return "NORMAL";
    } else if (psf >= 24 && psf <= 33) {
      return "Riesgo";
    } else {
      return "Déficit";
    }
  } else if (edad == 5) {
    if (psf <= 14) {
      return "NORMAL";
    } else if (psf >= 15 && psf <= 21) {
      return "Riesgo";
    } else {
      return "Déficit";
    }
  } else if (edad >= 6) {
    if (psf <= 10) {
      return "NORMAL";
    } else if (psf >= 11 && psf <= 15) {
      return "Riesgo";
    } else {
      return "Déficit";
    }
  } else {
    return "Edad no válida";
  }
}

  const resultado = `Resultado: ${resultado1}`;
  return resultado;
}

//LISTO
function calculateTECAL(data) {
  const { total, vocabulario, morfologia, sintaxis, edad } = data;

  const rangos = {
    3: {
      ttl: [{ max: 39, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 40, max: 45, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 46, max: 52, cat: 'Normal Promedio' }, { min: 53, max: 58, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 59, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      vlrio: [{ max: 18, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 19, max: 20, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 21, max: 23, cat: 'Normal Promedio' }, { min: 24, max: 26, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 27, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      mflga: [{ max: 14, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 15, max: 18, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 19, max: 23, cat: 'Normal Promedio' }, { min: 24, max: 27, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 28, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      sntxs: [{ max: 2, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 3, max: 3, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 4, max: 5, cat: 'Normal Promedio' }, { min: 6, max: 6, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 7, cat: 'Normal Mas 2 Desviaciones Estandar' }]
    },
    4: {
      ttl: [{ max: 44, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 45, max: 53, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 54, max: 62, cat: 'Normal Promedio' }, { min: 63, max: 71, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 72, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      vlrio: [{ max: 20, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 21, max: 24, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 25, max: 28, cat: 'Normal Promedio' }, { min: 29, max: 34, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 35, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      mflga: [{ max: 17, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 18, max: 22, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 23, max: 28, cat: 'Normal Promedio' }, { min: 29, max: 34, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 35, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      sntxs: [{ max: 2, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 3, max: 4, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 5, max: 5, cat: 'Normal Promedio' }, { min: 6, max: 7, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 8, cat: 'Normal Mas 2 Desviaciones Estandar' }]
    },
    5: {
      ttl: [{ max: 72, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 73, max: 78, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 79, max: 84, cat: 'Normal Promedio' }, { min: 85, max: 89, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 90, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      vlrio: [{ max: 30, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 31, max: 33, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 34, max: 35, cat: 'Normal Promedio' }, { min: 36, max: 38, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 39, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      mflga: [{ max: 31, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 32, max: 35, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 36, max: 39, cat: 'Normal Promedio' }, { min: 40, max: 42, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 43, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      sntxs: [{ max: 5, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 6, max: 7, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 8, max: 9, cat: 'Normal Promedio' }, { min: 10, max: 11, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 12, cat: 'Normal Mas 2 Desviaciones Estandar' }]
    },
    6: {
      ttl: [{ max: 79, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 80, max: 84, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 85, max: 89, cat: 'Normal Promedio' }, { min: 90, max: 94, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 95, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      vlrio: [{ max: 33, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 34, max: 35, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 36, max: 37, cat: 'Normal Promedio' }, { min: 38, max: 39, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 40, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      mflga: [{ max: 34, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 35, max: 38, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 39, max: 41, cat: 'Normal Promedio' }, { min: 42, max: 44, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 45, cat: 'Normal Mas 2 Desviaciones Estandar' }],
      sntxs: [{ max: 7, cat: 'Déficit Menos de 2 Desviaciones Estandar' }, { min: 8, max: 8, cat: 'Riesgo Menos de 1 Desviaciones Estandar' }, { min: 9, max: 9, cat: 'Normal Promedio' }, { min: 10, max: 11, cat: 'Normal Mas de 1 Desviaciones Estandar' }, { min: 12, cat: 'Normal Mas 2 Desviaciones Estandar' }]
    }
  };

  function getCategoria(valor, rangos) {
    for (let rango of rangos) {
      if ((rango.min === undefined || valor >= rango.min) && (rango.max === undefined || valor <= rango.max)) {
        return rango.cat;
      }
    }
    return 'No categorizado';
  }

  if (!rangos[edad]) {
    return 'Edad no válida';
  }

  const categorias = {
    ttl: getCategoria(total, rangos[edad].ttl),
    vlrio: getCategoria(vocabulario, rangos[edad].vlrio),
    mflga: getCategoria(morfologia, rangos[edad].mflga),
    sntxs: getCategoria(sintaxis, rangos[edad].sntxs)
  };

  return `Categoria Total: ${categorias.ttl}, Categoria Vocabulario: ${categorias.vlrio}, Categoria Morfología: ${categorias.mflga}, Categoria Sintaxis: ${categorias.sntxs}`;
}

