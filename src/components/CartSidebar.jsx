import { useCart } from '../App'
import './CartSidebar.css'

export default function CartSidebar({ open, onClose }) {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart()

  return (
    <>
      <div className={`cart-overlay ${open ? 'cart-overlay--visible' : ''}`} onClick={onClose} />
      <aside className={`cart-sidebar ${open ? 'cart-sidebar--open' : ''}`}>
        <div className="cart-sidebar__header">
          <h2>Your Cart 🛒</h2>
          <button className="cart-sidebar__close" onClick={onClose} id="cart-close-btn">✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-sidebar__empty">
            <div className="cart-empty-icon">🏋️</div>
            <p>Your cart is empty!</p>
            <small>Add some gear to get started.</small>
          </div>
        ) : (
          <>
            <div className="cart-sidebar__items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__img" style={{ background: item.color }}>
                    <span>{item.emoji}</span>
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">${(item.price * item.qty).toFixed(2)}</p>
                    <div className="cart-item__controls">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="qty-btn">−</button>
                      <span className="qty-display">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="qty-btn">+</button>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>🗑</button>
                </div>
              ))}
            </div>

            <div className="cart-sidebar__footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-subtotal cart-tax">
                <span>Shipping</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="cart-divider" />
              <div className="cart-total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="btn-primary cart-checkout-btn" id="checkout-btn">
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
