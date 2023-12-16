/**
 * Page to allow both customers and employees to modify their account details
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
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import AccountDataService from "../services/account.service.js";
import { AuthContext } from '../context/auth.context.js';

const ManageAccount = () => {
  const { currentUser } = useContext(AuthContext);

  const [err, setError] = useState(null);

  const [user, setUser] = useState({
    type: "",
    FName: "",
    LName: "", 
    PhoneNum: "", // customer only
    Email: "",
    Password: "",
    PermissionLevel: "", // employees only
    NumPastOrders: "", // customers only

    loading: true
  });
  const [editState, setEditState] = useState({
    FName: "",
    LName: "", 
    PhoneNum: "", // customer only
    Email: "",
    Password: "",
    PermissionLevel: "", // employees only (can only change not-own permission)
    NumPastOrders: "", // customers only (only employees can change)
  });
  const [pageState, setPageState] = useState({
    err: false,
    loading: true,
    editing: false
  })

  const navigate = useNavigate();
  const params = useParams();

  // called as soon as this page is loaded
  useEffect(() => {
    getUserInfo();
  }, []);


  const getUserInfo = async () => {
    setPageState({
      loading: true,
      editing: false,
      err: false
    });
    // check that a user is logged in
    if (currentUser) {
      if (currentUser.type === 'customer') {
        // retrieve user's info and populate user state with it
        try {
          const res = await AccountDataService.getCustomer(params.AccountID);
          setUser({ 
            type: 'customer',
            ...res.data
          });
          setPageState({loading: false});
          return;
        } catch (err) {
          setPageState({err: err.response.data.message});
          return;
        }
      } else if (currentUser.type === 'employee') {
        // emploree may be accessing their account,
        // or a customer's or another employee's account.
        if (currentUser.id == params.AccountID) {
          // employee is trying to manage their own account
          try {
            const res = await AccountDataService.getEmployee(params.AccountID);
            setUser({
              type: 'employee',
              ...res.data
            });
            setPageState({loading: false});
            return;
          } catch (err) {
            if (err.response.status == 404) {
              setPageState({
                err:`Your account cannot be found. Please try logging out and logging in again.`
              });
            } else {
              setPageState({
                err: `Issue accessing user with ID ${params.AccountID}: ${err.response.data.message}`
              });
            }
            return;
          }
        } else {
          // employee is trying to manage someone else's account
          // try looking within employee accounts if user has sufficient permissions
          console.log('DEBUG: employee with permission ' + currentUser.permission + ' trying to access other account');
          if (currentUser.permission >= 5) {
            // see if it's an employee account
            try {
              console.log('DEBUG: looking for employee accounts...');
              const eRes = await AccountDataService.getEmployee(params.AccountID);
              setUser({
                type: 'employee',
                ...eRes.data
              });
              setPageState({loading: false});
              return;
            } catch (eErr) {
              if (eErr.response.status != 404) {
                setPageState({
                  err: `(ERR${eErr}) Issue accessing user with ID ${params.AccountID}: ${eErr.response.data.message}`
                });
                return;
              }
              // if 404 status, then it was not an employee account, but might be a customer account
            }
          }
          if (currentUser.permission >= 2){
            // try looking within customer accounts
            try {
              console.log('DEBUG: looking for customer accounts...');
              const cRes = await AccountDataService.getCustomer(params.AccountID);
              setUser({
                type: 'customer',
                ...cRes.data
              });
              setPageState({loading: false});
              return;
            } catch (cErr) {
              if (cErr.status == 404) {
                setPageState({
                  err: `User with ID ${params.AccountID} cannot be found. Please check the URL and try selecting a user again.`
                });
              } else {
                setPageState({
                  err: `Issue accessing user with ID ${params.AccountID}: ${cErr.response.data.message}`
                });
              }
              return;
            }
          } else {
            // this employee does not have sufficient permissions to edit
            // accounts other than their own
            setPageState({
              err: `Issue accessing user with ID ${params.AccountID}: `
              + 'Your account ID does not match the ID of the account you are requesting. '
              + 'You do not have permission to access accounts other than your own. '
              + 'Please try accessing your account again or log out and log back in.'
            });
          }
        }
      }
    } else {
      // user not logged in, redirect to login page.
      navigate('/login');
    }
  }

  const validateInput = () => {
    // confirm at least one field is non-empty
    if (((editState.FName === undefined || editState.FName == user.FName) && 
      (editState.LName === undefined || editState.LName == user.LName) &&
      (editState.PhoneNum === undefined || editState.PhoneNum == user.PhoneNum) &&
      (editState.Email === undefined || editState.Email == user.Email) &&
      (editState.Password === undefined || editState.Password == user.Password) &&
      (editState.PermissionLevel === undefined || editState.PermissionLevel == user.PermissionLevel) &&
      (editState.NumPastOrders === undefined || editState.NumPastOrders == user.NumPastOrders)
    )) {
      throw(new Error('At least one field must be defined or different from '
        + 'existing information to update account!'
      ));
    }

    // remove fields that are the same for user and edit state
    Object.entries(editState).map(([key, value]) => {
      if (value == user[key])
        setEditState(prev => ({...prev, [key]: undefined}));
    })
  }


  const handleChange = e => {
    setEditState(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleEnterEdit = e => {
    e.preventDefault(); // prevent page refresh
    setEditState({}); // clear all values
    setPageState({editing: true});
  }

  const handleExitEdit = e => {
    e.preventDefault(); // prevent page refresh
    setPageState({editing: false});
    setError(null);
    
  }

  const handleDelete = async e => {
    e.preventDefault();
    if (user.type == 'customer') {
      try {
        AccountDataService.deleteCustomer(params.AccountID);
        navigate('/');
      } catch (err) {
        setPageState({err: err.result.data.message});
        return;
      }
    } else if (user.type == 'employee') {
      try {
        AccountDataService.deleteEmployee(params.AccountID);
      } catch (err) {
        setPageState({err: err.result.data.message});
        return;
      }
    } else {
      setPageState({
        err: 'Invalid authentication token contents. '
        + 'Please try logging out, then logging in and trying again.'
      });
      return;
    }

    if (currentUser.id == params.AccountID) {
      // user has deleted their own account
      AccountDataService.logout();
      navigate('/');
    } else {
      // employee account must have been managing others' accounts
      navigate('/employee');
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()  // prevents page refresh on submission

    try { validateInput(); }
    catch (e) {
      setError(e.message);
      return;
    }

    console.log({...editState});

    if (user.type === 'customer') {
      try {
        await AccountDataService.updateCustomer(params.AccountID, editState);
      } catch (err) {
        setPageState({err: err.result.data.message});
        return;
      }
    } else if (user.type === 'employee') {
      try {
        await AccountDataService.updateEmployee(params.AccountID, editState);
      } catch (err) {
        setPageState({err: err.result.data.message});
        return;
      }
    } else {
      setPageState({
        err: 'Invalid authentication token contents. '
        + 'Please try logging out, then logging in and trying again.'
      });
      return;
    }
    handleExitEdit(e);
    // reload account info
    getUserInfo();
  }

  return (
    <div>
      { pageState.err || pageState.loading ? 
        (
        <div>
          { pageState.err ? (
            <div className='page error-page'>
              <h1>Error!</h1>
              <p>{pageState.err}</p>
            </div>
          ) : (
            <div className='page loading-page'>
              <h1>Loading...</h1>
              <p>Please wait while requested user information is retrieved.</p>
            </div>
          )}
        </div>
        ) : (
        <form className='page acc-manage-form'>
          { params.AccountID == currentUser.id ? (
              <h1>My Account</h1>
            ) : (
              <h1>Manage Account</h1>
            )}

          <div className='label-group'>
            <label>Name</label>
            { pageState.editing ? (
              <div className='input-row label-contents'>
                <input
                  type='text'
                  id='FName'
                  name='FName'
                  maxLength="35"
                  placeholder={user.FName}
                  onChange={handleChange}
                />
                <input
                  type='text'
                  id='LName'
                  name='LName'
                  maxLength="35"
                  placeholder={user.LName}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <p className='label-contents'>{user.FName} {user.LName}</p>
            )}
          </div>

          <div className='label-group'>
            <label>Email</label>
            { pageState.editing ? (
              <input className='label-contents'
                type='email'
                id='Email'
                name='Email'
                maxLength="254"
                placeholder={user.Email}
                onChange={handleChange}
              />
            ) : (
              <p className='label-contents'>{user.Email}</p>
            )}
          </div>

          {user.type == 'customer' ? (
            <div className='inherit'>
              <div className='label-group'>
                <label>Phone number</label>
                { pageState.editing ? (
                  <input className='label-contents'
                    type='text'
                    id='PhoneNum'
                    name='PhoneNum'
                    maxLength="14"
                    placeholder={user.PhoneNum}
                    onChange={handleChange}
                  />
                ) : (
                  <p className='label-contents'>{user.PhoneNum}</p>
                )}
              </div>
              <div className='label-group'>
                <label >Number of past orders</label>
                { pageState.editing && currentUser.type == 'employee' ? (
                  <input className='label-contents'
                    type='number'
                    id='NumPastOrders'
                    name='NumPastOrders'
                    maxLength="35"
                    placeholder={user.NumPastOrders}
                    onChange={handleChange}
                  />
                ) : (
                  <p className='label-contents'>{user.NumPastOrders}</p>
                )}
              </div>
            </div>
          ) : (
            <div className='label-group'>
            <label>Permission level</label>
            { pageState.editing && currentUser.id != params.AccountID ? (
              <input className='label-contents'
                type='number'
                id='PermissionLevel'
                name='PermissionLevel'
                maxLength="1"
                placeholder={user.PermissionLevel}
                onChange={handleChange}
              />
            ) : (
              <p className='label-contents'>{user.PermissionLevel}</p>
            )}
          </div>
          )}

          <div className='label-group'>
            <label>Password</label>
            { pageState.editing ? (
              <input className='label-contents'
                type='password'
                id='Password'
                name='Password'
                maxLength="12"
                placeholder='Leave blank to keep current password'
                onChange={handleChange}
              />
            ) : (
              <p className='label-contents'>****</p>
            )}
          </div>

          {pageState.editing ? (
            <div className='btn-row'>
              <button onClick={handleExitEdit} className='btn-neutral'>Cancel</button>
              <button onClick={handleSubmit} className='btn-submit'>Save</button>
              <button onClick={handleDelete} className='btn-delete'>Delete Account</button>
            </div>
          ) : (
            <div className='btn-row'>
              <button onClick={handleEnterEdit} className='btn-neutral'>Edit</button>
              <button onClick={handleDelete} className='btn-delete'>Delete Account</button>
            </div>
          )}

          {err && <p className='err-msg'>{err}</p>}
        </form>
        )
      }
    </div>
  )
}

export default ManageAccount