import React from 'react';
import './deleteAcc.css';

const DeleteAcc = (props) => {
    return props.trigger ? (
        <div className='DeleteAcc'>
            <div>
                <div>Are you sure you want to delete your Account permanently?</div>
                <div><button className='confirm' onClick={() => props.setTrigger(false)}>Confirm</button></div>
                <div><button className='cancel' onClick={() => props.setTrigger(false)}>Cancel</button></div>
            </div>
        </div>
    ) : null;
}

export default DeleteAcc;
