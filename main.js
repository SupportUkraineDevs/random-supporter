/*
* Version
*/
const version = "1.0.2";
/*
* Init cycle to get cookie with already visited devs, check if api version has changed and in case delete cookies
*/
const googleSx2JsonApi = "https://gsx2json.com/";
const customGoogleSx2JsonApi = "https://supportukrainedevs-mygsx2json.herokuapp.com/";
const googleSpreadsheetApiParameters = "api?id=1mmG25XY0vd8DIGvg6pASx3E-MoOGscU2yCMealPq4RM&sheet=Sheet1";
let apiUrl = customGoogleSx2JsonApi;
let alreadySupported;
(function () {

  let previousVersion = getCookie('api-version');
  
  if (version != previousVersion) {
    console.log('Version changed from ' + previousVersion + ' to ' + version);
    eraseCookie('already-supported');
  }

  setCookie('api-version', version, 7);
  
  alreadySupported = getCookie('already-supported') ? new Set(getCookie('already-supported').split(',')) : new Set();

  fetch(googleSx2JsonApi).then(r => {
    switch(r.status) {
        case 200:
            apiUrl = googleSx2JsonApi;
            break;
        default:
            apiUrl = customGoogleSx2JsonApi;
            break;
    }
  });

})();

/*
* Custom Functions
*/
function supportRandomDev(){  
  /*
  * Put whole function in 'big-button' onclick handler to avoid popup blockers
  */
      
    let url =  apiUrl + googleSpreadsheetApiParameters;   
    fetch(url).then(data => data.json())        
    .then(function( data ) {           
        if(alreadySupported.length >= data.rows.length) {            
            alreadySupported = new Set();          
        }           
        let dev = getRandomElement(data.rows);           
        let found = false;          
        do {            
            if (dev.profile && !alreadySupported.has(dev.profile)) {               
                alreadySupported.add(dev.profile);               
                setCookie("already-supported", [...alreadySupported].join(), 7);               
                openInNewTab(dev.profile);               
                found = true; 
                return;             
            } else {               
                dev = getRandomElement(data.rows);     
            }           
        } while (found === false);                    
    });
}
function getRandomInt(max) { return Math.floor(Math.random() * max); }
function getRandomElement(array) { return array[getRandomIntCrypto(array.length)]}
function openInNewTab(url) { window.open(url, '_blank').focus();}

function getRandomIntCrypto(maxValue) {
  maxValue = maxValue - 1;
  var arr = new Uint32Array(2);
  crypto.getRandomValues(arr);
  var multiplier = 0;
  (arr[0] > arr[1]) ? multiplier = arr[1] / arr[0] :  multiplier = arr[0] / arr[1];
  return (Math.round(multiplier * maxValue));
}

/*
* Cookie utils
*/
function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}