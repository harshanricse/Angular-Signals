import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../product';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-selection',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './product-selection.html',
  styleUrl: './product-selection.css'
})
export class ProductSelection {
  pageTitle = 'Product Selection';
  private productService = inject(ProductService)

  selectedProduct = signal<Product | undefined>(undefined);
  quantity = linkedSignal({
    source: this.selectedProduct,
    computation: p => 1
  });

  //use this way, when the user navigates to the products-list component the http call is made
  // and when the user moves away from the products-list component, the data is destroyed
  //productsResource = this.productService.createProducts();
  products = this.productService.productsResource.value;
  isLoading = this.productService.productsResource.isLoading;
  error = this.productService.productsResource.error;
  errorMessage = computed(()=> this.error()?this.error()?.message: '');

  total = computed(()=> (this.selectedProduct()?.price ?? 0) * this.quantity());
  color = computed(()=> this.total() >= 200 ? 'green' : 'blue')

  onIncrease(){
    this.quantity.update((q)=> q + 1);
  }

  onDecrease(){
    this.quantity.update((q)=> q - 1 <=0 ? 0 : q-1);
  }

  // use an effect to log a signal's value
  qtyEffect = effect(()=> console.log('quantity',this.quantity()));

}
