import { Component } from '@angular/core';
import { Product } from '../../Interfaces/Store.modal';
import { CartService } from './../../services/cart.service'; // Import the CartService
import { StoreService } from './../../services/store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [StoreService, CartService]
})
export class CartComponent {
  cartItems: Product[] = [];
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

}
