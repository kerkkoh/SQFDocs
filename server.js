const express = require('express'),
      fs = require('fs'),
      os = require('os'),
      app = express();

app.use(express.static('public'));


/*
* Config
*/
let project = "RPFramework",
    directory = '/public',
    prefix = 'Client',
    html = "";

/*
* End of config
*/

let base = __dirname;
let folders = [base.concat(directory)];
if (!fs.existsSync(folders[0])) {console.log(`${folders[0]} wasn't found.`)} else {
  let files = [];
  let visitedFolders = [];
  let moreFolders = 1;

  //Find files and folders
  while (moreFolders) {
    moreFolders = 0;
    folders.forEach((folder, fidx) => {
      if (visitedFolders.indexOf(folder) === -1) {
        visitedFolders.push(folder);
        fs.readdirSync(folder).forEach((a,i) => {
          if ((a.indexOf(".") === -1) && (visitedFolders.indexOf(folder + "/" + a) === -1)) {
            folders.push(folder + "/" + a);
            moreFolders = 1;
          } else if (a.indexOf(".sqf") != -1) {
            files.push({path: folder + "/" + a, pathdoc: folder + "/" + a, function: `${prefix}_fnc_${a.substr(3,a.length-7)}`, params: []});
          }
        });
      }
    });
  }
  // Process files
  files.forEach((file,i) => {
    let txt = fs.readFileSync(file.path, 'utf8');
    let comment = txt.substring(txt.indexOf("/*")+3,txt.indexOf("*/")-1);
    let array = comment.split(os.EOL);
    array.forEach((line, idx) => {
      let sth = line.split(":");
      if (sth.length > 1) {
        switch (sth[0]) {
          case "# Description":
            file.description = sth[1].substr(1,sth[1].length-1);
          break;
          case "# Author":
            file.author = sth[1].substr(1,sth[1].length-1);
          break;
          case "# Param":
            let params = sth[1].split(" {");
            let nparams = [];
            params.forEach((stf, index) => {
              nparams[index] = params[index].slice(0,params[index].length-1);
            });
            file.params.push({idx: file.params.length, type: nparams[1], name: nparams[2], description: nparams[3]});
          break;
        }
      }
    });
  });
  console.log(files);
  
  let list = [];
  files.forEach((file,index) => {
    let end = "</ul></li>";
    let final = `<li><h4>${file.function} <i>(${file.path})</i></h4><ul><li>Author: ${file.author}</li><li>Description: ${file.description}</li>`;
    file.params.forEach((param, idx) => {
      final += `<li>Param ${param.idx}<ul><li>Type: ${param.type}</li><li>Name: ${param.name}</li><li>Description ${param.description}</li></ul></li>`;
    });
    list.push(final + end);
  });
  let slist = list.join(os.EOL);
  console.log(slist);

  html = `
  <html><head><title>${project}</title></head>
  <body>
  <h1>${project}</h1>
  <p>Automatically generated function documentation for SQF functions.</p>
  <hr>
  <main>
  <ul>
  ${slist}
  </ul>
  </main>
  <hr>
  <footer>Created with SQFDocs</footer>
  </body>
  </html>
  `;
}

app.get("/", function (request, response) {
  response.send(html);
});
 
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
