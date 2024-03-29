import React from 'react';
import './changePW.css';

const ChangePW = (props) => {
  return props.trigger ? (
    <div className='changePW'>
      <div>
        <form>
          <div>Change Password</div>
          <div><input className='Current-password' id='Current-password' placeholder='Current password' type="password" /></div>
          <div><input className='New-password' id='New-password' placeholder='New password' type="password" /></div>
          <div><input className='Confirm-password' id='Confirm-password' placeholder='Confirm password' type="password" /></div>
          <div><button className='save-button' onClick={() => props.setTrigger(false)}>Save</button></div>
          <div><button className='cancel-button' onClick={() => props.setTrigger(false)}>Cancel</button></div>
        </form>
      </div>
    </div>
  ) : null;
}

export default ChangePW;
