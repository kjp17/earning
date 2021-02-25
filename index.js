const express = require('express')
const app = express()
const port = 3000
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const cheerio = require('cheerio');

app.get('/', (req, res) => {


  const tickers = String(req.query.dates).split(",");  // true
  console.log(tickers);

  var response = [];

  function getFromFinviz(x) {
    return new Promise(resolve => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            //document.getElementById("demo").innerHTML = xhttp.responseText;
            try {
              const $ = cheerio.load(xhttp.responseText);
            
              var category = $('td').filter(function() {
                return $(this).text().trim() === 'Earnings';
              }).next().text();
  
              resolve(category);
  
            } catch (err) {
              resolve("-");
            }
          } else if (this.readyState == 4 ) {
            resolve("-");
          }
      };
      xhttp.open("GET", "https://www.finviz.com/quote.ashx?t="+x, true);
      xhttp.send();
    });
  }
  
  async function f1(tickers) {

    for (var item in tickers) {
      var x = await getFromFinviz(tickers[item]);
      var add = {};
      add[tickers[item]] = x;
      response.push(add);
    }
        
    //console.log(x); // 10
    res.send(response);
   
  }
  
  f1(tickers);
  
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})