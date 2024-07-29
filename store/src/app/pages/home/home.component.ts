import { Product } from './../../Interfaces/Store.modal';
import { StoreService } from './../../services/store.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatGridListModule} from '@angular/material/grid-list';
import { ProductComponent } from '../../components/product/product.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

const ROWS_HEIGHT : {[id:number] : number} = {1: 400, 3:335, 4:350};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ MatExpansionModule,
    MatSidenavModule,
    MatMenuModule,
    ProductComponent,
    MatGridListModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [StoreService]
})
export class HomeComponent {
  cols = 5;
  rowHeight= ROWS_HEIGHT[this.cols]

  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: string[] = [];
  categories: string[] = [];
  brandFilter: string = '';
  categoryFilter: string = '';

   constructor(
    private storeService: StoreService
  ){}


  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.products = await this.storeService.getAllProducts();
    this.filteredProducts = this.products;
    this.brands = this.storeService.getAllBrands();
    this.categories = this.storeService.getAllCategories();
  }

  onBrandFilterChange(event: any): void {
    this.brandFilter = event.target.value;
    this.applyFilters();
  }

  onCategoryFilterChange(event: any): void {
    this.categoryFilter = event.target.value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const brandMatch = this.brandFilter ? product.Brand === this.brandFilter : true;
      const categoryMatch = this.categoryFilter ? product.Category === this.categoryFilter : true;
      return brandMatch && categoryMatch;
    });
  }




}
