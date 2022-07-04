const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

////////////////////////////////////////
// FILES
// // Blocking code
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);

// // Asynchronous non blocking
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('File has been written!');
//       });
//     });
//   });
// });

// console.log('Will read!!');

////////////////////////////////////////
// SERVER

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Javascript

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  switch (pathname) {
    case '/':
    case '/overview':
      res.writeHead(200, {
        'Content-type': 'text/html',
      });

      const cards = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

      const output = tempOverview.replace('%PRODUCT_CARDS%', cards);

      res.end(output);
      break;
    case '/product':
      const product = dataObj[query.id];
      const outputProduct = replaceTemplate(tempProduct, product);
      res.writeHead(200, {
        'Content-type': 'text/html',
      });
      res.end(outputProduct);
      break;
    case '/api':
      res.writeHead(200, {
        'Content-type': 'application/json',
      });
      res.end(data);
      break;
    default:
      res.writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'Hello header',
      });
      res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening on port 8000');
});
