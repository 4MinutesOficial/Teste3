const { ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ApplicationCommandType } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const dbPerms = new JsonDatabase({ databasePath: "./DataBaseJson/permissions.json" });

module.exports = {
  name: "say",
  description: "Faz o bot repetir uma mensagem especificada em um canal.",
  type: ApplicationCommandType.ChatInput,
  
  options: [
    {
      name: 'mensagem',
      description: 'A mensagem que o bot irá enviar (máx: 4000 caracteres).',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'canal',
      description: 'O canal onde a mensagem será enviada.',
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: false,
    }
  ],

  run: async (client, interaction) => {
    const mensagem = interaction.options.getString('mensagem');
    const canal = interaction.options.getChannel('canal') || interaction.channel;

    if (!dbPerms.has(interaction.user.id)) {
      return interaction.reply({
        content: '❌ | Você não possui permissão para usar este comando.',
        ephemeral: true
      });
    }

    if (mensagem.length > 4000) {
      return interaction.reply({
        content: '❌ | A mensagem ultrapassa o limite de 4000 caracteres.',
        ephemeral: true,
      });
    }

    await canal.send(mensagem);
    await interaction.reply({
      content: `✅ | Mensagem enviada no canal ${canal}.`,
      ephemeral: true,
    });
  },
};