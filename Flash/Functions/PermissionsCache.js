
async function getPermissions(userId) {

    const config = {
        method: 'GET',
        headers: {
            'token': 'ac3add76c5a3c9fd6952a#'
        }
    };

    try {
        const response = await fetch(`http://apivendas.squareweb.app/api/v1/permissions/${userId}`, config);
        const info = await response.json();

        // Verifique se há um erro na resposta da API
        if (info.Error === "Nenhum BOT encontrado nesse ID!") {
            return null;
        }

        const permissions = info.users;

        return permissions;
    } catch (error) {
        console.error('Erro ao obter permissões da API', error);
        return null;
    }
}

module.exports = {
    getPermissions
};