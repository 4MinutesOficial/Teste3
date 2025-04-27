const path = require('path');
const fs = require('fs');

module.exports = {
    run: (client) => {
        const eventsPath = path.join(__dirname, '../Eventos'); // Corrija o caminho base para "Eventos"
        if (!fs.existsSync(eventsPath)) {
            throw new Error(`O diretório ${eventsPath} não foi encontrado.`);
        }

        const eventFolders = fs.readdirSync(eventsPath);
        for (const folder of eventFolders) {
            const folderPath = path.join(eventsPath, folder);
            const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of eventFiles) {
                const event = require(path.join(folderPath, file));
                if (!event.name || typeof event.run !== 'function') {
                    console.error(`❌ | Evento inválido em ${folder}/${file}.`);
                    continue;
                }

                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args, client));
                } else {
                    client.on(event.name, (...args) => event.run(...args, client));
                }

                console.log(`✅ | Evento registrado: ${event.name} (${folder}/${file})`);
            }
        }
    }
};