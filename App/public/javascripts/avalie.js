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
    const nota = document.getElementById('nota')
    const motivo = document.getElementById('motivo')

    if (nota.value == '') {
        alert = 'Informe uma nota de 0 a 10.';
        nota.focus()
        showAlertForm(alert)
        return false
    }
    if (motivo.value == '') {
        alert = 'Informe o motivo. É importante que saibamos o porque da sua nota.';
        motivo.focus()
        showAlertForm(alert)
        return false
    }
    return true
}