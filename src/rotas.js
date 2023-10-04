const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/transacoes');


const rotas = express();

rotas.get('/contas', contas.verificarSenhaBanco);
rotas.post('/contas', contas.cadastrarConta);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarConta);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.post('/transacoes/depositar', transacoes.depositar);
rotas.post('/transacoes/sacar', transacoes.sacar);
rotas.post('/transacoes/transferir', transacoes.transferir);
rotas.get('/contas/saldo', contas.verificarSaldo);
rotas.get('/contas/extrato', contas.imprimirExtrato);

module.exports = rotas;