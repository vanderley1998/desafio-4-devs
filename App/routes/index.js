var express = require('express');
var database = require('../database')

var router = express.Router();

//ROTA PRINCIPAL
router.get('/', function (req, res) {
  database.database.ref('clientes').once('value')
    .then((snapshot) => {
      database.database.ref('avaliacoes').once('value')
        .then((snapshot2) => {
          res.render('avaliacoes/avaliacoes', { title: 'Sistema de avaliações', clientes: snapshot.val(), avaliacoes: snapshot2.val() })
        })
    })
});

//ROTAS DAS AVALIAÇÕES
router.get('/avaliacao/:idAvaliacao/cliente/:idCliente', function (req, res) {
  flagCliente = false
  flagAvaliacao = false
  database.database.ref('avaliacoes/').orderByChild('id').equalTo(req.params.idAvaliacao).on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      if (data.val().id == req.params.idAvaliacao) {
        flagAvaliacao = true
        data.val().clientes.forEach(function (clientes) {
          if (clientes == req.params.idCliente) {
            flagCliente = true
            database.database.ref('clientes/').orderByChild('id').equalTo(req.params.idCliente).on("value", function (snapshot2) {
              snapshot2.forEach(function (data2) {
                res.render('avalie/avalie', { avaliacao: { id: data.val().id, cliente: data2.val() } })
              })
            })
          }
        })
        if (!flagCliente) {
          res.render('error', { message: "Cliente não encontrado para esta avaliação", error: { status: "", stack: `Código informado: ${req.params.idCliente}` } })
        }
      }
    });
    if (!flagAvaliacao) {
      res.render('error', { message: "Avaliação não encontrada", error: { status: "", stack: `Código informado: ${req.params.idAvaliacao}` } })
    }
  });
});

router.post('/avaliacao/:idAvaliacao/cliente/:idCliente/confirmar', function (req, res) {
  avaliacao = {
    idAvaliacao: req.params.idAvaliacao,
    idCliente: req.params.idCliente,
    nota: req.body.nota,
    motivo: req.body.motivo
  }
  database.salvarAvaliacao(avaliacao, () => {
    res.render('avalie/confirmacao')
  }, () => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write('<script>alert("Houve um problema ao salvar sua avaliação. Tente novamente.");history.go(-1)</script>')
    res.end()
  })
})

router.post('/avaliacoes/nova', function (req, res) {
  clientesArray = []
  if (typeof req.body.clientes === 'string') {
    clientesArray.push(req.body.clientes)
  } else {
    clientesArray.push(...req.body.clientes)
  }
  avaliacao = {
    mes: req.body.mes,
    ano: req.body.ano,
    clientes: clientesArray
  }
  database.createAvaliacao(avaliacao, function () {
    res.write('<script>window.location.href = "/"</script>')
    res.end()
  }, function () {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write('<script>alert("Para criar uma avaliação, devem ter pelo menos, 20% dos clientes cadastrados.");window.location.href = "/"</script>')
    res.end()
  })
})

router.get('/avaliacoes/delete/:id', function (req, res) {
  database.deleteAvaliacao(req.params.id, function () {
    res.write('<script>window.location.href = "/"</script>')
    res.end()
  })
})

router.get('/avaliacoes/:idAvaliacao/detalhes/', function (req, res) {
  database.database.ref('avaliacoes/').orderByChild('id').equalTo(req.params.idAvaliacao).on("value", function (snapshot) {
    snapshot.forEach(function (data) {
      database.database.ref(`avaliacoes/${data.key}/resultados`).once('value').then((snapshot2) => {
        res.render('avaliacoes/detalhes/detalhes', { title: 'Sistema de avaliações - Detalhes da avaliação', avaliacao: data.val() })
      })
    });
  });
})

//ROTAS DO CLIENTE
router.get('/clientes', function (req, res) {
  database.database.ref('clientes').once('value')
    .then((snapshot) => {
      res.render('clientes/clientes', { title: 'Sistema de avaliações - Clientes', clientes: snapshot.val() })
    })
});

router.post('/clientes/novo', function (req, res) {
  cliente = {
    nomeCliente: req.body.nomeCliente,
    nomeContato: req.body.nomeContato,
    membroDesde: req.body.membroDesde
  }
  database.createCliente(cliente, () => {
    res.write('<script>window.location.href = "/clientes"</script>')
    res.end()
  }, () => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write('<script>alert("Não foi possível cadastrar o cliente.");window.location.href = "/clientes"</script>')
    res.end()
  })
})

router.get('/clientes/delete/:id', function (req, res) {
  database.deleteCliente(req.params.id, () => {
    res.write('<script>window.location.href = "/clientes"</script>')
    res.end()
  }, () => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.write('<script>alert("Não foi possível excluir o cliente.");window.location.href = "/clientes"</script>')
    res.end()
  })
})

module.exports = router;
