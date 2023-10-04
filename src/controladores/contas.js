let { contas, senhaDoBanco } = require('../bancodedados');

// Verificando senha do banco e listando as contas
const verificarSenhaBanco = (req, res) => {
    {
        const senhaBanco = req.query.senha_banco;

        if (!senhaBanco) {
            return res.status(400).json({ mensagem: 'A senha do banco é obrigatória' });
        }

        if (senhaBanco !== senhaDoBanco) {
            return res.status(401).json({ mensagem: 'Senha do banco incorreta' });
        }

        const listaContas = Object.values(contas);

        return res.status(200).json({ contas: listaContas });
    };

}
// Cadastrar contas
const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }
    if (Object.values(contas).some(conta => conta.cpf === cpf)) {
        return res.status(409).json({ mensagem: 'CPF já cadastrado' });
    }
    if (Object.values(contas).some(conta => conta.email === email)) {
        return res.status(409).json({ mensagem: 'Email já cadastrado' });
    }

    const conta = {
        numero_conta: identificadorConta++,
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
        saldo: 0
    }

    contas.push(conta);

    return res.status(201).json(conta);
}
// Atualizar contas
const atualizarConta = (req, res) => {
    const { numero_conta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontada!' })
    }
    const contaComMesmoCPF = Object.values(contas).find(conta => conta.cpf === cpf && conta.numero_conta !== Number(numero_conta));
    if (contaComMesmoCPF) {
        return res.status(409).json({ mensagem: 'CPF já cadastrado em outra conta' });
    }

    const contaComMesmoEmail = Object.values(contas).find(conta => conta.email === email && conta.numero_conta !== Number(numero_conta));
    if (contaComMesmoEmail) {
        return res.status(409).json({ mensagem: 'E-mail já cadastrado em outra conta' });
    }

    contas[numero_conta] = {
        ...contas[numero_conta],
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };

    return res.status(203).send();
}
// Excluir Contas
const excluirConta = (req, res) => {
    const { numero_conta } = req.params;

    if (!contas[numero_conta]) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (contas[numero_conta].saldo !== 0) {
        return res.status(400).json({ mensagem: 'Saldo não é zero, não é possível excluir a conta' });
    }

    delete contas[numero_conta];

    return res.status(204).send();
};

// Verificando o Saldo
const verificarSaldo = (req, res) => {
    const numeroConta = req.query.numero_conta;
    const senha = req.query.senha;

    if (!numeroConta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
    }

    const conta = contas[numeroConta];
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (senha !== conta.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }


    return res.status(200).json({ saldo: conta.saldo });
};

// Imprimindo o Extrato
const imprimirExtrato = (req, res) => {
    const numeroConta = req.query.numero_conta;
    const senha = req.query.senha;

    if (!numeroConta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios' });
    }

    const conta = contas[numeroConta];
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (senha !== conta.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }
    const extrato = conta.transacoes;

    res.status(200).json({ extrato });
};


module.exports = {
    verificarSenhaBanco,
    cadastrarConta,
    atualizarConta,
    excluirConta,
    verificarSaldo,
    imprimirExtrato
}