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

