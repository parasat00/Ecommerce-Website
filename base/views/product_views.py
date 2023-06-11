from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from base.serializers import ProductSerializer
from base.models import Product, Review
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from django.db.models import Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    products = Product.objects.filter(
        Q(name__icontains = query) | 
        Q(description__icontains = query) |
        Q(brand__icontains = query) |
        Q(category__icontains = query)
        ).order_by('-createdAt')
    
    page = request.query_params.get('page')
    paginator = Paginator(products, 8)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    
    if page == None or page == '':
        page = 1
    
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data, 'page':page, 'pages':paginator.num_pages})


@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte = 3).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id = pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    data = request.data
    user = request.user
    try:
        product = Product.objects.create(
            user = user,
            name = 'Sample Name',
            brand = 'Sample Brand',
            category = 'Sample Category',
            description = 'Sample Description',
            countInStock = 12,
            price = 100,
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except:
        message = {'detail' : 'Something went wrong'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = Product.objects.get(_id = pk)
    data = request.data

    product.name = data['name']
    # product.image = data['image']
    product.brand = data['brand']
    product.category = data['category']
    product.description = data['description']
    product.countInStock = data['countInStock']
    product.price = data['price']
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)



@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id = pk)
    product.delete()
    return Response('Product was deleted')

@api_view(['POST'])
def uploadImage(request) :
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id = product_id)
    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    product = Product.objects.get(_id = pk)
    user = request.user
    data = request.data

    # customer cant write two reviews for product
    alreadyExists = product.review_set.filter(user = user).exists()
    if alreadyExists:
        content = {'detail':'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # customer submitted review with no or 0 rating
    elif data['rating'] == 0:
        content = {'detail':'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # create review
    else :
        review = Review.objects.create(
            product = product, 
            user = user,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment'],
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total / len(reviews)
        product.save()
        return Response('Review added')