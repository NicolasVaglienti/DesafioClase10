const socket = io();

const createButton = document.querySelector("#create-btn");
const list = document.querySelector(".products-list");
let listChildren = [];

if (createButton) {
  createButton.addEventListener("click", (e) => {
    e.preventDefault();
    let product = {};
    const val = document.querySelectorAll("input");
    [...val].forEach((item) => {
      product = { ...product, [item.name]: item.value };
    });
    socket.emit("createProduct", product);
  });
}

const removeProduct = (id) => socket.emit("removeProduct", id);

socket.on("Product list", (data) => {
  console.log(data);
  let productsList = "";

  data.forEach((item) => {
    productsList =
      productsList +
      `<div id="${item.id}" class="product-card">
    <img src="${item.picture}" alt="Product Name">
    <h2>${item.title}</h2>
    <p>${item.description}</p>
    <p>${item.price} </p>
    <button>Remove product</button>
  </div>`;
  });

  list.innerHTML = productsList;

  listChildren = [...list.childNodes];
  listChildren.forEach((item) => {
    item.addEventListener("click", () => {
      list.removeChild(item);
      removeProduct(item.id);
      console.log(item.id);
    });
  });
});
