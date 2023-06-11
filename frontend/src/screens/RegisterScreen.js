import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button,  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {register} from '../actions/userActions';
import FormContainer from '../components/FormContainer';

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch()

  const search = useLocation().search 
  const redirect = search ? search.split('=')[1] : '/'; 
  const navigate = useNavigate();

  const userRegister = useSelector(state => state.userRegister);

  const {error, loading, userInfo} = userRegister;

  useEffect(()=>{
   if(userInfo) {
    navigate(redirect)
   }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
   e.preventDefault();
   if(password !== confirmPassword) {
    setMessage('Passwords do not match!');
   }
   else {
    dispatch(register(email, password, name));
    setMessage('');
   }
   
  }
  
  return (
    <FormContainer>
     <h1>Sign in</h1>
     {message && <Message variant='danger'>{message}</Message>}
     {error && <Message variant='danger'>{error}</Message>}
     {loading && <Loader/>}
     <Form onSubmit={submitHandler}>
      <Form.Group controlId='name'>
       <Form.Label>Name</Form.Label>
       <Form.Control
        required
        type='name'
        placeholder='Enter name'
        value = {name}
        onChange={(e) => setName(e.target.value)}
       >
       </Form.Control>
      </Form.Group>

      <Form.Group controlId='email'>
       <Form.Label>Email Address</Form.Label>
       <Form.Control
        required
        type='email'
        placeholder='Enter email'
        value = {email}
        onChange={(e) => setEmail(e.target.value)}
       >
       </Form.Control>
      </Form.Group>

      <Form.Group controlId='password'>
       <Form.Label>Password</Form.Label>
       <Form.Control
        required
        type='password'
        placeholder='Enter password'
        value = {password}
        onChange={(e) => setPassword(e.target.value)}
       >
       </Form.Control>
      </Form.Group>

      <Form.Group controlId='confirmPassword'>
       <Form.Label>Confirm Password</Form.Label>
       <Form.Control
        required
        type='password'
        placeholder='Confirm Password'
        value = {confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
       >
       </Form.Control>
      </Form.Group>

      <Button type='submit' variant='primary' className='my-3'>Register</Button>
      
     </Form>

     <Row className='py-3'>
      <Col>
       Have an account? 
       <Link to={redirect ? `/login?redirect=${redirect}` : 'login'}>Sign In</Link>
      </Col>
     </Row>

    </FormContainer>
  )
}

export default RegisterScreen