import React, { useState } from "react";
import './deleteAcc.css';
import DeleteConf from "./passwordForDeletion"


// AH-- pop up to confirm delete acc
const DeleteAcc = (props) => {
    const [confirmButton,setConfirmButton]=useState(false)

    
    return props.trigger ? (
        <div className='DeleteAcc'>
            <div>
                <div>Are you sure you want to delete your Account permanently?</div>
                <div><button className='confirm' onClick={() => setConfirmButton(true)}>Confirm</button></div>
                <div><button className='cancel' onClick={() => props.setTrigger(false)}>Cancel</button></div>

                <DeleteConf trigger={confirmButton} setTrigger={setConfirmButton} /> 
            </div>
        </div>
    ) : null;
}

export default DeleteAcc;
