import React from 'react';
import SearchbarCollab from './search collabs/searchbarCollab';
import "./addCollab.css";

const AddCollab = ({ database_id, onClose }) => {
  return (
    <div className='addCollab'>
      <div className='close' onClick={onClose}>x</div>
      <SearchbarCollab database_id={database_id} />
    </div>
  );
};

export default AddCollab;
