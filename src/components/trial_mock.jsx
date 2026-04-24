import React, { useEffect, useState } from "react";

const TrialMock = ({ category }) => {
    // 1. STATE: The bucket for data
    const [products, setProducts] = useState([]);

    // 2. FETCH: The bridge to the server
    const getProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/products");
            const jsonData = await response.json();

            // Filter by category if provided
            const filteredProducts = category
                ? jsonData.filter(product => product.category && product.category.toLowerCase() === category.toLowerCase())
                : jsonData;

            setProducts(filteredProducts);
            console.log("Database connected:", jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    // 3. EFFECT: Run on load
    useEffect(() => {
        getProducts();
    }, [category]);

    // 4. DISPLAY: The UI
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Inventory Trial Run</h1>

            {/* If no products, show loading message */}
            {products.length === 0 ? (
                <p>Loading data from database...</p>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} style={styles.card}>

                            {/* Image */}
                            <div style={styles.imageContainer}>
                                <img
                                    src={`/utilities/images/${product.frontimg || product.image}`}
                                    alt={product.name}
                                    style={styles.image}
                                    onError={(e) => { e.target.style.display = 'none' }} // Hide broken images
                                />
                            </div>

                            {/* Info */}
                            <div style={styles.info}>
                                <h3 style={styles.title}>{product.name}</h3>
                                <span style={styles.tag}>{product.category}</span>
                                <p style={styles.desc}>{product.description}</p>
                                <p style={styles.price}>${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 5. STYLES (Kept here for simplicity)
const styles = {
    container: { padding: "40px", fontFamily: "Arial, sans-serif" },
    header: { borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" },
    grid: { display: "flex", gap: "20px", flexWrap: "wrap" },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: "250px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        overflow: "hidden",
        backgroundColor: "#fff"
    },
    imageContainer: { height: "180px", backgroundColor: "#f4f4f4", display: "flex", alignItems: "center", justifyContent: "center" },
    image: { width: "100%", height: "100%", objectFit: "cover" },
    info: { padding: "15px" },
    title: { margin: "0 0 10px 0", fontSize: "1.1rem" },
    tag: { background: "#eee", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", textTransform: "uppercase" },
    desc: { fontSize: "0.9rem", color: "#666", margin: "10px 0" },
    price: { fontSize: "1.2rem", fontWeight: "bold", color: "#2c3e50" }
};

export default TrialMock;