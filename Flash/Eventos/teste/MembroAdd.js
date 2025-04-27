const { EmbedBuilder } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./DataBaseJson/configEntrada.json" });

module.exports = {
  name: "guildMemberAdd",
  run: async (member, client) => {
    try {
      const isEnabled = db.get("enabled");
      if (!isEnabled) return;

      const channelId = db.get("channelId");
      if (!channelId) {
        console.error("❌ Canal de boas-vindas não configurado no banco de dados.");
        return;
      }

      const channel = member.guild.channels.cache.get(channelId);
      if (!channel) {
        console.error("❌ Canal de boas-vindas não encontrado.");
        return;
      }

      let desc = db.get("description");
      desc = desc
        .replace("{user}", `${member}`)
        .replace("{username}", `${member.user.username}`)
        .replace("{userid}", `${member.user.id}`)
        .replace("{guildid}", `${member.guild.id}`)
        .replace("{guildname}", `${member.guild.name}`)
        .replace("{membros}", `${member.guild.memberCount}`);

      // Cria a embed
      const embed = new EmbedBuilder()
        .setTitle(db.get("title") || "Bem-vindo!")
        .setDescription(desc)
        .setColor(db.get("color") || "#FFFFFF")
        .setFooter({
          text: db.get("footer") || "",
          iconURL: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
        })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }));

      const imageUrl = db.get("image");
      if (imageUrl) {
        embed.setImage(imageUrl);
      }

      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("❌ Erro no evento guildMemberAdd:", error);
    }
  },
};