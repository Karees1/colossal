import React, { useState, useEffect, useRef } from 'react';
import { categories } from '../components/categories';
import './AdminUpload.css';
import { showToast } from '../components/Toast';
import API_URL from '../config';

const authHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
});

const EMPTY_FORM = {
    name: '', price: '', category: 'Shirts',
    sub_category: '', description: '', material: ''
};

const AdminUpload = () => {
    const [formData, setFormData]         = useState(EMPTY_FORM);
    const [sizes, setSizes]               = useState([]);
    const [colors, setColors]             = useState([]);
    const [newColor, setNewColor]         = useState({ name: '', hex: '#C4A44E' });
    const [frontImgFile, setFrontImgFile] = useState(null);
    const [backImgFile, setBackImgFile]   = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview]   = useState(null);
    const [loading, setLoading]           = useState(false);
    const [products, setProducts]         = useState([]);
    const [editingId, setEditingId]       = useState(null);
    const [tab, setTab]                   = useState('upload');
    const frontRef = useRef();
    const backRef  = useRef();

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const res  = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch { /* server may be offline */ }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSizeChange = (size) =>
        setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

    const addColor = () => {
        if (!newColor.name.trim()) return;
        setColors(prev => [...prev, { ...newColor }]);
        setNewColor({ name: '', hex: '#C4A44E' });
    };

    const removeColor = (idx) => setColors(prev => prev.filter((_, i) => i !== idx));

    const handleFileChange = (side, file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (side === 'front') { setFrontImgFile(file); setFrontPreview(url); }
        else                  { setBackImgFile(file);  setBackPreview(url); }
    };

    const uploadImage = async (file) => {
        const data = new FormData();
        data.append('image', file);
        const res  = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: authHeader(),
            body: data,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Upload failed');
        return json.filename;
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setSizes([]);
        setColors([]);
        setFrontImgFile(null);
        setBackImgFile(null);
        setFrontPreview(null);
        setBackPreview(null);
        setEditingId(null);
        if (frontRef.current) frontRef.current.value = '';
        if (backRef.current)  backRef.current.value  = '';
    };

    const startEdit = (product) => {
        setFormData({
            name:         product.name         || '',
            price:        product.price        || '',
            category:     product.category     || 'Shirts',
            sub_category: product.sub_category || '',
            description:  product.description  || '',
            material:     product.material     || '',
        });
        setSizes(Array.isArray(product.sizes) ? product.sizes : []);
        setColors(Array.isArray(product.colors) ? product.colors : []);
        setFrontPreview(product.frontimg
            ? `${API_URL}/utilities/images/${product.frontimg}`
            : null);
        setBackPreview(product.backimg
            ? `${API_URL}/utilities/images/${product.backimg}`
            : null);
        setFrontImgFile(null);
        setBackImgFile(null);
        setEditingId(product.id);
        setTab('upload');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: authHeader(),
            });
            if (res.ok) {
                showToast('Product deleted');
                setProducts(prev => prev.filter(p => p.id !== id));
            } else {
                showToast('Failed to delete product', 'error');
            }
        } catch {
            showToast('Server error', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let frontFilename = editingId && !frontImgFile
                ? (products.find(p => p.id === editingId)?.frontimg || '')
                : '';
            let backFilename = editingId && !backImgFile
                ? (products.find(p => p.id === editingId)?.backimg || '')
                : '';

            if (frontImgFile) frontFilename = await uploadImage(frontImgFile);
            if (backImgFile)  backFilename  = await uploadImage(backImgFile);

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                sizes,
                colors,
                frontimg: frontFilename,
                backimg:  backFilename,
            };

            const url    = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', ...authHeader() },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                showToast(editingId ? 'Product updated!' : 'Product uploaded!');
                resetForm();
                loadProducts();
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to save product', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error saving product', 'error');
        }
        setLoading(false);
    };

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40", "42"];

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <h2>Admin — Product Management</h2>
                    <div className="admin-tabs">
                        <button className={`admin-tab ${tab === 'upload' ? 'active' : ''}`} onClick={() => setTab('upload')}>
                            {editingId ? '✏ Edit Product' : '+ Upload'}
                        </button>
                        <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
                            Products ({products.length})
                        </button>
                    </div>
                </div>

                {/* ── UPLOAD / EDIT FORM ── */}
                {tab === 'upload' && (
                    <form onSubmit={handleSubmit} className="admin-form">

                        <div className="form-group">
                            <label>Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Oxford Dress Shirt" />
                        </div>

                        <div className="form-group">
                            <label>Price (KSh)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="e.g. 3500" />
                        </div>

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

                        <div className="form-group full-width">
                            <label>Available Sizes</label>
                            <div className="checkbox-group">
                                {availableSizes.map(size => (
                                    <label key={size} className="checkbox-label">
                                        <input type="checkbox" checked={sizes.includes(size)} onChange={() => handleSizeChange(size)} />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Colors</label>
                            <div className="color-input-row">
                                <input
                                    type="text"
                                    placeholder="e.g. Midnight Blue"
                                    value={newColor.name}
                                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                />
                                <input type="color" value={newColor.hex} onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })} />
                                <button type="button" onClick={addColor}>Add</button>
                            </div>
                            <div className="color-list">
                                {colors.map((c, idx) => (
                                    <span key={idx} className="color-tag" style={{ backgroundColor: c.hex }}>
                                        {c.name}
                                        <button type="button" className="color-remove" onClick={() => removeColor(idx)}>×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Front Image {editingId && <span className="optional-note">(leave blank to keep current)</span>}</label>
                                <input
                                    ref={frontRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('front', e.target.files[0])}
                                    required={!editingId}
                                />
                                {frontPreview && (
                                    <div className="img-preview">
                                        <img src={frontPreview} alt="Front preview" />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Back / Hover Image {editingId && <span className="optional-note">(optional)</span>}</label>
                                <input
                                    ref={backRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('back', e.target.files[0])}
                                />
                                {backPreview && (
                                    <div className="img-preview">
                                        <img src={backPreview} alt="Back preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. 100% Egyptian Cotton" />
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the product..."></textarea>
                        </div>

                        <div className="button-group">
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Saving...' : (editingId ? 'Update Product' : 'Upload Product')}
                            </button>
                            {editingId && (
                                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel Edit</button>
                            )}
                        </div>
                    </form>
                )}

                {/* ── PRODUCTS TABLE ── */}
                {tab === 'products' && (
                    <div className="products-table-wrap">
                        {products.length === 0 ? (
                            <p className="no-products">No products yet. Upload one to get started.</p>
                        ) : (
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                {p.frontimg
                                                    ? <img src={`${API_URL}/utilities/images/${p.frontimg}`} alt={p.name} className="table-thumb" />
                                                    : <div className="table-thumb-empty" />
                                                }
                                            </td>
                                            <td>
                                                <strong>{p.name}</strong>
                                                {p.sub_category && <span className="sub-cat-badge">{p.sub_category}</span>}
                                            </td>
                                            <td>{p.category}</td>
                                            <td className="price-cell">KSh {Number(p.price).toLocaleString()}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button className="edit-btn" onClick={() => startEdit(p)}>Edit</button>
                                                    <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUpload;
