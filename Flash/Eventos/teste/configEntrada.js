const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase({ databasePath: "./DataBaseJson/configEntrada.json" });

module.exports = {
    name: "interactionCreate",
    run: async (interaction) => {
        if (interaction.isButton() && interaction.customId === "painelconfigBoas") {
            const isEnabled = db.get("enabled") || false;

            const createEmbed = () =>
                new EmbedBuilder()
                    .setColor("#2f3136")
                    .setTitle("⚙️ Configurar Embed")
                    .setDescription(`📌 Clique nos botões abaixo para configurar cada parte da embed.\n\n**Sistema:** ${isEnabled ? "🟢 Ativado" : "🔴 Desativado"}`);

            const createButtons = () =>
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("toggleSystem")
                        .setLabel(isEnabled ? "🔴 Desligar Sistema" : "🟢 Ligar Sistema")
                        .setStyle(isEnabled ? ButtonStyle.Danger : ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("setTitle")
                        .setLabel("✏️ Título")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("setDescription")
                        .setLabel("📝 Descrição")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("setFooter")
                        .setLabel("📄 Rodapé")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("setColor")
                        .setLabel("🎨 Cor")
                        .setStyle(ButtonStyle.Success)
                );

            const createSecondaryButtons = () =>
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("setChannel")
                        .setLabel("🛠️ ID do Canal")
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({
                embeds: [createEmbed()],
                components: [createButtons(), createSecondaryButtons()],
                ephemeral: true,
            });

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: 60000,
            });

            collector.on("collect", async (buttonInteraction) => {
                if (buttonInteraction.user.id !== interaction.user.id) {
                    return buttonInteraction.reply({
                        content: "❌ Você não pode interagir com este menu.",
                        ephemeral: true,
                    });
                }

                const updateConfig = async (key, prompt) => {
                    await buttonInteraction.reply({ content: prompt, ephemeral: true });

                    const filter = (msg) => msg.author.id === interaction.user.id;
                    const response = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000 });

                    const reply = response.first();
                    if (!reply) {
                        return buttonInteraction.followUp({
                            content: "❌ Tempo esgotado para resposta.",
                            ephemeral: true,
                        });
                    }

                    db.set(key, reply.content);
                    reply.delete();
                    buttonInteraction.followUp({
                        content: `✅ Configuração salva para **${key}**.`,
                        ephemeral: true,
                    });
                };

                switch (buttonInteraction.customId) {
                    case "toggleSystem":
                        const currentStatus = db.get("enabled") || false;
                        db.set("enabled", !currentStatus);
                        await buttonInteraction.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("#2f3136")
                                    .setTitle("⚙️ Configurar Embed")
                                    .setDescription(
                                        `📌 Clique nos botões abaixo para configurar cada parte da embed.\n\n**Sistema:** ${!currentStatus ? "🟢 Ativado" : "🔴 Desativado"}`
                                    ),
                            ],
                            components: [createButtons(), createSecondaryButtons()],
                        });
                        break;
                    case "setTitle":
                        await updateConfig("title", "✏️ Digite o título (suporte a emojis):");
                        break;
                    case "setDescription":
                        await updateConfig("description", "📝 Digite a descrição (suporte a emojis):");
                        break;
                    case "setFooter":
                        await updateConfig("footer", "📄 Digite o rodapé (suporte a emojis):");
                        break;
                    case "setColor":
                        await updateConfig("color", "🎨 Digite a cor em formato hexadecimal (Ex: #FF0000):");
                        break;
                    case "setChannel":
                        await updateConfig("channelId", "🛠️ Digite o ID do canal:");
                        break;
                    default:
                        buttonInteraction.reply({ content: "❌ Ação inválida!", ephemeral: true });
                }
            });

            collector.on("end", (_, reason) => {
    if (reason === "time") {
        // Enviar uma mensagem fora do painel ao invés de editar a original
        interaction.followUp({
            content: "⏰ O tempo para interagir com o painel expirou.",
            ephemeral: true, // Mensagem será visível apenas para o usuário que interagiu
        });
    }
});
        }
    },
};