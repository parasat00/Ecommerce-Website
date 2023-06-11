import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Card, ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { PayPalButton } from 'react-paypal-button-v2';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

function OrderScreen() {
 const {id} = useParams()
 const dispatch = useDispatch()

 const navigate = useNavigate()

 const [sdkReady, setSdkReady] = useState(false)

//  AU6lzh3Os5BIFPdeBfTKJi--quKSOQWRpLpi_5UzZrZWMcLWlPluDsXOui69FLngxHczRc8XB-Fy7g-v

 const orderDetails = useSelector(state => state.orderDetails)
 const {order, error, loading} = orderDetails

 const orderPay = useSelector(state => state.orderPay)
 const {loading: loadingPay, success: successPay} = orderPay

 const orderDeliver = useSelector(state => state.orderDeliver)
 const {loading: loadingDeliver, success: successDeliver} = orderDeliver

 const userLogin = useSelector(state => state.userLogin)
 const {userInfo} = userLogin


 if(!loading && !error) {
  order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
 }

 const addPayPalScript = () => {
  const script = document.createElement('script');
  script.type='text/javascript';
  script.src = 'https://www.paypal.com/sdk/js?client-id=AU6lzh3Os5BIFPdeBfTKJi--quKSOQWRpLpi_5UzZrZWMcLWlPluDsXOui69FLngxHczRc8XB-Fy7g-v';
  script.async=true;
  script.onload = () => {
    setSdkReady(true);
  }
  document.body.appendChild(script);
 }

 useEffect(() => {
  if(!userInfo) {
    navigate.push('/login')
  }
  if(!order || successPay || order._id !== Number(id) || successDeliver){
   dispatch({type:ORDER_PAY_RESET})
   dispatch({type:ORDER_DELIVER_RESET})
   dispatch(getOrderDetails(id));
  }
  else if(!order.isPaid) {
    if(!window.paypal) {
      addPayPalScript();
    }
    else {
      setSdkReady(true)
    }
  }
 }, [order, id, dispatch, successPay, successDeliver, userInfo, navigate])

 const succesPaymentHandler = (paymentResult) => {
  dispatch(payOrder(id, paymentResult));
 }
 const deliverHandler = () => {
  dispatch(deliverOrder(order._id));
 }

  return loading ? 
  (<Loader/>)
  : error ? 
  (<Message variant='danger'>{error}</Message>)
  :
  (
    <div>
     <h1>Order: {order._id}</h1>
     <Row>
      <Col md={8}>
       <ListGroup variant='flush'>
        <ListGroup.Item>
         <h2>Shipping</h2>
         <p><strong>Name: {order.user.name}</strong></p>
         <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
         <p>
          <strong>Shipping: </strong>
          {order.shippingAddress.address}, {order.shippingAddress.city}
          {'   '}
          {order.shippingAddress.postalCode},
          {'   '}
          {order.shippingAddress.country}
         </p>
         {order.isDelivered ? 
         (
          <Message variant='success'>Delivered On {order.deliveredAt}</Message>
         ):(
          <Message variant='warning'>Not Delivered</Message>
         )
         }
        </ListGroup.Item>

        <ListGroup.Item>
         <h2>Payment Method</h2>

         <p>
          <strong>Method: </strong>
          {order.paymentMethod}
         </p>
         {order.isPaid ? 
         (
          <Message variant='success'>Paid On {order.paidAt}</Message>
         ):(
          <Message variant='warning'>Not Paid</Message>
         )
         }
        </ListGroup.Item>

        <ListGroup.Item>
         <h2>Order Items</h2>

         {order.orderItems.length === 0 ? 
         (
          <Message variant='info'> Order is empty</Message>
         ):(
          <ListGroup variant='flush'>
           {order.orderItems.map((item, index)=> (
            <ListGroup.Item key={index}>
             <Row>
              <Col md={2}>
               <Image src={item.image} alt={item.name} fluid rounded/>
              </Col>

              <Col>
               <Link to={`/product/${item.product}`}>{item.name}</Link>
              </Col>

              <Col md={4}>
               {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
              </Col>
             </Row>
            </ListGroup.Item>
           ))}
          </ListGroup>
         )}
        </ListGroup.Item>
       </ListGroup>
      </Col>
      
      <Col md={4}>
       <Card>
        <ListGroup variant='flush'>
         <ListGroup.Item>
          <h2>Order Summary</h2>
         </ListGroup.Item>

         <ListGroup.Item>
          <Row>
           <Col>Items: </Col>
           <Col>${order.itemsPrice}</Col>
          </Row>
         </ListGroup.Item>

         <ListGroup.Item>
          <Row>
           <Col>Shipping: </Col>
           <Col>${order.shippingPrice}</Col>
          </Row>
         </ListGroup.Item>

         <ListGroup.Item>
          <Row>
           <Col>Tax: </Col>
           <Col>${order.taxPrice}</Col>
          </Row>
         </ListGroup.Item>

         <ListGroup.Item>
          <Row>
           <Col>Total: </Col>
           <Col>${order.totalPrice}</Col>
          </Row>
         </ListGroup.Item>
        
         {!order.isPaid && (
          <ListGroup.Item>
            {loadingPay && (
              <Loader/>
            )}
            {!sdkReady ? (
              <Loader/>
            ):(
              <PayPalButton 
                amount={order.totalPrice}
                onSuccess={succesPaymentHandler}
              />
            )}
          </ListGroup.Item> 
         )}
        </ListGroup>
        
        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <ListGroup>
            <ListGroup.Item>
              <Button
                type="button"
                className='btn btn-block'
                onClick={deliverHandler}
              >
                Mark as Delivered
              </Button>

            </ListGroup.Item>
          </ListGroup>
        )}

       </Card>
      </Col>
     </Row>
    </div>
  )
}

export default OrderScreen