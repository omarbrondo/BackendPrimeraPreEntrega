const express = require('express');
const router = express.Router();
const fs = require('fs');

const productsFile = './productos.json';


const getProducts = () => {
    const data = fs.readFileSync(productsFile, 'utf-8');
    return JSON.parse(data);
};


const saveProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};


router.get('/', (req, res) => {
    const products = getProducts();
    const limit = req.query.limit;
    if (limit) {
        return res.json(products.slice(0, limit));
    }
    res.json(products);
});


router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});


router.post('/', (req, res) => {
    const { title, description, code, price, stock, category } = req.body;

    // Verificar que los campos obligatorios no estén vacíos
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios, excepto status y thumbnails.' });
    }
    
    const products = getProducts();
    /*const newProduct = {
        id: String(products.length + 1),
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status ?? true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
    };*/
    const newProduct = {
        id: String(products.length + 1),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: req.body.thumbnails || [],
    };
    

    products.push(newProduct);
    saveProducts(products);
    //res.status(201).json(newProduct);
    res.status(201).json({ message: 'Producto creado exitosamente', product: newProduct });

});


router.put('/:pid', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const updatedProduct = {
        ...products[index],
        ...req.body,
        id: products[index].id // No se puede actualizar el ID
    };
    products[index] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});


router.delete('/:pid', (req, res) => {
    let products = getProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    products = products.filter(p => p.id !== req.params.pid);
    saveProducts(products);
    res.status(204).end();
});

module.exports = router;
