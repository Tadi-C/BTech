import { Component, OnInit } from '@angular/core';
import { Product } from '../../Interfaces/Store.modal';
import { StoreService } from '../../services/store.service';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinebreacksPipe } from '../../pipes/linebreacks.pipe';

@Component({
  selector: 'app-viewproduct',
  standalone: true,
  imports: [CommonModule , LinebreacksPipe],
  templateUrl: './viewproduct.component.html',
  styleUrl: './viewproduct.component.scss',
  providers: [StoreService],

})
export class ViewproductComponent implements OnInit{

  selectedProduct!: Product;
  amount : number = 1;
  ProductImg : string = '';
  currentIndex = 0;
  prodImgs: string[] = []

  ngOnInit(): void {
    this.getProduct()
  }

  constructor (
    private storeService: StoreService,
    private cartService : CartService,
    private snackbar : MatSnackBar,
    private router: Router
  )
{

}
  getProduct(){
    const productString = localStorage.getItem('selectedProduct');
    const productImage = localStorage.getItem('selectedProductImage')
    const product : Product = JSON.parse(productString ?? '')
    this.selectedProduct = product
    this.ProductImg = productImage ?? ''
  }



    addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackbar.open("Added to cart", "Ok", {duration: 200})
  }

  goToPage(page: string){
    this.router.navigate([page])
  }

}
