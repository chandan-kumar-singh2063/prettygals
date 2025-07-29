// Example usage in your auth pages or payment pages:

// 1. LOGIN PAGE EXAMPLE:
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useApp();
  const { showSuccess, showError } = useToast();

  const handleLogin = async (formData) => {
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showSuccess(`Welcome back, ${formData.email}!`);
      // Redirect to dashboard
    } else {
      showError(result.message || 'Login failed');
    }
  };
}

// 2. REGISTRATION PAGE EXAMPLE:
import { useToast } from '../../context/ToastContext';

export default function RegisterPage() {
  const { register } = useApp();
  const { showSuccess, showError, showInfo } = useToast();

  const handleRegister = async (formData) => {
    const result = await register(formData);
    
    if (result.success) {
      showSuccess('Account created successfully! Please login.');
      showInfo('Check your email for verification instructions.');
      // Redirect to login
    } else {
      showError(result.message || 'Registration failed');
    }
  };
}

// 3. PAYMENT PAGE EXAMPLE:
import { useToast } from '../../context/ToastContext';

export default function PaymentPage() {
  const { showSuccess, showError, showWarning } = useToast();

  const handlePayment = async (paymentData) => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        showSuccess('Payment successful! Order confirmed.');
        showInfo(`Order ID: ${result.orderId}`);
        // Redirect to order confirmation
      } else {
        showError(result.message || 'Payment failed');
      }
    } catch (error) {
      showError('Payment processing error. Please try again.');
    }
  };

  const handleFormValidation = (errors) => {
    if (errors.length > 0) {
      showWarning('Please fill in all required fields');
    }
  };
}

// 4. CART PAGE EXAMPLE:
import { useToast } from '../../context/ToastContext';

export default function CartPage() {
  const { removeFromCart, updateCartQuantity, clearCart } = useApp();
  const { showSuccess, showInfo, showWarning } = useToast();

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      showInfo('Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      showSuccess('Cart cleared successfully');
    }
  };

  const handleQuantityUpdate = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      showWarning('Quantity cannot be zero. Item will be removed.');
      handleRemoveItem(productId);
      return;
    }
    
    const result = await updateCartQuantity(productId, newQuantity);
    if (result.success) {
      showSuccess('Quantity updated');
    }
  };
}

// 5. NAVBAR LOGOUT EXAMPLE:
import { useToast } from '../../context/ToastContext';

export default function Navbar() {
  const { logout, user } = useApp();
  const { showInfo } = useToast();

  const handleLogout = async () => {
    await logout();
    showInfo(`Goodbye, ${user?.name}! Come back soon.`);
  };
}
