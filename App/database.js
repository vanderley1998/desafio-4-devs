var util = require('./util')
var firebase = require('firebase');

firebase.initializeApp({
    apiKey: "AIzaSyBcfOKflKbuH-PNWU9YvDDnxEbtWESwvJY",
    authDomain: "desafio-4-devs-558d8.firebaseapp.com",
    databaseURL: "https://desafio-4-devs-558d8.firebaseio.com",
    projectId: "desafio-4-devs-558d8",
    storageBucket: "desafio-4-devs-558d8.appspot.com",
    messagingSenderId: "635748525131"
});

var database = firebase.database();

//CLIENTES
const createCliente = function (cliente, callback, callback2) {
    cliente.id = database.ref('clientes/').push().key
    cliente.sinalizador = 'Nenhum'
    database.ref('clientes/').push(cliente, (error) => {
        if (!error) {
            callback()
        } else {
            callback2()
        }
    });
}

const setSinalizadorCliente = function (cliente, callback) {
    database.ref('clientes/').orderByChild('id').equalTo(cliente.id).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            database.ref(`clientes/${data.key}/sinalizador/`).set(cliente.sinalizador)
        });
    });
}

const deleteCliente = function (id, callback, callback2) {
    database.ref('clientes/').orderByChild('id').equalTo(id).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            database.ref(`clientes/${data.key}`).remove((error) => {
                if (!error) {
                    callback()
                } else {
                    callback2()
                }
            })
        });
    });
}

//AVALIAÇÕES
const createAvaliacao = function (avaliacao, callback, callback2) {
    database.ref('clientes/').once('value').then((snapshot) => {
        if ((snapshot.numChildren() * 0.2) < avaliacao.clientes.length) {
            avaliacao.id = database.ref('avaliacoes/').push().key
            database.ref('avaliacoes/').push(avaliacao, (error) => {
                if (!error) {
                    callback()
                }
            })
        } else {
            callback2();
        }
    })
}

const salvarAvaliacao = function (avaliacao, callback, callback2) {
    database.ref('avaliacoes/').orderByChild('id').equalTo(avaliacao.idAvaliacao).once("value", function (snapshot) {
        snapshot.forEach(function (data) {
            database.ref('avaliacoes/').orderByChild('id').equalTo(avaliacao.idAvaliacao).once("value", function () {
                database.ref(`avaliacoes/${data.key}/resultados/${avaliacao.idCliente}/`).set({
                    motivo: avaliacao.motivo,
                    nota: avaliacao.nota,
                    sinalizador: util.sinalizadorNota(avaliacao.nota)
                }, (error) => {
                    if (error) {
                        callback2()
                    }
                })
                setSinalizadorCliente({
                    id: avaliacao.idCliente,
                    sinalizador: util.sinalizadorNota(avaliacao.nota)
                })
            });
        });
        callback()
    });
}

const deleteAvaliacao = function (id, callback) {
    database.ref('avaliacoes/').orderByChild('id').equalTo(id).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
            database.ref(`avaliacoes/${data.key}`).remove()
        });
    });
    callback()
}

module.exports = { database, createCliente, deleteCliente, createAvaliacao, deleteAvaliacao, salvarAvaliacao };