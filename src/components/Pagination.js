import React from 'react';
import {Button} from "react-bootstrap";
import "./Pagination.css";

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <Button onClick={() => paginate(number)} className="pagination-btn">
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;