var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
var request = require('request');
var AWS = require("aws-sdk");

//Alterar o nome do arquivo
var image = '[NOME DA IMAGEM]';
//URL do seu bucket
let url = '[URL DO SEU BUCKET]' + image;


const qr = new QrCode();
request({ url, encoding: null }, (err, resp, buffer) => {
    Jimp.read(buffer, function(err, image) {
        if (err) {
            console.error("Ocorreu um erro ao converter o qr code " + err);
        }
        var qr = new QrCode();

        qr.callback = function(error, result) {
            if(error) {
              console.log("Ocorreu um erro ao ler o qr code " + error)
              return;
            }
            var resp = result.result
            obj = JSON.parse(resp);
            insert(obj)
        }
        qr.decode(image.bitmap);
    });    
});

function insert(person){
    var rdm = Math.floor((Math.random() * 100) + 1);
    rdm = rdm +1
    // Alterar a Região
    AWS.config.update({region: '[REGIAO DA TABELA]'});
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var params = {
    //Alterar o nome da tabela
    TableName: '[NOME DA TABELA]',
    Item: {
        //EDITAR OS ATRIBUTOS
        'id': {N:rdm.toString()},
        'name': { S:person.name},
        'age': { S:person.age}
    }
    };
    ddb.putItem(params, function(err, data) {
    if (err) {
        console.log("Erro ao inserir na base de dados", err);
    } else {
        console.log("Sucesso ao inserir na base de dados", data);
    }
    });
}

