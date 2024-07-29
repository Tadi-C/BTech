import { Injectable } from '@angular/core';
import { getDoc, doc, collection, getDocs, updateDoc, setDoc, where, query, Timestamp, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Product } from '../Interfaces/Store.modal';
import { db, storage } from '../firebaseConfig';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  Categories: Set<string> = new Set();
  Brands:Set<string>= new Set();

  constructor() { }

  async createProduct(
    name: string,
    category: string,
    brand: string,
    description: string,
    price: number,
    availability: number,
    ProductImageFiles: File,
    discountPrice: number = 0
  ): Promise<boolean> {
    const docRef = doc(collection(db, 'products'));
    const newProduct: Product = {
      ID: docRef.id,
      Name: name,
      Category: category,
      Brand: brand,
      Description: description,
      Price: price,
      Discount_Price: discountPrice,
      Availability: availability,
      Date_Added: Timestamp.now()
    };

    try {
      await setDoc(docRef, newProduct);
      const imagesResult = await this.createProductImages(ProductImageFiles, docRef.id);
      return imagesResult;
    } catch (error) {
      console.log("Error creating product: ", error);
      return false;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    const collectionRef = collection(db, 'products');
    try {
      const allProducts = await getDocs(collectionRef);
      const allFoundProducts: Product[] = [];

      allProducts.forEach((foundProduct) => {
        const thisProduct = foundProduct.data();
        const productObject = {
          ID: thisProduct['ID'],
          Name: thisProduct['Name'],
          Description: thisProduct['Description'],
          Category: thisProduct['Category'],
          Brand: thisProduct['Brand'],
          Availability: thisProduct['Availability'],
          Price: thisProduct['Price'],
          Discount_Price: thisProduct['Discount_Price'],
          Date_Added: thisProduct['Date_Added']
        };
        allFoundProducts.push(productObject);

        // Ensure Categories and Brands are added to Sets
        if (!this.Categories.has(productObject.Category)) {
          this.Categories.add(productObject.Category);
        }

        if (!this.Brands.has(productObject.Brand)) {
          this.Brands.add(productObject.Brand);
        }
      });

      return allFoundProducts;
    } catch (error) {
      console.log("Error getting all products: ", error);
      return [];
    }
  }

  async createProductImages(productImages: File, productId: string): Promise<boolean> {
    try {
      const storageRef = ref(storage, `products/${productId}/image.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, productImages);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Optional: Track the progress of the upload
          },
          (error) => {
            console.log('Upload error:', error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            console.log('Upload complete for image:', productImages.name);
            resolve();
          }
        );
      });

      console.log('All images uploaded successfully');
      return true;

    } catch (error) {
      console.error('Failed to upload images:', error);
      return false;
    }
  }

  async getProductImages(productId: string): Promise<string> {
    let imageUrl = '';

    try {
      const imageRef = ref(storage, `products/${productId}/image.jpg`);

      try {
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        // If the error is a 'storage/object-not-found', it means there are no more images
        return '';
      }

      return imageUrl;

    } catch (error) {
      console.error('Failed to retrieve images:', error);
      return '';
    }
  }

  async updateProduct(product: Product): Promise<boolean> {
    const productDocRef = doc(db, 'products', product.ID);
    try {
      await updateDoc(productDocRef, {
        Name: product.Name,
        Category: product.Category,
        Brand: product.Brand,
        Description: product.Description,
        Price: product.Price,
        Discount_Price: product.Discount_Price,
        Availability: product.Availability,
        Date_Added: product.Date_Added // Optional: keep original date
      });
      return true;
    } catch (error) {
      console.error('Error updating product: ', error);
      return false;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Error deleting product: ", error);
      return false;
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    const productDocRef = doc(db, 'products', productId);
    try {
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        const productData = productDoc.data();
        const product: Product = {
          ID: productData['ID'],
          Name: productData['Name'],
          Category: productData['Category'],
          Brand: productData['Brand'],
          Description: productData['Description'],
          Price: productData['Price'],
          Discount_Price: productData['Discount_Price'],
          Availability: productData['Availability'],
          Date_Added: productData['Date_Added']
        };
        return product;
      } else {
        console.log("No such product found!");
        return null;
      }
    } catch (error) {
      console.error("Error getting product: ", error);
      return null;
    }
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    const collectionRef = collection(db, 'products');
    const q = query(collectionRef, where('Brand', '==', brand));

    try {
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Product;
        products.push(data);
      });
      return products;
    } catch (error) {
      console.error('Error getting products by brand:', error);
      return [];
    }
  }



  async getProductsByCategories(category: string): Promise<Product[]> {
    const collectionRef = collection(db, 'products');
    const q = query(collectionRef, where('Category', '==', category));

    try {
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Product;
        products.push(data);
      });
      return products;
    } catch (error) {
      console.error('Error getting products by brand:', error);
      return [];
    }
  }

  getAllCategories(): string[] {
    return Array.from(this.Categories)
  }

  getAllBrands(): string[]{
    return Array.from(this.Brands)
  }
}
