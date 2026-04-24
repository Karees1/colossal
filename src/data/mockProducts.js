const mockProducts = [
    {
        id: 1,
        title: 'Black Muscle Tee',
        price: 32.0,
        frontImg: '/images/fit17.jpg',
        backImg: '/images/fit15.jpg',
        images: ['/images/fit17.jpg', '/images/fit15.jpg'],
        category: 'men',
        description: 'Premium cotton muscle tee designed for intense workouts.',
        slug: 'black-muscle-tee',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: 'Black', value: '#000000', available: true }],
        specifications: { material: '80% Cotton, 20% Polyester', fit: 'Regular Fit' }
    },
    {
        id: 2,
        title: 'Grey Hoodie',
        price: 55.0,
        frontImg: '/images/fit16.jpg',
        backImg: '/images/fit14.jpg',
        images: ['/images/fit16.jpg', '/images/fit14.jpg'],
        category: 'men',
        description: 'Heavyweight cotton hoodie perfect for pre and post workout.',
        slug: 'grey-hoodie',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: 'Heather Grey', value: '#969696', available: true }],
        specifications: { material: '80% Cotton, 20% Polyester', fit: 'Regular Fit' }
    },
    {
        id: 3,
        title: 'Hybrid Joggers',
        price: 48.0,
        frontImg: '/images/fit12.jpg',
        backImg: '/images/fit11.jpg',
        images: ['/images/fit12.jpg', '/images/fit11.jpg'],
        category: 'men',
        description: 'Versatile joggers that transition from gym to street seamlessly.',
        slug: 'hybrid-joggers',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Charcoal', value: '#333333', available: true }],
        specifications: { material: '80% Cotton, 20% Polyester', fit: 'Tapered' }
    },
    {
        id: 4,
        title: 'Power Shorts',
        price: 28.0,
        frontImg: '/images/fit1.jpg',
        backImg: '/images/fit9.jpg',
        images: ['/images/fit1.jpg', '/images/fit9.jpg'],
        category: 'men',
        description: 'Performance shorts designed for maximum mobility and comfort.',
        slug: 'power-shorts',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: 'Black', value: '#000000', available: true }],
        specifications: { material: '80% Cotton, 20% Polyester', fit: 'Regular Fit' }
    },
    {
        id: 5,
        title: 'Women Performance Crop',
        price: 28.0,
        frontImg: '/images/fit12.jpg',
        backImg: '/images/fit11.jpg',
        images: ['/images/fit12.jpg', '/images/fit11.jpg'],
        category: 'women',
        description: 'Lightweight performance crop top with moisture-wicking fabric.',
        slug: 'womens-perf-crop',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [{ name: 'Pink', value: '#ff7ab6', available: true }],
        specifications: { material: '70% Nylon, 30% Spandex', fit: 'Compresssive Fit' }
    },
    {
        id: 6,
        title: 'Premium Gym Bag',
        price: 89.0,
        frontImg: '/images/fit10.jpg',
        backImg: '/images/fit10.jpg',
        images: ['/images/fit10.jpg'],
        category: 'gear',
        description: 'Durable gym bag with ventilated shoe compartment and shoulder strap.',
        slug: 'gym-bag',
        sizes: [],
        colors: [],
        specifications: { material: '100% Polyester', capacity: '30L' }
    }
];

export default mockProducts;
