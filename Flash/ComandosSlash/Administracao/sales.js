const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/permissions.json" });

module.exports = {
  name: "vendas",
  description: "Use para ver suas vendas esse mês",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {

    if (!dbPerms.has(interaction.user.id)) { 
      
      await interaction.reply({ 
        
      ephemeral: true, 
      content: `❌ | Você não possui permissão para usar esse comando.`
    });
    return;
};
    await interaction.reply({ content: `🔄 Aguarde...`, ephemeral: true })

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("todayyyy")
          .setLabel('Hoje')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("7daysss")
          .setLabel('Últimos 7 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("30dayss")
          .setLabel('Últimos 30 dias')
          .setStyle(2)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("totalrendimento")
          .setLabel('Rendimento Total')
          .setStyle(3)
          .setDisabled(false),
      )

    interaction.editReply({ content: `Olá senhor **${interaction.user.username}**, selecione algum filtro.`, components: [row], ephemeral: true })
  }
}
