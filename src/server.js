import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./dirname.js";
import { Server } from "socket.io";
import viewRoutes from "./routes/views.routes.js";

const app = express();

const httpServer = app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

const io = new Server(httpServer);

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));

let products = [];

app.get("/", (req, res) => {
  res.render("home", {
    title: "Home",
    products,
  });
});
app.use("/", viewRoutes);

io.on("connection", (socket) => {
  socket.emit("viewProducts", products);

  socket.on("createProduct", (data) => {
    products.push({ ...data, id: products.length + 1 });
    socket.emit("Product list", products);
  });

  socket.on("removeProduct", (id) => {
    const filteredProducts = products.filter(
      (product) => product.id !== Number(id)
    );
    products = [...filteredProducts];
    socket.emit("Product list", filteredProducts);
  });
});
