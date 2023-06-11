import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination } from 'react-bootstrap';

function Paginate({pages, page, keyword="", isAdmin=false}) {
  const navigate = useNavigate();
  if(keyword && keyword.includes('keyword')) {
   keyword = keyword.split('?keyword=')[1].split('&')[0]
  }
  
  const navigateToPage = (e) => {
   navigate({
     search: `keyword=${keyword}&page=${e}`
   });
  }

  return (pages > 1 && (
   <Pagination>
    {[...Array(pages).keys()].map(x => (
     
      <Pagination.Item 
       key={x + 1} 
       active={x + 1 === page}
       onClick={() => navigateToPage(x + 1)}
       >{x + 1}</Pagination.Item>
     
    ))}
   </Pagination>
  )
  )
}

export default Paginate