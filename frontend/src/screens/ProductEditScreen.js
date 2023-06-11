import axios from 'axios';
import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { Form, Button,  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {listProductDetails, updateProduct} from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import FormContainer from '../components/FormContainer';

function ProductEditScreen() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch()

  const {id:productId} = useParams();

  const navigate = useNavigate();

  const productDetails = useSelector(state => state.productDetails);
  const {error, loading, product} = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const {error:errorUpdate, loading:loadingUpdate, success:successUpdate} = productUpdate;

  useEffect(()=>{
   if(successUpdate) {
    dispatch({type:PRODUCT_UPDATE_RESET});
    navigate('/admin/productlist');
   }
   else {
    if(!product.name || product._id !== Number(productId)){
      dispatch(listProductDetails(productId))
    }
    else {
      setName(product.name);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setDescription(product.description);
      setCountInStock(product.countInStock);
      setPrice(product.price);
    }
   }
  }, [dispatch, product, productId, navigate, successUpdate]);

  const submitHandler = (e) => {
   e.preventDefault();
   dispatch(updateProduct({
    _id:productId, 
    name, 
    image, 
    brand, 
    category, 
    description, 
    countInStock, 
    price}))
  }
  
  const uploadHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image',file);
    formData.append('product_id',productId);
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type':'multipart/form-data'
        }
      }
      const {data} = await axios.post(
        '/api/products/upload/',
        formData,
        config
      )
      setImage(data)
      setUploading(false);
    }catch(error) {
      setUploading(false);
    }
  }

  return (
    <div>
     <Link to='/admin/productlist' className='btn btn-light my-3'>
      Go Back
     </Link>

     <FormContainer>
      <h1>Edit Product</h1>

      {loadingUpdate && <Loader/>}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

      {loading ? <Loader/> : 
       error ? (
        <Message variant='danger'>{error}</Message>
       ):(
         <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
           <Form.Label>Name</Form.Label>
           <Form.Control
            type='name'
            placeholder='Enter name'
            value = {name}
            onChange={(e) => setName(e.target.value)}
           >
           </Form.Control>
          </Form.Group>


          <Form.Group controlId='image'>
           <Form.Label>Image</Form.Label>
           <Form.Control
            type='text'
            placeholder='Enter image'
            value = {image}
            onChange={(e) => setImage(e.target.value)}
           >
           </Form.Control>

           <Form.Control        
            type='file'
            label = 'Choose File'
            custom='true'
            onChange={uploadHandler}
           >
           </Form.Control>

           {uploading && <Loader/>}
          </Form.Group>

          <Form.Group controlId='brand'>
           <Form.Label>Brand</Form.Label>
           <Form.Control
            type='text'
            placeholder='Enter brand'
            value = {brand}
            onChange={(e) => setBrand(e.target.value)}
           >
           </Form.Control>
          </Form.Group>

          <Form.Group controlId='category'>
           <Form.Label>Category</Form.Label>
           <Form.Control
            type='text'
            placeholder='Enter Category'
            value = {category}
            onChange={(e) => setCategory(e.target.value)}
           >
           </Form.Control>
          </Form.Group>

          <Form.Group controlId='description'>
           <Form.Label>Description</Form.Label>
           <Form.Control
            type='text'
            placeholder='Enter Description'
            value = {description}
            onChange={(e) => setDescription(e.target.value)}
           >
           </Form.Control>
          </Form.Group>

          <Form.Group controlId='countInStock'>
           <Form.Label>Stock</Form.Label>
           <Form.Control
            type='number'
            placeholder='Enter stock'
            value = {countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
           >
           </Form.Control>
          </Form.Group>

          <Form.Group controlId='price'>
           <Form.Label>Price</Form.Label>
           <Form.Control
            type='number'
            placeholder='Enter price'
            value = {price}
            onChange={(e) => setPrice(e.target.value)}
           >
           </Form.Control>
          </Form.Group>



          <Button type='submit' variant='primary' className='my-3'>
           Update
          </Button>
          
         </Form>
       )
      }

      

     </FormContainer>
    </div>
    
  )
}

export default ProductEditScreen