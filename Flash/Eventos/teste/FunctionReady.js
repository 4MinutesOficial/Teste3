const { carregarCache } = require('../../Handler/EmojiFunctions');
const { ActivityType } = require('discord.js');
const { CloseThreds } = require('../../Functions/CloseThread');
const { VerificarPagamento } = require('../../Functions/VerficarPagamento');
const { EntregarPagamentos } = require('../../Functions/AprovarPagamento');
const { CheckPosition } = require('../../Functions/PosicoesFunction.js');
const { configuracao } = require('../../DataBaseJson');
const { Varredura } = require('../../Functions/Varredura.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'ready',

    run: async (client) => {
        const configuracoes = ['Status1', 'Status2'];
        let indiceAtual = 0;

        function setActivityWithInterval(client, configuracoes, type, interval) {
            setInterval(() => {
                const configuracaoKey = configuracoes[indiceAtual];
                const status = configuracao.get(configuracaoKey);
                if (status !== null) {
                    client.user.setActivity(status, { type });
                }
                indiceAtual = (indiceAtual + 1) % configuracoes.length;
            }, interval);
        }

        setActivityWithInterval(client, configuracoes, ActivityType.Playing, 5000);

        const verifyPayments = () => VerificarPagamento(client);
        const deliverPayments = () => EntregarPagamentos(client);
        const closeThreads = () => CloseThreds(client);

        Varredura(client);

        setInterval(verifyPayments, 10000);
        setInterval(deliverPayments, 14000);
        setInterval(closeThreads, 60000);

        const description = "Impulsione suas Vendas!";

        const endpoint = `https://discord.com/api/v9/applications/${client.user.id}`;
        const headers = {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        };

        await fetch(endpoint, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ description })
        }).catch(() => null);

        console.log(`${client.user.tag} Foi iniciado \n - Atualmente ${client.guilds.cache.size} servidores!\n - Tendo acesso a ${client.channels.cache.size} canais!\n - Contendo ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuários!`);

        CheckPosition(client);
        carregarCache();
    }
};
