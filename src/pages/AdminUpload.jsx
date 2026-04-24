import React, { useState } from 'react';
import { categories } from '../components/categories';
import './AdminUpload.css';

const AdminUpload = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Men',
        sub_category: '',
        description: '',
        material: ''
    });

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
    const [frontImgFile, setFrontImgFile] = useState(null);
    const [backImgFile, setBackImgFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    // Handle Text Inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Size Checkboxes
    const handleSizeChange = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };

    // Handle Color Addition
    const addColor = () => {
        if (newColor.name) {
            setColors([...colors, newColor]);
            setNewColor({ name: '', hex: '#000000' });
        }
    };

    // Helper: Upload Image to Server
    const uploadImage = async (file) => {
        const data = new FormData();
        data.append('image', file);
        const res = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: data
        });
        const json = await res.json();
        return json.filename;
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Images first
            let frontFilename = "";
            let backFilename = "";

            if (frontImgFile) frontFilename = await uploadImage(frontImgFile);
            if (backImgFile) backFilename = await uploadImage(backImgFile);

            // 2. Prepare Product Data
            const productData = {
                ...formData,
                sizes,
                colors,
                frontimg: frontFilename,
                backimg: backFilename
            };

            // 3. Send to Database
            const response = await fetch('http://localhost:5000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert('Product Uploaded Successfully!');
                // Reset form
                setFormData({ ...formData, name: '', price: '', description: '' });
                setSizes([]);
                setColors([]);
                setFrontImgFile(null);
                setBackImgFile(null);
            } else {
                alert('Failed to upload product');
            }
        } catch (err) {
            console.error(err);
            alert('Error uploading product');
        }
        setLoading(false);
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h2>Upload New Product</h2>
                <form onSubmit={handleSubmit} className="admin-form">

                    {/* Basic Info */}
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Price ($)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                    </div>

                    {/* Categories */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sub-Category</label>
                            <select name="sub_category" value={formData.sub_category} onChange={handleChange}>
                                <option value="">Select...</option>
                                {categories[formData.category]?.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="form-group full-width">
                        <label>Available Sizes</label>
                        <div className="checkbox-group">
                            {availableSizes.map(size => (
                                <label key={size} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={sizes.includes(size)}
                                        onChange={() => handleSizeChange(size)}
                                    />
                                    {size}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="form-group full-width">
                        <label>Colors</label>
                        <div className="color-input-row">
                            <input
                                type="text"
                                placeholder="Color Name (e.g. Midnight Blue)"
                                value={newColor.name}
                                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                            />
                            <input
                                type="color"
                                value={newColor.hex}
                                onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                            />
                            <button type="button" onClick={addColor}>Add Color</button>
                        </div>
                        <div className="color-list">
                            {colors.map((c, idx) => (
                                <span key={idx} className="color-tag" style={{ backgroundColor: c.hex }}>
                                    {c.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Front Image</label>
                            <input type="file" onChange={(e) => setFrontImgFile(e.target.files[0])} required />
                        </div>
                        <div className="form-group">
                            <label>Back/Hover Image</label>
                            <input type="file" onChange={(e) => setBackImgFile(e.target.files[0])} />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="form-group full-width">
                        <label>Material</label>
                        <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. 100% Cotton" />
                    </div>

                    <div className="form-group full-width">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminUpload;