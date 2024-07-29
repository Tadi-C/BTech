import { StoreService } from './../../services/store.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Product } from '../../Interfaces/Store.modal'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Timestamp } from 'firebase/firestore';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatPaginator, MatPaginatorModule, MatSortModule, MatTableModule, FormsModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [StoreService]
})
export class AdminComponent implements AfterViewInit {
showAddProductModal = false;
  name: string = "";
  category: string = "";
  brand: string = "";
  description: string = "";
  price : number = 0;
  discountPrice: number = 0;
  availability: number = 0;
  dateAdded: Timestamp = Timestamp.now();
  numberOfImages = 0;
  imageUploadDivs: any[] = [];
  images!: File;
  editMode = false;
  currentProduct: Product | null = null;
  firstImageUrl : string = ""
  tableDataSource = new MatTableDataSource<any>();
  // displayedColumns: string[] = ['Name', 'Brand', 'Price', 'Discount', 'Quantity', 'Category', 'imageData', 'actions'];
  displayedColumns: string[] = ['Name', 'Brand', 'Price', 'Discount', 'Quantity', 'Category',  'actions2', 'actions3'];
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private snackbar : MatSnackBar,
    private fb: FormBuilder,
    private storeService: StoreService
  ){}

  ngAfterViewInit(){
    this.getDefaultFileFromUrl("https://archaeology.co.uk/wp-content/themes/fox/images/placeholder.jpg", "Default Image.jpg", 'image/jpeg').then(file => {
      this.images = file;
    });




    this.getAllProducts().then((allProducts) => {
      this.tableDataSource.data = allProducts;
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }


  openAddProductModal(){
    this.showAddProductModal = true;
    console.log('Showing product');
  }

  closeAddProductModal(){
    this.showAddProductModal = false;
  }

  async addProduct() {

    this.loading = true;
    try {

      if (this.name == '' ||
        this.category == '' ||
        this.brand == '' ||
        this.description == '' ||
        this.price == 0 ||
        this.availability == 0 ||
        this.images == null || this.images == undefined
      ){
        this.snackbar.open("Please fill in all fields", "OK");
        return
      }
      const result = await this.storeService.createProduct(
        this.name,
        this.category,
        this.brand,
        this.description,
        this.price,
        this.availability,
        this.images,
        0
      );

      if (result) {
        this.snackbar.open("Product Added Successfully", "OK", { duration: 2000 });
        this.showAddProductModal = false;
        this.getAllProducts().then((allProducts) => {
      this.tableDataSource.data = allProducts;
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
      } else {
        this.snackbar.open("Failed to Add Product", "OK", { duration: 2000 });
      }
    } catch (error) {
      console.log('Error: ', error);
      this.snackbar.open("Error adding product", "OK", { duration: 2000 });
    } finally {
      this.loading = false;
      this.getAllProducts().then((allProducts) => {
      this.tableDataSource.data = allProducts;
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
    }
  }

  addImageUploadDivs() {
    this.imageUploadDivs = Array.from({ length: this.numberOfImages }, (_, index) => index);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]; // Corrected to access the first file from the files array
    if (file) {
      this.images = file;
    }
  }

  async getAllProducts(): Promise<Product[] | any[]>{
    const allProducts =await this.storeService.getAllProducts();
    if (allProducts){
      return allProducts;
    }else {
      return [];
    }
  }

  async getDefaultFileFromUrl(url: string, fileName: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: mimeType });
}

openEditProductModal(product: Product) {

  this.currentProduct = product
  console.log('Current Product: ', this.currentProduct)
  this.showAddProductModal = true;
  this.editMode = true;
  this.currentProduct = product;

  // Set all form fields from the current product
  this.name = product.Name || '';
  this.category = product.Category || '';
  this.brand = product.Brand || '';
  this.description = product.Description || '';
  this.price = product.Price || 0;
  this.discountPrice = product.Discount_Price || 0;
  this.availability = product.Availability || 0;
}



  async updateProduct() {
  if (!this.currentProduct) {
    console.error('Current product is not set');
    return;
  }

  try {
    const updatedProduct: Product = {
      Name: this.name,
      Category: this.category,
      Brand: this.brand,
      Description: this.description,
      Price: this.price,
      Discount_Price: this.discountPrice,
      Availability: this.availability,
      ID: this.currentProduct.ID,
      Date_Added: this.currentProduct.Date_Added
    };

    if (this.name == '' ||
        this.category == '' ||
        this.brand == '' ||
        this.description == '' ||
        this.price == 0 ||
        this.availability == 0 ||
        this.images == null || this.images == undefined
      ){
        this.snackbar.open("Please fill in all fields", "OK");
        return
      }



    console.log('Updated Product:', updatedProduct);

    const result = await this.storeService.updateProduct(updatedProduct);
    if (result) {
      this.snackbar.open("Product Updated Successfully", "OK", { duration: 2000 });
      this.showAddProductModal = false;
      this.refreshTable();
    } else {
      this.snackbar.open("Failed to Update Product", "OK", { duration: 2000 });
    }
  } catch (error) {
    console.error('Error updating product: ', error);
    this.snackbar.open("Error updating product", "OK", { duration: 2000 });
  }
}


   async deleteProduct(productId: string) {
    try {
      const result = await this.storeService.deleteProduct(productId);
      if (result) {
        this.snackbar.open("Product Deleted Successfully", "OK", { duration: 2000 });
        this.refreshTable();
      } else {
        this.snackbar.open("Failed to Delete Product", "OK", { duration: 2000 });
      }
    } catch (error) {
      console.log('Error: ', error);
      this.snackbar.open("Error deleting product", "OK", { duration: 2000 });
    }
  }

   refreshTable() {
    this.getAllProducts().then(allProducts => {
      this.tableDataSource.data = allProducts;
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }

  resetForm() {
    this.name = "";
    this.category = "";
    this.brand = "";
    this.description = "";
    this.price = 0;
    this.discountPrice = 0;
    this.availability = 0;
    this.images = null!;
  }


}
