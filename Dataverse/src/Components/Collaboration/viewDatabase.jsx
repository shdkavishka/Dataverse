import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header-all/Header1';
import "./viewDatabase.css";
import AddCollab from './addCollab';
import ViewCollab from "./ViewCollab/ViewCollab"
const ViewDatabase = () => {
    const { database_id } = useParams(); 
    const [databaseName, setDatabaseName] = useState('');
    const [error, setError] = useState(null);
    const [showAddCollab, setShowAddCollab] = useState(false);
    const [showViewCollab, setShowViewCollab] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/view-database/${database_id}/`);
                setDatabaseName(response.data.name); 
                console.log(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [database_id]);

    const handleAddCollaborators = () => {
        setShowAddCollab(true);
    }

    const handleCloseCollab = () => {
        setShowAddCollab(false);
    }

    const handleViewCollabs=()=>{
        setShowViewCollab(true);
    }
    const handleCloseViewCollabs=()=>{
        setShowViewCollab(false);
    }

    return (
        <div className='view'>
            <div>
                <Header />
                <div className='area'>
                    {error ? (
                        <p>Error fetching database: {error}</p>
                    ) : (
                        <p className='opentext'>{databaseName}</p>
                    )}

                    {showViewCollab && (
                        <ViewCollab database_id={database_id} onClose={handleCloseViewCollabs} />
                    )}

                    {showAddCollab && (
                        <div className="modal-background">
                            <div className="modal-content">
                                <AddCollab database_id={database_id} onClose={handleCloseCollab} />
                            </div>
                        </div>
                    )}

                    <Link to={`/Chat/${database_id}`}>Chat </Link>
                    <Link to="/saved-charts">View saved charts </Link>
                    <Link to="" onClick={handleViewCollabs}>View Collaborators </Link>
                    <Link onClick={handleAddCollaborators}>Add Collaborators</Link>
                </div>
            </div>
        </div>
    );
}

export default ViewDatabase;
