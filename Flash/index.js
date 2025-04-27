const { GatewayIntentBits, Client, Collection, ChannelType } = require("discord.js");
const { AtivarIntents } = require("./Functions/StartIntents");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
    ]
});

client.setMaxListeners(20);

const estatisticasNodeInstance = require("./Functions/VariaveisEstatisticas");
const EstatisticasNode = new estatisticasNodeInstance();
module.exports = { EstatisticasNode };

AtivarIntents();

const config = require("./config.json");
const events = require('./Handler/events');
const slash = require('./Handler/slash');

slash.run(client);
events.run(client);

client.slashCommands = new Collection();

client.login(config.token);

process.on('unhandledRejection', (reason, promise) => {
    console.log(`🚫 Erro Detectado:\n\n` + reason, promise);
});
process.on('uncaughtException', (error, origin) => {
    console.log(`🚫 Erro Detectado:\n\n` + error, origin);
});

console.log(client.listenerCount('interactionCreate'));
