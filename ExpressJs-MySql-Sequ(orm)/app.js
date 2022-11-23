const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');
const path = require('path');

const errorController = require('./controllers/error');

const sequelize = require('./utility/database');

const Category = require('./models/category');
const Product = require('./models/product');
const User = require('./models/user');

const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

const Order =require('./models/order');
const OrderItem = require('./models/orderItem');

app.set('view engine', 'pug');
app.set('views', './views');

// const connection = require('./utility/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
     User.findByPk(1)
          .then(user => {
               req.user = user;
               next();
          })
          .catch(err => {
               console.log(err);
          })
});


app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page)


/*
connection.execute('SELECT * FROM products').then((result)=>{
     console.log(result[0])
}).catch((err)=>{
     console.log(err);
})*/




Product.belongsTo(Category, {
     foreignKey: {
          allowNull: false
     }
});
Category.hasMany(Product);


Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product , { through : OrderItem});
Product.belongsToMany(Order , { through : OrderItem});

let _user;
sequelize
    //.sync({ force: true })
    .sync()
    .then(() => {

        User.findByPk(1)
            .then(user => {
                if (!user) {
                    return User.create({ name: 'sena', email: 'sena@gmail.com' });
                }
                return user;
            }).then(user => {
                _user = user;
                return user.getCart();
            }).then(cart => {
                if (!cart) {
                    return _user.createCart();
                }
                return cart;
            }).then(() => {
                Category.count()
                    .then(count => {
                        if (count === 0) {
                            Category.bulkCreate([
                                { name: 'Telefon', description: 'telefon kategorisi' },
                                { name: 'Bilgisayar', description: 'bilgisayar kategorisi' },
                                { name: 'Elektronik', description: 'elektronik kategorisi' }
                            ]);
                        }
                    });
            });
    })
    .catch(err => {
        console.log(err);
    });

// app.use('/product-list',(req,res,next)=>{
//     res.send('<h1>Product Listing page</h1>')
//     next();
// })


// app.use((req,res,next)=>{
//     console.log("middleware 2 çalıştırıldı.");
//     res.send('<h1>hello from express </h1>')
// })


// app.get('/' , (req,res)=>{
//     res.send('Hello World')
// })

// app.get('/api/products', (req,res)=>{
//     res.send('Ürünler Listelendi')
// })

app.listen(3000, () => {
     console.log("listenin on port 3000");
});