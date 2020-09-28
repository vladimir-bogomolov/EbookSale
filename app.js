const express = require('express');
const stripe = require('stripe')('sk_test_51HWKqVC5ynsFOOpcB5DiAqEWQuIAbGj9cCnIwj7FmdyMy4lcgSeDAVrEAOqErlbjDHmgO4DBWV8y4QfmSZ9OZrKJ00rc1gU70N');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//HandleBars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set a static folder
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/charge', (req, res) => {
    const amount = 2500;
    
    stripe.customers.create({email: req.body.stripeEmail, 
    source: req.body.stripeToken})
        .then(customer => stripe.charges.create({
            amount, 
            description: 'Web development E-Book',
            currency: 'usd', 
            customer: customer.id
        }))
        .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

