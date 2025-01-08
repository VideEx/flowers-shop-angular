import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.less'],
  standalone: false
})
export class FavoriteComponent implements OnInit {
  products: FavoriteType[] = [];
  serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService, private cartService: CartService) {
  };

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];
        if (this.products && this.products.length > 0) {
          this.cartService.getCart()
            .subscribe((dataCart: CartType | DefaultResponseType) => {
              if ((dataCart as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }
              this.products = this.products.map( product => {
                const productInCart = (dataCart as CartType).items.find( item => item.product.id === product.id);
                if(productInCart) {
                  product.countInCart = productInCart.quantity;
                }
                return product;
              });
            });
        }
      });
  };

  removeFromFavorites(id:string) {
    this.favoriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          //...
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      });
  };

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.products = this.products.map( product => {
          if ( product.id === id) {
            delete product.countInCart;
          }
          return product;
        });
      });
  };

  updateCount(value: number, id: string) {
    this.cartService.updateCart(id, value)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.products = this.products.map( product => {
          if ( product.id === id) {
            product.countInCart = value;
          }
          return product;
        });
      });
  };

  addToCart(id: string) {
    this.cartService.updateCart(id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.products = this.products.map( product => {
          if ( product.id === id) {
            product.countInCart = 1;
          }
          return product;
        });
      });
  };
}
