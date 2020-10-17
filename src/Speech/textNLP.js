console.log("textNLP running");
async function textNLP(text) {
    if (text == null || text == undefined || text == "") {
      return;
    }
    var data;
    var REQ_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/caefedaf-04c0-452f-97d2-6ef49d961261?q='
    var PARAMS = '&verbose=true'
    console.log("text is " + text);
    const myHeaders = new Headers({'Ocp-Apim-Subscription-Key': '7cdaa44f3fc64ad0966d02ee77603153'});
    data = await fetch(REQ_URL + text + PARAMS, {
        method: 'GET',
        headers: myHeaders
    })
      .then(response => response.json())
      .then(result => data = result)
//    .then(response => response.json)
//    .then(jsonRes => data = jsonRes)
    console.log(data);
    console.log(typeof data);
    console.log(data.topScoringIntent);
    var intent = data.topScoringIntent.intent;
    console.log(intent);
    var textNLPcommand = chooseIntent(data, intent);
    console.log(textNLPcommand);
    return textNLPcommand;
}

function chooseIntent(data, intent) {
    var command = {'command': '', 'shape': '', 'opacity': '', 'angle': '', 'color': ''};
    switch(intent) {
        case 'DrawSquare':
            command.command = 'draw';
            command.shape = 'square';
            command.opacity = 'transparent';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Opacity') {
                    command.opacity = data['entities'][i]['resolution']['values'][0];
                    break;
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                    break;
                }
            }
            command.opacity = command.opacity.includes('50') ? '50' : command.opacity;
            return command;
            break;
        case 'DrawCicle':
            command.command = 'draw';
            command.shape = 'circle';
            command.opacity = 'transparent';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Opacity') {
                    command.opacity = data['entities'][i]['resolution']['values'][0];
                    break;
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                    break;
                }
            }
            command.opacity = command.opacity.includes('50') ? '50' : command.opacity;
            return command;
            break;
        case 'DrawHexagon':
            command.command = 'draw';
            command.shape = 'hexagon';
            command.opacity = 'transparent';
            command.color = 'black'
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Opacity') {
                    command.opacity = data['entities'][i]['resolution']['values'][0];
                    break;
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                    break;
                }
            }
            command.opacity = command.opacity.includes('50') ? '50' : command.opacity;
            return command;
            break;
        case 'DrawLine':
            command.command = 'draw';
            command.shape = 'line';
            command.angle = '0';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Angle') {
                    command.angle = data['entities'][i]['entity'].split(' ')[0];
                    break;
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                    break;
                }
            }
            return command;
            break;
        case 'DrawArrow':
            command.command = 'draw';
            command.shape = 'arrow';
            command.angle = '0';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Angle') {
                    command.angle = data['entities'][i]['entity'].split(' ')[0];
                    break;
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                    break;
                }
            }
            return command;
            break;
        case 'Delete':
            command.command = 'delete';
            return command;
            break;
        case 'Cancel':
            command.command = 'cancel';
            return 'cancel'
            break;
        default:
            if(intent === 'None') {
                if(data['intents'][1]['score'] >= 0.125) {
                    return chooseIntent(data, data['intents'][1]['intent']);
                } else {
                    return command;
                }
            }
            break;
        }
}
