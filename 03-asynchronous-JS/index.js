const fs = require('fs');

const superagent = require('superagent');

const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) reject('File could not be readed!');
      resolve(data);
    });
  });
};

const writeFilePro = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) reject('File cound not be saved!');
      resolve('File has been saved!');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dogf.txt`, 'utf-8');
    console.log(data);

    const response = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    await writeFilePro('dog-img-async-await.txt', response.body.message);
    console.log('Dog image saved');
    return '2 - DONE';
  } catch (err) {
    throw new Error(err);
  }
};

(async () => {
  try {
    console.log('1');
    const x = await getDogPic();
    console.log(x);
    console.log('3');
  } catch (err) {
    console.log(err);
  }
})();

// console.log('1');
// const x = getDogPic();
// console.log(x);
// console.log('3');

// readFilePro(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log('Breed: ', data);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then(res => {
//     return writeFilePro('dog-img-pro.txt', res.body.message);
//   })
//   .catch(err => console.log(err));
