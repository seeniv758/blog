
import { useMemo, useState,useEffect } from "react";
import axios from "axios";
import "./App.css";
   const API_URL="http://localhost:8080/api/food";
const foods = [
  {
    id: 1,
    name: "Classic Burger",
    category: "Burger",
    price: 149,
    emoji: "🍔",
    description: "Juicy burger with fresh vegetables",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    emoji: "🍕",
    description: "Cheese, tomato and Italian herbs",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
  },
  {
    id: 3,
    name: "French Fries",
    category: "Snacks",
    price: 99,
    emoji: "🍟",
    description: "Crispy golden salted fries",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
  },
  {
    id: 4,
    name: "Chicken Biryani",
    category: "Biryani",
    price: 199,
    emoji: "🍛",
    description: "Aromatic biryani with Indian spices",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600",
  },
  {
    id: 5,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 119,
    emoji: "🥪",
    description: "Fresh vegetables and toasted bread",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 129,
    emoji: "🍰",
    description: "Rich and delicious chocolate cake",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
  },
];

const categories = [
  "All",
  "Burger",
  "Pizza",
  "Biryani",
  "Snacks",
  "Dessert",
];

function App() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [lastOrder, setLastOrder] = useState(null);
                  useEffect(()=>{
                    axios.get(`http://localhost:8080/get`)
                    .then(res=>setUsers(escape.data))
                    .catch(err=>console.log(err))
                  },[])
  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      category === "All" || food.category === category;

    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const deliveryCharge = subtotal === 0 || subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  function addToCart(food) {
    setMessage("");
    setLastOrder(null);

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === food.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...food, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function handleCustomerChange(event) {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCheckout(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setMessage("Please add food items to your cart.");
      return;
    }

    const order = {
      orderId: Date.now(),
      customer: { ...customer },
      items: cart.map((item) => ({ ...item })),
      subtotal,
      deliveryCharge,
      total,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    setLastOrder(order);
    setMessage(
      `Order #${order.orderId} placed successfully!`
    );
    setCart([]);
    setCustomer({ name: "", phone: "", address: "" });
    setShowCart(false);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">🍽️</span>
          <span>Food<span className="logo-highlight">ie</span></span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart <span className="cart-count">{itemCount}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">FRESH • TASTY • DELIVERED</span>
            <h1>
              Delicious food,
              <br />
              delivered <span>to you.</span>
            </h1>
            <p>
              Your favourite meals are just a few clicks away.
              Discover delicious food made with love.
            </p>
            <a className="primary-button" href="#menu">
              Order Now →
            </a>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
              alt="Freshly prepared pizza"
            />
            <div className="hero-badge">
              <span>⭐ 4.9/5</span>
              <small>Customer favourite</small>
            </div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR MENU</span>
              <h2>Explore our <span>foods</span></h2>
              <p>Choose your favourite food and enjoy!</p>
            </div>

            <div className="search-box">
              <span>🔍</span>
              <input
                type="search"
                placeholder="Search food..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="food-grid">
            {filteredFoods.map((food) => {
              const inCart = cart.find(
                (item) => item.id === food.id
              );

              return (
                <article className="food-card" key={food.id}>
                  <div className="food-image">
                    <img
                      src={food.image}
                      alt={food.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="food-emoji">{food.emoji}</span>
                  </div>

                  <div className="food-details">
                    <div className="food-category">
                      {food.category}
                    </div>
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>

                    <div className="food-bottom">
                      <strong>₹{food.price.toFixed(2)}</strong>

                      <button
                        className="add-button"
                        onClick={() => addToCart(food)}
                      >
                        {inCart ? `Add More +${inCart.quantity}` : "+ Add"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredFoods.length === 0 && (
            <p className="empty-message">
              No food items found. Try another search.
            </p>
          )}
        </section>

        <section className="checkout-section" id="checkout">
          <div className="checkout-heading">
            <span className="eyebrow">YOUR ORDER</span>
            <h2>Shopping <span>Cart</span></h2>
          </div>

          <div className="checkout-layout">
            <div className="cart-panel">
              <h3>Cart items ({itemCount})</h3>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span>🛒</span>
                  <h3>Your cart is empty</h3>
                  <p>Add delicious food from our menu!</p>
                  <a href="#menu" className="text-link">
                    Explore Menu →
                  </a>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-food-icon">
                        {item.emoji}
                      </div>

                      <div className="cart-food-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price.toFixed(2)} each</p>
                        <button
                          className="remove-button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="quantity-control">
                        <button
                          aria-label={`Decrease ${item.name}`}
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label={`Increase ${item.name}`}
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <strong className="item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="summary-panel">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Delivery charge</span>
                <span>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>

              <p className="delivery-note">
                {subtotal >= 499
                  ? "You have free delivery!"
                  : "Free delivery on orders of ₹499 or more."}
              </p>

              <div className="summary-line total-line">
                <strong>Total</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>

              <form onSubmit={handleCheckout} className="checkout-form">
                <h4>Delivery details</h4>

                <label htmlFor="customer-name">Full name</label>
                <input
                  id="customer-name"
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  placeholder="Enter your name"
                  required
                  maxLength={100}
                />

                <label htmlFor="customer-phone">Phone number</label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="Enter your phone number"
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  required
                />

                <label htmlFor="customer-address">Delivery address</label>
                <textarea
                  id="customer-address"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  placeholder="Enter your full address"
                  rows={3}
                  required
                  maxLength={255}
                />

                <button
                  type="submit"
                  className="checkout-button"
                  disabled={cart.length === 0}
                >
                  Place Order · ₹{total.toFixed(2)}
                </button>
              </form>

              {message && (
                <p
                  className={
                    lastOrder ? "success-message" : "info-message"
                  }
                  role="status"
                >
                  {message}
                </p>
              )}

              {lastOrder && (
                <div className="order-confirmation">
                  <h4>Order confirmation</h4>
                  <p>Order ID: {lastOrder.orderId}</p>
                  <p>Customer: {lastOrder.customer.name}</p>
                  <p>Total: ₹{lastOrder.total.toFixed(2)}</p>
                  <p>Status: {lastOrder.status}</p>
                  <p className="order-date">{lastOrder.date}</p>
                  <p className="delivery-note">
                    Demo order only. It has not yet been saved to MySQL.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <span>🍴 Made with love</span>
          <h2>Good food, good mood.</h2>
          <p>Fresh flavours. Simple ordering. Happy customers.</p>
        </section>
      </main>

      {showCart && (
        <div className="cart-toast" role="status">
          <strong>Your cart</strong>
          <p>{itemCount} item(s) · ₹{total.toFixed(2)}</p>
          <button
            className="primary-button"
            onClick={() => {
              setShowCart(false);
              document
                .getElementById("checkout")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Cart & Checkout
          </button>
          <button
            className="close-cart"
            onClick={() => setShowCart(false)}
          >
            Close
          </button>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 Foodie. Built with React.</p>
      </footer>
    </div>
  );
}

export default App;

