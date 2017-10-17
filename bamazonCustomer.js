var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Dylan!102",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

var shoppingCartArray = [];
var shoppingCartSQLArray = [];

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "shopOrInv",
      type: "rawlist",
      message: "Would you like to [SHOP] or [VIEW CART] or [CHECKOUT]?",
      choices: ["Shop", "View Cart", "Checkout"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.shopOrInv.toUpperCase() === "SHOP") {
        var shoppingCartArray = [];
        var shoppingCartSQLArray = [];
        initializeCart();
        shopView();
      }
      if (answer.shopOrInv.toUpperCase() === "VIEW CART") {

        printCartView();
      }
      if (answer.shopOrInv.toUpperCase() === "CHECKOUT") {

        checkoutView();
      }
    });
}

// function to handle shopping for new items 


function shopView() {
  // query the database for all products for sale
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err; 

    // once you have the products, prompt the user for products they'd like to purchase
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
//            console.log(results);
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
        },
          message: "Please select a product id for the product you would like to purchase."
        },
        {
          name: "units",
          type: "input",
          message: "How many units would you like to buy?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        var chosenID;
        var stock_quantity_update;
        var item_extend_total;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {chosenItem = results[i];}
        }

        // determine if product purchase quantity can be fulfilled by inventory on hand
        if (chosenItem.stock_quantity > parseInt(answer.units)) {
          chosenID = chosenItem.item_id;
          stock_quantity_update = (chosenItem.stock_quantity - parseInt(answer.units));
          item_extend_total = (parseInt(answer.units) * chosenItem.price);
          console.log("You chose product ID: " + chosenID);
          console.log("Current stock onhand: " + chosenItem.stock_quantity);
          console.log("Adding units to cart: " + answer.units);
          console.log("Updated stock onhand: " + stock_quantity_update);
          // inventory onhand is sufficient, so update db, let the user know, and start over
          var sql = 'update products set stock_quantity = ' + stock_quantity_update + 
            ' where item_id = ' + chosenID;
          shoppingCartSQLArray.push(sql);
          var sqlinsert = 'INSERT INTO cart (cart_item_id, cart_product_name, cart_price, cart_units, cart_extended_item_total)';  
          sqlinsert += " VALUE (" + chosenID + ', "' + chosenItem.product_name + '", ' + chosenItem.price + ', ' + answer.units + ', ' + item_extend_total + ")";
//          console.log(sqlinsert);
          var query = connection.query(sqlinsert, function(errinsert, result){
            if (errinsert) {
                console.log("error accured with update");
                console.log(errinsert);
                throw errinsert;
            }
//            console.log(result);
            console.log(" ");
            console.log("Item placed in shopping cart successfully!");
            console.log(" ");
            continueShopping();
            });
        } else {
      
          // inventory insufficient to fulfill order, so apologize and start over
          console.log(" ");
          console.log("Your product order cannot be fulfilled by inventory onhand. Try again...");
          console.log(" ");
          continueShopping();
        }
      })
})
}


function continueShopping() {
  inquirer
    .prompt({
      name: "continueShop",
      type: "rawlist",
      message: "Yes to Continue shopping, No to Checkout, Exit to Exit without Buying.",
      choices: ["Yes", "No", "Exit"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.continueShop.toUpperCase() === "YES") {
        shopView();
      }
      if (answer.continueShop.toUpperCase() === "NO") {
        checkoutView();
//        printReceiptView();
        start();
      }
      if (answer.continueShop.toUpperCase() === "EXIT") {
        start();
      }
    });
}

function checkoutView () {
  console.log("entering checkoutView");

  for (var i = 0; i < shoppingCartSQLArray.length; i++) {
//    console.log("entering for checkout for loop");
//    console.log(shoppingCartSQLArray[i]);
    var query = connection.query(shoppingCartSQLArray[i], function(errupdate, result){
      if (errupdate) {
          console.log("error accured with update");
          console.log(errupdate);
          throw errupdate;
        }
//            console.log(result);
    })
  }

  console.log(" ");
  console.log("Order placed successfully!");
  console.log(" ");
  printReceiptView();
}

function printReceiptView () {
  console.log("entering printReceiptView");
  var orderTotal = 0;
  var sqlprint = 'SELECT * FROM cart';  
//  console.log(sqlprint);
  var query = connection.query(sqlprint, function(errprint, result){
    if (errprint) {
        console.log("error accured with print");
        console.log(errprint);
        throw errprint;
    }
//  console.log(result);
    console.log("Product Order");
  result.map(function(result) {
    orderTotal += result.cart_extended_item_total;
    console.log("");
    console.log("ID: " + result.cart_item_id +
                " Name: " + result.cart_product_name +
                " Price: " + result.cart_price +
                " Units: " + result.cart_units +
                " Line Item Total: " + result.cart_extended_item_total);
    console.log("*****");
  })
  console.log(" ");
  console.log("Order Total: " + orderTotal);
  console.log(" ");
  console.log("Thank you for shopping with Bamazon!");
  console.log(" ");
})
}

function printCartView () {
  console.log("entering printCartView");
  var sqlprintcart = 'SELECT * FROM cart';  
  console.log(sqlprintcart);
  var query = connection.query(sqlprintcart, function(errprintcart, result){
    if (errprintcart) {
        console.log("error accured with print");
        console.log(errprintcart);
        throw errprintcart;
    }
//    console.log(result);
  result.map(function(result) {
    console.log("");
    console.log("Product ID: " + result.cart_item_id);
    console.log("Product Name: " + result.cart_product_name);
    console.log("Product Price: " + result.cart_price);
    console.log("Number of Units: " + result.cart_units);
    console.log("Line Item Total: " + result.cart_extended_item_total);
    console.log("*****");
  })
  inquirer
    .prompt({
      name: "printReceipt",
      type: "rawlist",
      message: "Would you like to checkout and print your receipt?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
      // based on their answer, print receipt and clear cart or clear cart and return to start
      if (answer.printReceipt.toUpperCase() === "YES") {
          checkoutView();
//          printReceiptView();
          console.log("Thank you for shopping with Bamazon!");
          start();
      } else {
        return;
      }
    })
})
}

function initializeCart () {
  var sqlinit = 'TRUNCATE TABLE cart';  
//  console.log(sqlinit);
  var query = connection.query(sqlinit, function(errinit, result) {
    if (errinit) {
        console.log("error accured with table truncate");
        console.log(errinit);
        throw errinit;
    }
//  console.log(result);
//  console.log("******************************!");
  })
}
