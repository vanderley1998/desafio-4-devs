const sinalizadorNota = function (nota) {
    if (nota >= 9) {
        return 'Promotor'
    } else if (nota >= 7) {
        return 'Neutro'
    } else if (nota >= 0) {
        return 'Detrator'
    }
}

const addDays = function (data, periodo) {
    var result = new Date(data);
    result.setMonth(result.getMonth() - periodo);
    return result;
}

module.exports = { sinalizadorNota, addDays }