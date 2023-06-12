# Ecommerce-Website
Ecommerce Website using Django, DRF, React, Redux and JWT Tokens

### Clone the repo
```
git clone https://github.com/parasat00/Ecommerce-Website.git
```

## How to run the project?
If your new to Python, Django and virtual environments, you may want to follow my guide on how to install and run the project [here](howToRun.md)
For those who already acquainted with them. These are main commands you need:
```
python -m virtualenv env
env\Scripts\activate
pip install -r requirements.txt 
python manage.py runserver
```
## Demonstration
Below you can see how the project looks like
![](demonstration/demo_1.gif)

Adding to cart -> Shipping -> Payment method -> Place order -> Actual pay
![](demonstration/demo_2.gif)

Admin panel(product CRUD, user info edit & delete, order is delivered)
![](demonstration/demo_3.gif)

## Project Features
+ JWT Authentication and Authorization
+ Full featured shopping cart using local storage
+ Product reviews and Ratings
+ Product search feature
+ Product pagination
+ Admin with user, product management and order details page
+ Checkout process (shipping, payment method, etc)
+ PayPal / credit card integration (uses sandbox account)
+ Mark orders as a delivered option (admin)