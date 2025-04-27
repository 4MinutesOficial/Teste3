const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandType, ComponentType } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/permissions.json" });

module.exports = {
  name: "lock",
  description: "[🔒/🔓] Bloqueia e desbloqueia o canal com interações.",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: [PermissionFlagsBits.ManageChannels], // Correção aqui

  run: async (client, interaction) => {
    const channel = interaction.channel;

        if (!dbPerms.has(interaction.user.id)) {

            return interaction.reply({ 

                content: '❌ | Você não possui permissão para usar esse comando.', 

                ephemeral: true 

            });

        }

        const criarPainel = (bloqueado) => {

            const embedPainel = new EmbedBuilder()

                .setTitle('Painel de Controle')

                .setDescription(`Canal está sendo controlado por: ${interaction.user.username}`)

                .setColor(bloqueado ? 'Red' : 'Blue');

            const botao = new ButtonBuilder()

                .setCustomId(bloqueado ? 'botao_desbloquear' : 'botao_bloquear')

                .setLabel(bloqueado ? 'Liberar' : 'Travar')

                .setEmoji(bloqueado ? '1329679779762405467' : '1329675031772528640')

                .setStyle(bloqueado ? ButtonStyle.Success : ButtonStyle.Danger);

            const row = new ActionRowBuilder().addComponents(botao);

            return { embedPainel, row };

        };

        const atualizarPainel = async (mensagem, bloqueado) => {

            const { embedPainel, row } = criarPainel(bloqueado);

            await mensagem.edit({ embeds: [embedPainel], components: [row] });

        };

        await interaction.reply({ embeds: [new EmbedBuilder().setDescription("Bloqueando Canal...").setColor('Red')], ephemeral: true });

        try {

            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

            await interaction.followUp({ embeds: [new EmbedBuilder().setDescription("Canal Bloqueado com Sucesso!").setColor('Red')], ephemeral: true });

            const { embedPainel, row } = criarPainel(true);

            const mensagem = await interaction.followUp({ embeds: [embedPainel], components: [row] });

            const collector = mensagem.createMessageComponentCollector({ componentType: ComponentType.Button });

            collector.on('collect', async (buttonInteraction) => {

                if (buttonInteraction.user.id !== interaction.user.id) {

                    return buttonInteraction.reply({ content: 'Você não tem permissão para interagir com este botão.', ephemeral: true });

                }

                if (buttonInteraction.customId === 'botao_desbloquear') {

                    await buttonInteraction.reply({ embeds: [new EmbedBuilder().setDescription("Desbloqueando Canal...").setColor('Yellow')], ephemeral: true });

                    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });

                    await buttonInteraction.followUp({ embeds: [new EmbedBuilder().setDescription("Canal Desbloqueado com Sucesso!").setColor('Green')], ephemeral: true});

                    await atualizarPainel(mensagem, false);

                } else if (buttonInteraction.customId === 'botao_bloquear') {

                    await buttonInteraction.reply({ embeds: [new EmbedBuilder().setDescription("Bloqueando Canal...").setColor('Red')], ephemeral: true });

                    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

                    await buttonInteraction.followUp({ embeds: [new EmbedBuilder().setDescription("Canal Bloqueado com Sucesso!").setColor('Red')], ephemeral: true});

                    await atualizarPainel(mensagem, true);

                }

            });

            collector.on('end', async (collected, reason) => {

                if (reason === 'time') {

                    await mensagem.edit({ content: 'O painel expirou.', components: [] });

                }

            });

        } catch (error) {

            console.error("Erro ao bloquear o canal:", error);

            await interaction.followUp({ content: 'Ocorreu um erro ao tentar bloquear o canal. Verifique se o bot tem permissões adequadas.', ephemeral: true });

        }

    }

};