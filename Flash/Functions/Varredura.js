const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { configuracao, estatisticas, } = require('../DataBaseJson');
const axios = require('axios');
const { JsonDatabase } = require('wio.db');


async function Varredura(client) {

    if (configuracao.get('ConfigChannels.systemlogs') == null) return;
    if (configuracao.get('pagamentos.MpAPI') == null) return;

    const embed3 = new EmbedBuilder()
        .setColor('#1c44ff')
        .setTitle(`🤖 BOT REINICIADO COM SUCESSO`)
        .setDescription(`O seu bot ${client.user.username} foi reiniciado com sucesso e está agora funcionando novamente. Por favor, continue suas operações normalmente..`)
        .setFooter({ iconURL: `https://media.discordapp.net/attachments/1304261499979825255/1304261539838033970/central_de_comando.png?ex=672ebfb7&is=672d6e37&hm=b11d2457b7de5ca27c8a9b1b497da5accb564589da21335d92ab10abf498946f&=&format=webp&quality=lossless`, text: `Sistema restabelecido - Paradise Bots.` })
        .setTimestamp();

    const row222 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('asSs')
                .setLabel('Mensagem do Sistema')
                .setStyle(2)
                .setDisabled(true)
        );

    const channel = await client.channels.fetch(configuracao.get('ConfigChannels.systemlogs'));
    await channel.send({ components: [row222], embeds: [embed3] });

    const refundResponse = await axios.get('https://api.mercadopago.com/v1/payments/search', {
        params: {
            'access_token': `${configuracao.get('pagamentos.MpAPI')}`,
            'status': 'refunded'
        }
    });

    const dd = refundResponse.data.results;


    const refounds = new JsonDatabase({
        databasePath: "./DataBaseJson/refounds.json"
    });


    for (const element of dd) {
        const isRefunded = await refounds.get(`${element.id}`);

        if (!isRefunded) {
            await refounds.set(`${element.id}`, `Reembolsado`);

            let id = await element.external_reference
            if (element.external_reference == null) {
                id = 'Não encontrado'
            }

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(`🚨 Reembolso Detectado`)
                .setDescription(`Um reembolso foi detectado no sistema de pagamentos.`)
                .addFields(
                    { name: `**ID do pagamento**`, value: `\`${element.id}\``, inline: true },
                    { name: `**ID do usuário**`, value: `\`${id}\``, inline: true },
                    { name: `**Valor**`, value: `\`${element.transaction_amount}\``, inline: true },
                    { name: `**Data**`, value: `<t:${Math.ceil(Date.now() / 1000)}:R>`, inline: true },
                    { name: `**Status**`, value: `\`${element.status}\``, inline: true },
                    { name: `**Tipo de pagamento**`, value: `\`${element.payment_type_id}\``, inline: true },
                    { name: `**Tipo de operação**`, value: `\`${element.operation_type}\``, inline: true },
                );

            try {
                await channel.send({ components: [row222], embeds: [embed] });
            } catch (error) {
                console.error('Erro ao enviar a mensagem:', error);
            }

            const estatisticasData = estatisticas.fetchAll();
            for (const element2 of estatisticasData) {
                if (element2.data.idpagamento === element.id) {
                    estatisticas.delete(element2.ID);
                }
            }
        }
    }
}



module.exports = {
    Varredura
};
