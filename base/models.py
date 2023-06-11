from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(blank=True, null=True, default='/placeholder.png')
    brand = models.CharField(max_length=200, blank=True, null=True)
    category = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False, unique=True)
    
    def __str__(self):
					return self.name
    
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True, null=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False, unique=True)

    def __str__(self):
            return str(self.rating)
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    paymentMethod = models.CharField(max_length=200, blank=True, null=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False, unique=True)

    def __str__(self):
        return str(self.createdAt)

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    image = models.CharField(max_length=500, blank=True, null=True)
    _id = models.AutoField(primary_key=True, editable=False, unique=True)

    def __str__(self):
        return str(self.name)
    
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    postalCode = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200, blank=True, null=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    _id = models.AutoField(primary_key=True, editable=False, unique=True)

    def __str__(self):
        return self.address