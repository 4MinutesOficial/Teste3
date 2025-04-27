const Discord = require("discord.js");
const { JsonDatabase } = require("wio.db");
const dbcv = new JsonDatabase({ databasePath: "./config.json" });
const perms = new JsonDatabase({ databasePath: "./DataBaseJson/permissions.json" });

module.exports = {
    name: "perms",
    description: "De permissões via painel",
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction, message, args) => {

        if (interaction.user.id !== dbcv.get(`owner`)) return interaction.reply({ content: `<:emoji_nome:1275914097292087441> | Apenas o dono do bot pode usar isso!`, ephemeral: true });
        

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('adicionar')
                .setLabel('Adicionar')
                .setStyle(3)
                .setEmoji('1285374627878539345'), // Adiciona um emoji unicode
        )
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('remover')
                .setLabel('Remover')
                .setStyle(4)
                .setEmoji('1275914097292087441'), // Adiciona um emoji unicode
        );    

        const embed = await interaction.reply({
            embeds: [new Discord.EmbedBuilder()
                .setTitle(`Configuração das permissões`)
                .setDescription(`**Adicione e remova permissões usando este comando.**`)
                .setColor('Aqua')
                .setFooter({ text: `Adicione e remova perms.` })
            ],
            components: [row]
        });

        const interação = embed.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 120000 
        });

        interação.on("collect", async (interaction) => {
            if (interaction.user.id != interaction.user.id) {
                return;
            }

            if (interaction.customId === "adicionar") {
                interaction.deferUpdate();
                interaction.channel.send(`Qual é o id do usuário que você quer dar permissão?`).then(msg => {
                    const filter = m => m.author.id === interaction.user.id;
                    const collector = msg.channel.createMessageCollector({ filter, max: 1, time: 120000 }); // Definindo o tempo limite para 2 minutos (120000 milissegundos)
                    collector.on("collect", message => {
                        message.delete();
                        const user = message.content;
                        perms.set(`${user}`, user);
                        msg.edit(`Permissão adicionada para o usuário!`).then((editedMessage) => {
                            setTimeout(() => {
                                editedMessage.delete().catch(console.error);
                            }, 2500);
                        });

                        const embednew = new Discord.EmbedBuilder()
                            .setTitle(`Configuração das permissões`)
                            .setDescription(`** Adicione e remova permissões usando este comando.**`)
                            .setColor('Aqua')
                            .setFooter({ text: `Adicione e remova perms.` });
                        embed.edit({ embeds: [embednew] });
                    });
                });
            }
            if (interaction.customId === "remover") {
                interaction.deferUpdate();
                interaction.channel.send(`Qual é o id do usuário que você quer tirar permissão?`).then(msg => {
                    const filter = m => m.author.id === interaction.user.id;
                    const collector = msg.channel.createMessageCollector({ filter, max: 1, time: 120000 }); // Definindo o tempo limite para 2 minutos (120000 milissegundos)
                    collector.on("collect", message => {
                        message.delete();
                        const user = message.content;
                        perms.delete(`${user}`);
                        msg.edit(`Permissão removida do usuário!`).then((editedMessage) => {
                            setTimeout(() => {
                                editedMessage.delete().catch(console.error);
                            }, 2500);
                        });

                        const embednew = new Discord.EmbedBuilder()
                            .setTitle(`Configuração das permissões`)
                            .setDescription(`**Adicione e remova permissões usando este comando.**`)
                            .setColor('Aqua')
                            .setFooter({ text: `Adicione e remova perms.` });
                        embed.edit({ embeds: [embednew] });
                    });
                });
            }
        });
    }
};
