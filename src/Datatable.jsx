
import React, { useState, useEffect } from "react";

import Pagination from "./pagination";

function Datatable() {
  const [user, setUser] = useState([]);
  const [order,setOrder]=useState("ASC");
  const [searchTerm,setsearchterm]=useState("");

  const [searchColumns, setSearchColumns] =useState(["disclosure_year"]);


  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(300);

  const requestSort=(col)=>{
    if(order==="ASC")
    {
      const sorted=[...user].sort((a,b)=>
a[col]>b[col]?1:-1);
setUser(sorted);
setOrder("DSC");
    }


    if(order==="DSC")
    {
      const sorted=[...user].sort((a,b)=>
a[col]<b[col]?1:-1);
setUser(sorted);
setOrder("ASC");
    }
  }


  const fetchData = () => {
 
    fetch(
      "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUser(data);
      
        
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const columns=user[0] && Object.keys(user[0]);
  const cc=["disclosure_year","ticker","representative","district"];
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = user.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);


  return (
    
   
    <div className="container">
    <div>
    <nav class="navbar  sticky-top navbar-light bg-light">
  <a class="navbar-brand" href="#">
    <img src="https://internshala.com/cached_uploads/logo%2F5f3fce84a007c1598017156.png" width="30" height="30" class="d-inline-block align-top" alt="" />
      ExpandAcross Technologies Private Limited
  </a>
</nav> </div>
    
         <Pagination
        postsPerPage={postsPerPage}
        totalPosts={user.length}
        paginate={paginate}
      />
      <input type="text" placeholder="search.." className="form-control" onChange={(e)=>{
       setsearchterm(e.target.value);}}/>
      
        
     {
     cc.map(column=><label>
       <input 
                type="checkbox"
                checked={searchColumns.includes(column)}
                onChange={(e) => {
                  const checked = searchColumns.includes(column);
                  setSearchColumns((prev) =>
                    checked
                      ? prev.filter((sc) => sc !== column)
                      : [...prev, column]
                  );
                }}
              />{column}
              </label>)
     }
      <table className="table table-borderd">
      
        <thead>
          <tr>
          {user[0] && columns.map((heading) => <th onClick={() => requestSort(heading)}>{heading}</th>)}
          </tr>
        </thead>
        <tbody>
        {/* //user */}
          {currentPosts.filter((val)=>{
            if(searchTerm===" ")
            {
              return val;
            }
            else if(
                
              val.disclosure_year.toString().toLowerCase().includes(searchTerm.toLowerCase())||
              val.ticker.toString().toLowerCase().includes(searchTerm.toLowerCase())||
              val.representative.toString().toLowerCase().includes(searchTerm.toLowerCase())||
              val.district.toString().toLowerCase().includes(searchTerm.toLowerCase()))
              {
                return val;
              }
              }).map((row) => (
          <tr>
            {columns.map((column) => (
              <td>{row[column]}</td>
              ))}
          </tr>
        ))}
        </tbody>
      </table>
     
    </div>
  );
}

export default Datatable;
