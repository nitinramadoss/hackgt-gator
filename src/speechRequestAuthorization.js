var authorizationToken;
async function RequestAuthorizationToken() {
  var authorizationEndpoint = "token.php";
    if (authorizationEndpoint) {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Ocp-Apim-Subscription-Key", "82c23b320e5e47f48e17d2216ee56f4e");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };
      var token;

      var result = await fetch("https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken", requestOptions)
      .then(response => response.text())
      .catch(error => console.log('error', error));
      console.log(result);
      var token = JSON.parse(atob(result.split(".")[1]));
      console.log(token);
      serviceRegion = token.region;
      authorizationToken = result;
      console.log(authorizationToken);
      subscriptionKeyBool = true;
      subscriptionKey = "using authorization token (hit F5 to refresh)";
      console.log("Got an authorization token: " + token);
      /*a.onload = function() {
        console.log(this.responseText);
          var token = JSON.parse(atob(this.responseText.split(".")[1]));
          serviceRegion.value = token.region;
          authorizationToken = this.responseText;
          subscriptionKey.disabled = true;
          subscriptionKey.value = "using authorization token (hit F5 to refresh)";
          console.log("Got an authorization token: " + token);
      }
    }*/
}
}
