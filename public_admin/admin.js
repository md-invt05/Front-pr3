// Загрузка товаров
async function load_products() {
    const res = await fetch("/api/products");
    const products = await res.json();
    const table = document.getElementById("productsTable");

    table.innerHTML = products.map(p => `
        <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="p-4">${p.name}</td>
            <td class="p-4">${p.price} ₽</td>
            <td class="p-4 hidden md:table-cell">${p.categories.join(", ")}</td>
            <td class="p-4 text-center">
                <button onclick="editProduct(${p.id})" class="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg mr-2 transition duration-200">✏️</button>
                <button onclick="deleteProduct(${p.id})" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200">🗑</button>
            </td>
        </tr>
    `).join("");
}
// Удаление товаров
async function delete_products(id) {
    await fetch(`/api/products/${id}`, {method: "DELETE"});
    load_products();
}

document.getElementById("productForm").addEventListener("submit",async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").ariaValueMax;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const categories = document.getElementById("categories").value.split(",").map(cat => cat.trim());

    await fetch("/api/products", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify([{name, price,description,categories}])
    });

    e.target.reset();
    load_products();
});

// Работа с модальным окном для редактирования товаров
async function editProduct(id) {
    const res = await fetch("/api/products");
    const products = await res.json();
    const product = products.find(p => p.id === id);
   
    document.getElementById("editId").value = product.id;
    document.getElementById("editName").value = product.name;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editDescription").value = product.description;
    document.getElementById("editCategories").value = product.categories.join(", ");

    document.getElementById("editModal").classList.remove("hidden");
}

// Закрытие модального окна
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
});

// Сохранение изменений в модальном окне
document.getElementById("saveEdit").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const price = document.getElementById("editPrice").value;
    const description = document.getElementById("editDescription").value;
    const categories = document.getElementById("editCategories").value.split(",").map(cat => cat.trim());

    await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, description, categories })
    });

    document.getElementById("editModal").classList.add("hidden");
    loadProducts();
});

loadProducts();