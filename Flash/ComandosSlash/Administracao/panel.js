const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));
const { Painel } = require("../../Functions/Painel");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/permissions.json" });

module.exports = {
  name: "panel1",
  description: "Use para configurar minhas funções",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
    if (!dbPerms.has(interaction.user.id)) { 
      
      await interaction.reply({ 
        ephemeral: true, 
        content: `❌ | Você não possui permissão para usar esse comando.`
      });
      return;
  };
    Painel(interaction, client)
  }
}
