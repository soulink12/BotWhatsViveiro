const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { WebhookClient } = require('dialogflow-fulfillment');


admin.initializeApp();


exports.funcaoTerrenoProMudasTesteDialogFlow = functions.runWith({timeoutSeconds: 300}).region("southamerica-east1").https.onRequest((request, response) => {
    var intentName = request.body.queryResult.intent.displayName;
    const agent = new WebhookClient({ request: request, response: response });


    //Outras funções
    function removeCharacter(str, char) {
        var n = str.indexOf(char);
        var part1 = str.substring(0, n);
        var part2 = str.substring(n + 1, str.length);
        return part1 + part2;
    }

    function getContactNumber() {
        var sessao = request.body.queryResult.outputContexts[0].name;
        var contato_aux = sessao.split("/");
        var contato = contato_aux[4];
        contato = removeCharacter(contato, "+");
        contato = removeCharacter(contato, "-");
        return contato;
    }

    function getContactName() {
        var sessao = request.body.queryResult.outputContexts[0].name;
        var contato_aux = sessao.split("/");
        var contato = contato_aux[4];
        //contato = contato.split("_");
        //var nome = contato[0];
        return contato;
    }

    function limparNomeContatoAntigo() {
        var nome_aux = getContactName();
        var nome;
        var nome_aux2;
        var stringArray = [
            "L0",
            "L1",
            "L2",
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
            "L8",
            "L9"
        ];
        for (var i = 0; i < stringArray.length; i++) {
            if (nome_aux.includes(stringArray[i])) {
                nome_aux2 = nome_aux.split("_");
                nome = nome_aux2[1];
                break;
            } else {
                nome_aux2 = nome_aux.split("_");
                nome = nome_aux2[0];
            }
        }
        return nome;
    }

    //funções das intents
    function BoasVindas(agent) {
        var contato = getContactNumber();
        setTimeout(() => {response.json({ followupEventInput: { name: "finalizar_conversa" } })}, 4000);

        //se for um número
        if (!isNaN(contato)) {
            response.json({ followupEventInput: { name: "contato_novo" } });

            //se for nome
        } else if (isNaN(contato)) {
            var nome = limparNomeContatoAntigo();

            response.json({
                followupEventInput: { name: "contato_antigo" },
                outputContexts: [
                    {
                        name: request.body.session + "/contexts/esperando_nome",
                        lifespanCount: 1,
                        parameters: {
                            Nome: nome
                        }
                    }
                ]
            });
        }
    }

    function Cadastro_antigo(agent) {
        var contato = getContactNumber();
        if (isNaN(contato)) {
            var nome = limparNomeContatoAntigo();
            response.json({
                followupEventInput: { name: "cadastro_contato_antigo" },
                outputContexts: [
                    {
                        name: request.body.session + "/contexts/esperando_nome",
                        lifespanCount: 1,
                        parameters: {
                            Nome: nome
                        }
                    }
                ]
            });
        }
    }

    function Cadastro_novo(agent) {
        var contato = getContactNumber();

        var Nome =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "Nome.original"
            ];
        var Sobrenome =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "Nome2.original"
            ];
        var Cidade =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "cidade.original"
            ];
        return admin.database().ref('CADASTRO/' + Nome + "_" + Sobrenome + "_" + Cidade).set({
            Nome: Nome,
            Sobrenome: Sobrenome,
            Numero: contato,
            Cidade: Cidade
        });
    }

    function continuar_atendimento(agent){
        var resposta = agent.request_.body.queryResult['queryText'];
        var contato = getContactNumber();

        //se for contato novo
        if (!isNaN(contato)) {
            return admin.database().ref('Duvida/' + contato).set({
            Numero: contato,
            Duvida: resposta
        });
        

            //se for contato antigo
        } else {
            var nome = getContactName();
            return admin.database().ref('Duvida/' + nome).set({
                Nome: nome,
                Duvida: resposta
            });
        }
    }



    function finalizar_conversa(agent){
        setTimeout(() => {response.json({ followupEventInput: { name: "finalizar_conversa" } });}, 10000)

    }

    function teste2(agent) {
        return response.json({ fulfillmentText: "teste4 " });
    }

    let intentMap = new Map(); //Intent
    intentMap.set("teste", teste2);
    intentMap.set("BoasVindas", BoasVindas);
    intentMap.set("continuar_atendimento", continuar_atendimento);
    intentMap.set("Menu_principal_1_novas_mudas", Cadastro_antigo);
    intentMap.set("Menu_principal_1_novas_mudas_cidade", Cadastro_novo);
    agent.handleRequest(intentMap);
});

exports.funcaoTerrenoProMudasDialogFlow = functions.runWith({timeoutSeconds: 300}).region("southamerica-east1").https.onRequest((request, response) => {
    var intentName = request.body.queryResult.intent.displayName;
    const agent = new WebhookClient({ request: request, response: response });


    //Outras funções
    function removeCharacter(str, char) {
        var n = str.indexOf(char);
        var part1 = str.substring(0, n);
        var part2 = str.substring(n + 1, str.length);
        return part1 + part2;
    }

    function getContactNumber() {
        var sessao = request.body.queryResult.outputContexts[0].name;
        var contato_aux = sessao.split("/");
        var contato = contato_aux[4];
        contato = removeCharacter(contato, "+");
        contato = removeCharacter(contato, "-");
        return contato;
    }

    function getContactName() {
        var sessao = request.body.queryResult.outputContexts[0].name;
        var contato_aux = sessao.split("/");
        var contato = contato_aux[4];
        //contato = contato.split("_");
        //var nome = contato[0];
        return contato;
    }

    function limparNomeContatoAntigo() {
        var nome_aux = getContactName();
        var nome;
        var nome_aux2;
        var stringArray = [
            "L0",
            "L1",
            "L2",
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
            "L8",
            "L9"
        ];
        for (var i = 0; i < stringArray.length; i++) {
            if (nome_aux.includes(stringArray[i])) {
                nome_aux2 = nome_aux.split("_");
                nome = nome_aux2[1];
                break;
            } else {
                nome_aux2 = nome_aux.split("_");
                nome = nome_aux2[0];
            }
        }
        return nome;
    }

    //funções das intents
    function BoasVindas(agent) {
        var contato = getContactNumber();

        //se for um número
        if (!isNaN(contato)) {
            response.json({ followupEventInput: { name: "contato_novo" } });

            //se for nome
        } else if (isNaN(contato)) {
            var nome = limparNomeContatoAntigo();

            response.json({
                followupEventInput: { name: "contato_antigo" },
                outputContexts: [
                    {
                        name: request.body.session + "/contexts/esperando_nome",
                        lifespanCount: 1,
                        parameters: {
                            Nome: nome
                        }
                    }
                ]
            });
        }
    }

    function Cadastro_antigo(agent) {
        var contato = getContactNumber();
        if (isNaN(contato)) {
            var nome = limparNomeContatoAntigo();
            response.json({
                followupEventInput: { name: "cadastro_contato_antigo" },
                outputContexts: [
                    {
                        name: request.body.session + "/contexts/esperando_nome",
                        lifespanCount: 1,
                        parameters: {
                            Nome: nome
                        }
                    }
                ]
            });
        }
    }

    function Cadastro_novo(agent) {
        var contato = getContactNumber();

        var Nome =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "Nome.original"
            ];
        var Sobrenome =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "Nome2.original"
            ];
        var Cidade =
            agent.request_.body.queryResult.outputContexts[2].parameters[
            "cidade.original"
            ];
        return admin.database().ref('CADASTRO/' + Nome + "_" + Sobrenome + "_" + Cidade).set({
            Nome: Nome,
            Sobrenome: Sobrenome,
            Numero: contato,
            Cidade: Cidade
        });
    }

    function continuar_atendimento(agent){
        var resposta = agent.request_.body.queryResult['queryText'];
        var contato = getContactNumber();

        //se for contato novo
        if (!isNaN(contato)) {
            return admin.database().ref('Duvida/' + contato).set({
            Numero: contato,
            Duvida: resposta
        });
        

            //se for contato antigo
        } else {
            var nome = getContactName();
            return admin.database().ref('Duvida/' + nome).set({
                Nome: nome,
                Duvida: resposta
            });
        }
    }


    function teste2(agent) {
        return response.json({ fulfillmentText: "teste4 " });
    }

    let intentMap = new Map(); //Intent
    intentMap.set("teste", teste2);
    intentMap.set("BoasVindas", BoasVindas);
    intentMap.set("continuar_atendimento", continuar_atendimento);
    intentMap.set("Menu_principal_1_novas_mudas", Cadastro_antigo);
    intentMap.set("Menu_principal_1_novas_mudas_cidade", Cadastro_novo);
    agent.handleRequest(intentMap);
});