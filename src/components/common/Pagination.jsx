import React, { useState } from "react";

export default function Pagination({totalPages, setActivePage, activePage}) {
  // State to track the active page


  // Function to handle page click
  const handlePageClick = (pageNumber) => {
    setActivePage(pageNumber);
  };

  return (
    <>

{totalPages > 1 &&
  Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
    <li key={page} className={activePage === page ? "active" : ""}>
      <a className="pagination-link animate-hover-btn" onClick={() => handlePageClick(page)}>
        {page}
      </a>
    </li>
  ))
}

{
  totalPages !== activePage &&
    <li>
        <a
          onClick={() => setActivePage((pre) => (pre !== 4 ? pre + 1 : pre))}
          className="pagination-link animate-hover-btn"
        >
          <span className="icon icon-arrow-right" />
        </a>
      </li>
}
   
    
    </>
  );
}
