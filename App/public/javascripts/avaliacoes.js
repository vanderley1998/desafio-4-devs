const getAno = function (e) {
    e.value = new Date().getFullYear()
}

function showAlertForm(mensagem) {
    const divAlert = document.getElementById('alertForm')
    divAlert.innerHTML = `<p>${mensagem}</p>`
    divAlert.style.display = 'inline-block';
    setTimeout(() => {
        divAlert.style.display = 'none';
    }, 5000)
}

const validarForm = function (e) {
    let alert
    const mes = document.getElementById('mes')
    const ano = document.getElementById('ano')
    const clientes = document.getElementById('clientes')

    if (mes.value == '') {
        alert = 'O mês deve ser informado.';
        mes.focus()
        showAlertForm(alert)
        return false
    }
    if (ano.value == '') {
        alert = 'O ano deve ser informado.';
        ano.focus()
        showAlertForm(alert)
        return false
    }
    if (typeof clientes.value === 'string' && clientes.value == '') {
        alert = 'Selecione os clientes para criar a avaliação.';
        clientes.focus()
        showAlertForm(alert)
        return false
    }

    if (verificarAvaliacoes(mes.value + ' / ' + ano.value)) {
        alert = 'Já existe uma avaliação para o período.';
        showAlertForm(alert)
        return false
    }
    return true
}

const verificarAvaliacoes = function (valor) {
    let flag = false
    const avaliacoes = document.getElementsByClassName('periodoAvaliacao')
    for (let i = 0; i < avaliacoes.length; i++) {
        avaliacoes[i].childNodes.forEach(e => {
            if (e.title == valor) {
                flag = true
                return
            }
        })
        if (flag == true) {
            break
        }
    }
    return flag
}

const exibirDetalhes = function (valor) {
    const detalhesAva = document.getElementsByClassName(valor)[0]
    detalhesAva.style.display = (detalhesAva.style.display == 'none') ? 'table-row' : 'none'
}