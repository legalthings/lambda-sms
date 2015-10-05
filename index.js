console.log('Loading function');

var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();
var config = require('./config.json');

exports.handler = function (event, context) {
    var reference = event.reference;
    var language = event.language || 'en';
    var env = event.env || '';
    var table = config.dynamoDB.replace('{env}', env);
    
    console.log(table);

    if (!reference) return context.fail("Template reference is missing");
    if (!event.url) return context.fail("URL parameter is missing");

    var request = {
        TableName: table,
        Key: {
            reference: reference + ':' + language
        }
    };

    dynamo.getItem(request, function (err, template) {
        if (err) return context.fail(err);

        var mustache = require('mustache');

        var text = mustache.render(template.Item.body, event);

        sendSMS(text, event.source, event.destination, function (status, response) {
            if (status >= 400) return context.fail('SMS failed: ' + response.error);
            context.succeed('ok');
        });
    });
};

function sendSMS(text, source, destination, callback) {
    var plivo = require('plivo');
    
    var p = plivo.RestAPI({
        authId: config.plivo.authId,
        authToken: config.plivo.authToken
    });

    var params = {
        src: source,
        dst: destination,
        text: text,
        type: 'sms'
    };

    p.send_message(params, callback);
}
