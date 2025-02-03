import { Component, Input, numberAttribute, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { ProductService } from '../../../../services/product.service';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../services/auth.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-details-container',
  imports: [CommonModule, ProductDetailsComponent],
  template: `
    <app-product-details
      [product]="product$ | async"
      [error]="error"
      [loading]="loading"
      [isAuthenticated]="(authState$ | async)?.isAuthenticated || false"
      (addToCart)="onAddToCart($event)"
      (delete)="onDelete($event)">
    </app-product-details>
  `
})
export class ProductDetailsContainerComponent {
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  product$!: Observable<Product>;
  authState$ = this.authService.getAuthState();
  error: string | null = null;
  loading: boolean = false;

  @Input({ transform: numberAttribute })
  set id(productId: number)
  {
    this.loading = true;
    this.product$ = this
      .productService
      .getProduct(productId)
      .pipe(
        catchError(error => {
          this.error = error.message || "Failed to load product";
          return EMPTY;
        }),
        finalize(() => this.loading = false)
      )
  }

  onAddToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  onDelete(productId: number): void {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
  }
}