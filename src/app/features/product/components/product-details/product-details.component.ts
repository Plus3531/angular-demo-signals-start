import { Component, Input, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent {
  @Input() product: Product | null = null;
  readonly isAuthenticated = input(false);
  @Input() error!: string | null;
  readonly loading = input(false);
  readonly addToCart = output<number>();
  readonly delete = output<number>();


  onAddToCart(productId: number): void {
    this.addToCart.emit(productId);
  }

  onDelete(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.delete.emit(productId);
    }
  }
}