const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { produtos, configuracao } = require("../DataBaseJson");

const startTime = Date.now();
const maxMemory = 100;
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
const memoryUsagePercentage = (usedMemory / maxMemory) * 100;
const roundedPercentage = Math.min(100, Math.round(memoryUsagePercentage));

async function Painel(interaction, client) {

  const embed = new EmbedBuilder()
    .setColor(configuracao.get('Cores.Principal') || '#000000')
    .setTitle(`${interaction.guild.name}`)
    .setAuthor({ 
      name: `Rust #200`, 
      iconURL: client.user.displayAvatarURL({ dynamic: true }) 
    })
    .setDescription(`**Bom dia senhor(a) ${interaction.user}, o que deseja fazer?**\nVerifique Nossa Loja [Rust #200](https://discord.gg/zSGdZ98pVS)`)
    .addFields(
      {
        name: `**Gerenciando**`,
        value: `${client.user.username}`,
        inline: true
      },
      {
        name: `**Ping**`,
        value: `\`${await client.ws.ping} MS\``,
        inline: true
      },
      {
        name: `**Uptime**`,
        value: `<t:${Math.ceil(startTime / 1000)}:R>`,
        inline: true
      }
    )
    .setFooter({
      text: `Servidor: ${interaction.guild.name}`,
      iconURL: interaction.guild.iconURL({ dynamic: true })
    })
    .setTimestamp()
    .setImage('https://media.discordapp.net/attachments/1298094442669936703/1305007992495804467/image.png?ex=673176e7&is=67302567&hm=07af3b12bb00e1a6e517d864d88d378e09e43ec51b0bca3806c4faff80a13637&=&format=webp&quality=lossless&width=550&height=209');

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("painelconfigvendas")
        .setLabel('Sistema De Vendas')
        .setEmoji(`1268393568930627735`)
        .setStyle(2),

      new ButtonBuilder()
        .setCustomId("painelpersonalizar")
        .setLabel('Personalizar Bot')
        .setEmoji(`1295101398412824639`)
        .setStyle(2),

      new ButtonBuilder()
        .setCustomId("rendimento")
        .setLabel('Rendimento')
        .setEmoji(`1285244840220823553`)
        .setStyle(3),

      new ButtonBuilder()
        .setCustomId("gerenciarconfigs")
        .setLabel('Definições')
        .setEmoji(`1264399876070965348`)
        .setStyle(4)
    );

  if (interaction.message == undefined) {

    interaction.reply({
      content: ``,
      components: [row],
      embeds: [embed],
      ephemeral: true
    });

  } else {

    interaction.update({
      content: ``,
      components: [row],
      embeds: [embed],
      ephemeral: true
    });

  }
}

async function Gerenciar2(interaction, client) {

  const ggg = produtos.valueArray();

  const embed = new EmbedBuilder()
    .setColor(configuracao.get('Cores.Principal') || '#000000')
    .setTitle(`Painel de Administração`)
    .setDescription(`Senhor(a) **${interaction.user.username}**, escolha o que deseja fazer.`)
    .addFields(
      {
        name: `**Total de produtos fornecidos**`,
        value: `${ggg.length}`,
        inline: true
      }
    )
    .setFooter({
      text: interaction.guild.name,
      iconURL: interaction.guild.iconURL({ dynamic: true })
    })
    .setTimestamp()
    .setImage('https://media.discordapp.net/attachments/1298094442669936703/1305007992495804467/image.png?ex=673176e7&is=67302567&hm=07af3b12bb00e1a6e517d864d88d378e09e43ec51b0bca3806c4faff80a13637&=&format=webp&quality=lossless&width=550&height=209');

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("criarrrr")
        .setLabel('Criar')
        .setEmoji(`1294777868697604201`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarotemae")
        .setLabel('Gerenciar')
        .setEmoji(`1266575364621336680`)
        .setStyle(1),

      new ButtonBuilder()
        .setCustomId("gerenciarposicao")
        .setLabel('Posições')
        .setEmoji(`1251603476799033395`)
        .setStyle(1)
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("voltar00")
        .setLabel('Voltar')
        .setEmoji(`1266575081144979538`)
        .setStyle(2)
    );

  await interaction.update({
    embeds: [embed],
    components: [row2, row3],
    content: ``
  });
}

module.exports = {
  Painel,
  Gerenciar2
};
