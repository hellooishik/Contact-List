const express = require('express');
const path = require('path');
const port = 8001;
const Contact = require('./config/models/contact');

const db = require('./config/models/mongoose');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('assets'));

// Define contactList as a global variable accessible to all routes
const contactList = [
  {
    name: "Arpan",
    phone: "1111111111"
  },
  {
    name: "Tony Stark",
    phone: "1234567890"
  },
  {
    name: "Coding Ninjas",
    phone: "12131321321"
  }
];

app.get('/practice', function(req, res) {
  return res.render('practice', {
    title: "Let us play with ejs"
  });
});

app.get('/', function(req, res) {
    Contact.find({}) // This returns a Query object
      .exec() // No callback here, returns a promise
      .then(contacts => {
        return res.render('home', {
          title: "Contact List",
          contact_list: contacts
        });
      })
      .catch(err => {
        console.log("Error in fetching contacts from db", err);
        return res.status(500).send("Internal Server Error");
      });
});

app.post('/create-contact', function(req, res) {
  Contact.create({
    name: req.body.name,
    phone: req.body.phone
  })
  .then(newContact => {
    console.log('******', newContact);
    return res.redirect('back');
  })
  .catch(err => {
    console.log('Error in creating a contact!', err);
    return res.redirect('back');
  });
});

app.get('/delete-contact/', function(req, res) {
    console.log(req.query);
    let id = req.query.id;
  
    Contact.findOneAndDelete({ _id: id })
      .exec() // Executing the query
      .then(() => {
        console.log('Contact deleted successfully');
        return res.redirect('back');
      })
      .catch(err => {
        console.log('Error in deleting the contact', err);
        return res.status(500).send('Internal Server Error');
      });
});

app.get('/update-contact/:id', function(req, res) {
  const id = req.params.id;

  Contact.findById(id)
    .exec()
    .then(contact => {
      if (!contact) {
        console.log('Contact not found');
        return res.status(404).send('Contact not found');
      }
      return res.render('update-contact', { title: 'Update Contact', contact });
    })
    .catch(err => {
      console.log('Error in fetching contact from db', err);
      return res.status(500).send('Internal Server Error');
    });
});
  
app.post('/update-contact', function(req, res) {
    const id = req.body.id;
    const updatedContact = {
      name: req.body.name,
      phone: req.body.phone
    };
  
    Contact.findByIdAndUpdate(id, updatedContact)
      .exec()
      .then(() => {
        console.log('Contact updated successfully');
        return res.redirect('/');
      })
      .catch(err => {
        console.log('Error in updating the contact', err);
        return res.status(500).send('Internal Server Error');
      });
});

app.listen(port, function(err) {
  if (err) {
    console.log("Error in running the server", err);
  }
  console.log('Yup! My Server is running on Port', port);
});
