import React, {useEffect} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';

function ProductListScreen() {
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const productList = useSelector(state=>state.productList);
  const {loading, error, products, page, pages} = productList;

  const userLogin = useSelector(state=>state.userLogin);
  const {userInfo} = userLogin;

  const productDelete = useSelector(state=>state.productDelete);
  const {error:errorDelete, loading:loadingDelete, success:successDelete} = productDelete;

  const productCreate = useSelector(state=>state.productCreate);
  const {error:errorCreate, loading:loadingCreate, success:successCreate, product:createdProduct} = productCreate;

  let keyword = useLocation().search
  useEffect(()=>{
    dispatch({type:PRODUCT_CREATE_RESET})
    if(!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
    if(successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`)
    }
    else if(userInfo && userInfo.isAdmin){
      dispatch(listProducts(keyword));
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct, keyword])

  const deleteHandler = (id) => {
    if(window.confirm('Are sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  }
  const createProductHandler = () => {
    dispatch(createProduct());
  }
  return (
    <div>
      <Row className='align-items-center'>
       <Col>
        <h1>Products</h1>
       </Col>
       <Col className='text-right'>
        <Button className='my-3' onClick={createProductHandler} style={{float: 'right'}}>
         <i className='fas fa-plus'></i> Create Product
         </Button>
       </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product=>(
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit/`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>

                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true} />
        </div>
      )}
    </div>
  )
}

export default ProductListScreen