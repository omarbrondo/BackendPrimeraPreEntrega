const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Actualización de rutas de importación
const productRoutes = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Usar las rutas correctas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartsRouter);
