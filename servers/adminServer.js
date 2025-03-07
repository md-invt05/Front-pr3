const express = require("express");
const path = require("path");

const yaml = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

// Настройка папки для middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public_admin")));

// Вставка json файла
const fs = require('fs').promises;
const { json } = require("stream/consumers");
const productsFile = path.join(__dirname, "products.json");

// Настройка API-эндпоинтов
app.get("/api/products", (req, res) => {
    try {
        const products = JSON.parse(fs.readFile(productsFile,'utf-8'));
        res.json(products);
    } catch (error) {
        res.status(500).json({error: "Ошибка загрузки товаров"});
    }
});

// Добавление товара
app.post("/api/products", (req, res) => {
    try {
        const newProducts = req.body;
        let products = JSON.parse(fs.readFile(productsFile, "utf-8"));

        // Находим максимальный существующий ID
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;

        // Добавляем новые товары с увеличивающимся ID
        newProducts.forEach((product, index) => {
            product.id = maxId + index + 1; // Увеличиваем ID для каждого нового товара
            products.push(product);
        });

        fs.writeFile(productsFile, JSON.stringify(products, null, 2));
        res.status(201).json({ message: "Товар(ы) добавлен(ы)", products });
    } catch (error) {
        res.status(500).json({ error: "Ошибка добавления товара" });
    }
});

// Редактирование товара
app.put("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFile(productsFile, "utf-8"));
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        products[index] = { ...products[index], ...req.body };
        fs.writeFile(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар обновлён", product: products[index] });
    } catch (error) {
        res.status(500).json({ error: "Ошибка обновления товара" });
    }
});

// Удаление товара
app.delete("/api/products/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        let products = JSON.parse(fs.readFile(productsFile, "utf-8"));
        products = products.filter(p => p.id !== id);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2));
        res.json({ message: "Товар удалён" });
    } catch (error) {
        res.status(500).json({ error: "Ошибка удаления товара" });
    }
});

// Swagger
const swaggerDocument = yaml.load(path.join(__dirname, "../swagger.yaml"));
console.log("Swagger YAML загружен:", swaggerDocument);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public_admin/index.html"));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Документация доступна на http://localhost:${PORT}/api-docs`);
});