DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(250) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(6,2) default 0,
  stock_quantity INT default 0,
  stock_low boolean default false,
  product_sales DECIMAL(8,2) default 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE cart(
  cart_item_id INT NOT NULL,
  cart_product_name VARCHAR(250) NOT NULL,
  cart_price DECIMAL(6,2) default 0,
  cart_units INT default 0,
  cart_extended_item_total DECIMAL(8,2) default 0,
  PRIMARY KEY (cart_item_id)
);

insert into products (product_name, department_name, price, stock_quantity) 
value ("The Whole Art of Detection: Lost Mysteries of Sherlock Holmes", "Books & Audible", 17.99, 99);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Mr. Robot 3 Seasons 2017", "Movies, Music & Games", 24.99, 50);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Bose SoundLink Color Bluetooth speaker II - Soft black", "Electronics, Computers & Office", 129.99, 25);
insert into products (product_name, department_name, price, stock_quantity) 
value ("mDesign Wide Shower Caddy", "Home, Garden & Tools", 22.99, 74);
insert into products (product_name, department_name, price, stock_quantity) 
value ("KD Interactive Aura Drone with Glove Controller", "Toys, Kids & Baby", 99.99, 99);
insert into products (product_name, department_name, price, stock_quantity) 
value ("S13 Women's Iceberg Parka", "Clothing, Shoes & Jewlery", 295.00, 4);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Perfect Fitness Multi-Gym Doorway Pull Up Bar and Portable Gym System", "Sports & Outdoors", 42.49, 11);
insert into products (product_name, department_name, price, stock_quantity) 
value ("V2 "RADIOACTIVE" Matte Black High Performance Motocross, ATV, Dirt Bike Helmet [DOT] - XL", "Automotive", 34.95, 31);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Giraffes Can't Dance", "Books & Audible", 13.79, 100);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Tom Petty and the Heartbreakers: Runnin' Down a Dream", "Movies, Music & Games", 19.99, 10);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Dell Inspiron 5000 2-in-1", "Electronics, Computers & Office", 649.99, 9);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Zinus 3-Step Comfort Pet Stairs / Pet Ramp / Pet Ladder, Small ", "Home, Garden & Tools", 25.49, 15);
insert into products (product_name, department_name, price, stock_quantity) 
value ("SOAIY Sleep Soother Aurora Projection LED Night Light", "Toys, Kids & Baby", 19.89, 7);
insert into products (product_name, department_name, price, stock_quantity) 
value ("UGG Women's Carlin Harness Boot", "Clothing, Shoes & Jewlery", 249.95, 3);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Fitbit Charge 2 Heart Rate + Fitness Wristband", "Sports & Outdoors", 149.98, 20);
insert into products (product_name, department_name, price, stock_quantity) 
value ("Garmin nüvi 2757LM 7-Inch Portable Vehicle GPS with Lifetime Maps", "Automotive", 171.29, 5);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(3,2) default 0,
  PRIMARY KEY (department_id)
);

insert into departments (department_name, over_head_costs) 
value ("Books & Audible", 0.05);
insert into departments (department_name, over_head_costs) 
value ("Movies, Music & Games", 0.10);
insert into departments (department_name, over_head_costs) 
value ("Electronics, Computers & Office", 0.20);
insert into departments (department_name, over_head_costs) 
value ("Home, Garden & Tools", 0.35);
insert into departments (department_name, over_head_costs) 
value ("Toys, Kids & Baby", 0.15);
insert into departments (department_name, over_head_costs) 
value ("Clothing, Shoes & Jewlery", 0.20);
insert into departments (department_name, over_head_costs) 
value ("Sports & Outdoors", 0.15);
insert into departments (department_name, over_head_costs) 
value ("Automotive", 0.25);