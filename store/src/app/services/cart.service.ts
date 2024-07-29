import { Injectable } from '@angular/core';
import { Product } from '../Interfaces/Store.modal';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'shopping_cart';

  constructor() {}

  getCart(): Product[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product): void {
    const cart = this.getCart();
    cart.push(product);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  removeFromCart(productId: string): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(item => item.ID !== productId);
    localStorage.setItem(this.cartKey, JSON.stringify(updatedCart));
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }
}
