/**
 * Page to allow employees to see list of customer accounts, and select accounts
 * to edit.
 * 
 * BASED ON:
 *  - BezKoder's React.js CRUD example to consume Web API
 *        https://www.bezkoder.com/react-crud-web-api/
 *  - Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial
 *        https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi
 *        https://github.com/safak/youtube2022/tree/blog-app
 *  - freeCodeCamp's How to Validate Forms in React – A Step-By-Step Tutorial for Beginners
 *        https://www.freecodecamp.org/news/how-to-validate-forms-in-react/
 */
import React, { useContext, useEffect, useState } from 'react'

import AccountDataService from "../services/account.service.js";
import { AuthContext } from '../context/auth.context.js';

const CustomerAccList = () => {
  const { currentUser } = useContext(AuthContext);

  const [pageState, setPageState] = useState({
    err: false,
    loading: true,
    selected: false
  });

  const [listState, setListState] = useState({
    customers: [],
    selectedCustomer: null,
    selectedIndex: -1,
    searchTerm: '',
    searchKey: '',
  });

  // called as soon as this page is loaded
  useEffect(() => {
    getCustomers();
  }, []);


  const getCustomers = async () => {
    setPageState({
      loading: true,
      selected: false,
      err: false
    });
    // check that a user is logged in
    if (currentUser && currentUser.type === 'employee') {
      if (currentUser.permission >= 2) {
        try{
          const res = await AccountDataService.getAllCustomers();
          console.log(res.data)
          setListState(prev => ({
            ...prev,
            customers: res.data
          }));
          console.log(listState);
          setPageState(prev => ({
            ...prev,
            loading: false
          }));
          return;
        } catch (err) {
          console.log('caught err: ', err);
          setPageState(prev => ({
            ...prev,
            err: err.response.data.message
          }));
          return;
        }
      } else {
        // user has insufficient clearance
        setPageState(prev => ({
          ...prev,
          err: 'You do not have have the required permission level to view this page.'
        }));
        return;
      }
    } else {
      // no user logged in. show error
      setPageState(prev => ({
        ...prev,
        err: 'You must be logged into an employee account to view this page.'
      }));
      return;
    }
  }
 
  const setActiveCustomer = (customer, index) => {
    setListState(prev => ({
      ...prev,
      selectedCustomer: customer,
      selectedIndex: index
    }));
  }

  return (
    <div>
      { pageState.err || pageState.loading ? (
        <div>
        { pageState.err ? (
          <div className='page error-page'>
            <h1>Error!</h1>
            <p>{pageState.err}</p>
          </div>
        ) : (
          <div className='page loading-page'>
            <h1>Loading...</h1>
            <p>Please wait while requested information is retrieved.</p>
          </div>
        )}
      </div>
      ) : (
        <div className='page'>
          {listState.customers && Object.entries(listState.customers).map(([customer, index]) => {
            <li
              className={
                'acc-list-item' +
                (index === listState.selectedIndex ? ' active' : '')
              }
              onClick={() => setActiveCustomer(customer, index)}
              key={index}
            >
              {customer.FName} {customer.LName}
            </li>
          })}
        </div>
      )}
    </div>
  )
}

export default CustomerAccList