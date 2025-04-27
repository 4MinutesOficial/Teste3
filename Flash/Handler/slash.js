const fs = require("fs");

module.exports = {
  run: (client) => {

    //====Handler das Slash Commands====\\
    const SlashsArray = [];
    const CommandsNames = [];

    // Função para ler diretórios e arquivos de maneira assíncrona
    const loadCommands = async () => {
      const directories = await fs.promises.readdir('././ComandosSlash/');

      for (const subpasta of directories) {
        const files = await fs.promises.readdir(`././ComandosSlash/${subpasta}/`);

        for (const file of files) {
          if (!file?.endsWith('.js')) continue;

          const command = require(`../ComandosSlash/${subpasta}/${file}`);
          if (!command?.name) continue;

          client.slashCommands.set(command.name, command);
          SlashsArray.push(command);
          CommandsNames.push(command.name);
        }
      }

      // Quando todos os comandos forem carregados, registrar para os servidores
      await client.on("ready", async () => {
        // Registra os comandos para todos os servidores em que o bot está
        for (const [guildId, guild] of client.guilds.cache) {
          try {
            await guild.commands.set(SlashsArray);
            console.log(`Comandos registrados com sucesso para o servidor: ${guild.id}`);
          } catch (error) {
            console.error(`Erro ao registrar comandos para o servidor ${guild.id}:`, error);
          }
        }

        // Exibe todos os comandos registrados
        console.log("Comandos registrados:");
        CommandsNames.forEach(command => {
          console.log(command);
        });
      });
    };

    // Carregar comandos de forma assíncrona
    loadCommands();
  }
};