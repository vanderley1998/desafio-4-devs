function excluirRegistro(id) {
    if (confirm('Deseja excluir o registro?')) {
        $.ajax({
            url: '/clientes/'.concat(id),
            type: 'DELETE',
            success: function (res) {
                window.location.reload();
                return false;
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
                alert("Falha ao excluir cliente");
                return false;
            }
        });
    }
}

function showAlertForm(mensagem){
    const divAlert = document.getElementById('alertForm')
    divAlert.innerHTML = `<p>${mensagem}</p>`
    divAlert.style.display = 'inline-block';
    setTimeout(() => {
        divAlert.style.display = 'none';
    }, 5000)
}

function validarForm(e) {
    let alert = ''
    const nomeCliente = document.getElementById('nomeCliente')
    const nomeContato = document.getElementById('nomeContato')
    const membroDesde = document.getElementById('membroDesde')
    if (nomeCliente.value.trim() == '') {
        nomeCliente.focus()
        alert = 'O nome do cliente não pode estar vazio!'
        showAlertForm(alert)
        return false;
    }
    if (nomeContato.value.trim() == '') {
        alert = 'O nome do contato não pode estar vazio!'
        nomeContato.focus()
        showAlertForm(alert)
        return false;
    }
    if (membroDesde.value.trim() == '') {
        alert = 'O campo "Membro desde:" deve ser informado!'
        membroDesde.focus()
        showAlertForm(alert)
        return false;
    }
    return true
}