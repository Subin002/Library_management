import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Awardwinsupdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [bookData, setBookData] = useState({
        author: '',
        name: '',
        description: '',
        price: '',
        file: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:1500/awardupdatebook/${id}`);
                const newBookData = response.data.book;
                setBookData(newBookData); // Set entire book data object
            } catch (error) {
                console.error('Error fetching book data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('image', bookData.file);
            formData.append('author', bookData.author);
            formData.append('name', bookData.name);
            formData.append('description', bookData.description);
            formData.append('price', bookData.price);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.put(`http://localhost:1500/updateawardbook/${id}`, formData, config);
            navigate('/awardwinsdata');

        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate('/awardwinsdata');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    return (
        <div className='full05'>
            <div className='container05'>
                <h2 className='h205'>BOOK UPDATE FORM</h2>
                <form encType="multipart/form-data" onSubmit={handleUpdate}>
                    <div className='box05'>
                        <label htmlFor="image">Image:</label>
                        <input
                            type="file"
                            id="image"
                            name="file"
                            accept="image/*"
                            onChange={(e) => setBookData({ ...bookData, file: e.target.files[0] })}
                        />
                    </div>
                    <div className='box05'>
                        <label>Author:</label>
                        <input
                            name='author'
                            type='text'
                            className='form-control rounded-0'
                            onChange={handleInputChange}
                            value={bookData.author}
                        />
                    </div>

                    <div className='box05'>
                        <label>Book Name:</label>
                        <input
                            name='name'
                            className='form-control rounded-0'
                            onChange={handleInputChange}
                            value={bookData.name}
                        />
                    </div>

                    <div className='box05'>
                        <label>Description:</label>
                        <input
                            name='description'
                            className='form-control rounded-0 two-line-input'
                            onChange={handleInputChange}
                            value={bookData.description}
                            maxLength={80}
                        />
                    </div>

                    <div className='box05'>
                        <label>Price:</label>
                        <input
                            name='price'
                            type='text'
                            className='form-control rounded-0'
                            onChange={handleInputChange}
                            value={bookData.price}
                        />
                    </div>

                    <button type='submit' className='submit05'>Update</button>
                    <button type='button' className='submit05' onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default Awardwinsupdate;
