let { contas } = require('../bancodedados');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'Número da conta e valor do depósito são obrigatórios' });
    }

    const conta = contas[numero_conta];
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do depósito deve ser positivo' });
    }

    conta.saldo += valor;

    const transacao = { tipo: 'Depósito', valor };
    if (!conta.transacoes) {
        conta.transacoes = [];
    }
    conta.transacoes.push(transacao);

    res.status(200).json({ mensagem: 'Depósito realizado com sucesso' });
};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta, valor do saque e senha são obrigatórios' });
    }

    if (!contas[numero_conta]) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (senha !== contas[numero_conta].senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta para a conta informada' });
    }

    if (valor > contas[numero_conta].saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente para o saque' });
    }

    contas[numero_conta].saldo -= valor;

    return res.status(204).end();
}


const transferir = (req, res) => {

    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !senha || !valor) {
        return res.status(400).json({ mensagem: 'Número da conta de origem, número da conta de destino, senha e valor da transferência são obrigatórios' });
    }
    if (!contas[numero_conta_origem]) {
        return res.status(404).json({ mensagem: 'Conta bancária de origem não encontrada' });
    }

    if (!contas[numero_conta_destino]) {
        return res.status(404).json({ mensagem: 'Conta bancária de destino não encontrada' });
    }

    if (senha !== contas[numero_conta_origem].senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta para a conta de origem' });
    }
    if (valor > contas[numero_conta_origem].saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente na conta de origem para a transferência' });
    }

    contas[numero_conta_origem].saldo -= valor;
    contas[numero_conta_destino].saldo += valor;

    return res.status(204).end();
};



module.exports = {
    depositar,
    sacar,
    transferir
}