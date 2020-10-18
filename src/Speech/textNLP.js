console.log("textNLP running");
async function textNLP(text) {
    if (text == null || text == undefined || text == "") {
      return;
    }
    if (text.includes('place')) {
      let commandType = 'place';
      let command = {'command': commandType};
      console.log(command)
      return command;

    }
    if (text.includes('begin drawing') || text.includes('stop drawing')) {
      let commandType = 'drawing';
      commandType = text.includes('begin drawing') ? 'begin drawing' : 'stop drawing';
      let command = {'command': commandType};
      return command;
    }

    let data;
    let REQ_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/caefedaf-04c0-452f-97d2-6ef49d961261?q='
    let PARAMS = '&verbose=true'
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
    let intent = data.topScoringIntent.intent;
    console.log(intent);
    let textNLPcommand = chooseIntent(data, intent);
    console.log(textNLPcommand);
    return textNLPcommand;
}

function chooseIntent(data, intent) {
    let command = {'command': '', 'shape': '', 'opacity': '', 'angle': '', 'color': ''};
    switch(intent) {
        case 'DrawSquare':
            command.command = 'draw';
            command.shape = 'square';
            command.opacity = 'transparent';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Opacity') {
                    command.opacity = data['entities'][i]['resolution']['values'][0];
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
                }
            }
            command.opacity = command.opacity.includes('50') ? '50' : command.opacity;
            return command;
            break;
        case 'DrawCircle':
            command.command = 'draw';
            command.shape = 'circle';
            command.opacity = 'transparent';
            command.color = 'black';
            for(let i = 0; i < data['entities'].length; i++) {
                if(data['entities'][i]['type'] === 'Opacity') {
                    command.opacity = data['entities'][i]['resolution']['values'][0];
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
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

                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];

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
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
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
                }
                if(data['entities'][i]['type'] === 'Color') {
                    command.color = data['entities'][i]['resolution']['values'][0];
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
