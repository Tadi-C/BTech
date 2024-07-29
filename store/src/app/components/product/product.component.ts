import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../Interfaces/Store.modal';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { StoreService } from '../../services/store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [StoreService]
})
export class ProductComponent implements OnInit {
  @Input() product!: Product ;
  ProductImage: string = ''

  constructor( private router : Router,
    private storeService: StoreService,
    private cartService: CartService,
    private snackbar:MatSnackBar,
  ) { }

  // OnViewProduct(){
  //   if (this.product != null) {
  //     localStorage.setItem("selectedProductId", this.product.ID.toString() )
  //   this.router.navigate(["Product"])
  //   }
  // }

  ngOnInit(): void {
      this.getProductImage();

  }

  getProductImage(){
    this.storeService.getProductImages(this.product.ID).then((allImages) => {
      this.ProductImage = allImages
        })
  }

  // Method to handle adding to cart
   addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackbar.open("Added to cart", "Ok", {duration: 200})
  }

  viewProduct(product: Product){
    localStorage.setItem('selectedProduct', JSON.stringify(product))
    localStorage.setItem('selectedProductImage', this.ProductImage)
    this.router.navigate(['Product'])
  }


}
