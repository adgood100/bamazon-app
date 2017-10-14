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

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "shopOrInv",
      type: "rawlist",
      message: "Would you like to [SHOP] or manage [INVENTORY]?",
      choices: ["Shop", "Inventory"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.shopOrInv.toUpperCase() === "SHOP") {
        var shoppingCartArray = [];
        shopView();
      }
      else {
        inventoryView();
      }
    });
}

// function to handle posting new items up for auction
function inentoryView() {
  // prompt for info about the items available for purchase
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What item you would like to purchase?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place your auction in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO auctions SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        },
        function(err) {
          if (err) throw err;
          console.log("Your auction was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
}

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
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if product purchase quantity can be fulfilled by inventory on hand
        if (chosenItem.stock_quantity > parseInt(answer.units)) {
          chosenID = chosenItem.item_id;
          console.log("You chose product ID: " + chosenID);
          console.log("Current stock onhand: " + chosenItem.stock_quantity);
          console.log("Adding units to cart: " + answer.units);
          stock_quantity_update = (chosenItem.stock_quantity - parseInt(answer.units));
          console.log("Updated stock onhand: " + stock_quantity_update);
          // inventory onhand is sufficient, so update db, let the user know, and start over
          var sql = 'update products set stock_quantity = ' + stock_quantity_update + 
            ' where item_id = ' + chosenID;
          var query = connection.query(sql, function(err, result){
            if (err) {
                console.log("error accured with update");
                console.log(err);
                throw err;
              }
//            console.log(result);
            console.log("Item placed in shopping cart successfully!");
            continueShopping();
            }
          );
        }
        else {
          // inventory insufficient to fulfill order, so apologize and start over
          console.log("Your product order cannot be fulfilled by inventory onhand. Try again...");
          continueShopping();
        }
      });
  });
}

function continueShopping() {
  inquirer
    .prompt({
      name: "continueShop",
      type: "rawlist",
      message: "Continue shopping?",
      choices: ["Yes", "No"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.continueShop.toUpperCase() === "YES") {
        shopView();
      }
      else {
        checkoutView();
      }
    });
}

function checkoutView () {
  console.log("entering checkoutView");
  start();
}
