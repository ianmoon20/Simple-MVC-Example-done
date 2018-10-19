const models = require('../models');

// get the Cat model
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};
const defaultDog = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAdded = new Cat(defaultData);
let lastDog = new Dog(defaultDog);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

const getDogName = (req, res) => {
  res.json({ name: lastDog.name });
};

const setName = (req, res) => {
  if ((!req.body.firstname || !req.body.lastname || !req.body.beds)) {
    // if not respond with a 400 error
    // (either through json or a web page depending on the client dev)
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };
  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAdded = newCat;
    // return success
    res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned });
  });

  return res;
};

const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
      // if not respond with a 400 error
    // (either through json or a web page depending on the client dev)
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }
  const name = `${req.body.firstname} ${req.body.lastname}`;
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };
  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastDog = newDog;
    // return success
    res.json({ name: lastDog.name, breed: lastDog.breed, age: lastDog.age });
  });

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Cat.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save();

  // send back the name as a success for now
  savePromise.then(() => res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned }));

  // if save error, just return an error for now
  savePromise.catch(err => res.json({ err }));
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

const searchAndUpdate = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }
  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }
    const dog = doc;
    let response = {};
    dog.age++;

    const savePromise = dog.save();
    response = {
      name: dog.name,
      breed: dog.breed,
      age: dog.age,
    };

      // if save error, just return an error for now
    savePromise.catch((error) => { response = { error }; });

    return res.json(response);
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getName,
  setName,
  updateLast,
  searchName,
  setDogName,
  getDogName,
  searchDogName,
  searchAndUpdate,
  notFound,
};
