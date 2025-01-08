import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  count: number = 1;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  };
  recommendedProducts: ProductType[] = [];
  productDetail!: ProductType;
  serverStaticPath: string = environment.serverStaticPath;
  isLoggedIn: boolean = false;

  constructor(private productService: ProductService, private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favoriteService: FavoriteService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.productService.getProduct(params['url'])
          .subscribe((data: ProductType) => {
            this.productDetail = data;
            this.cartService.getCart()
              .subscribe((cartData: CartType | DefaultResponseType) => {
                if ((cartData as DefaultResponseType).error !== undefined) {
                  throw new Error((cartData as DefaultResponseType).message);
                }
                const cartDataResponse = cartData as CartType;
                if (cartDataResponse) {
                  const productInCart = cartDataResponse.items.find(item => item.product.id === this.productDetail.id);
                  if (productInCart) {
                    this.productDetail.countInCart = productInCart.quantity;
                    this.count = this.productDetail.countInCart;
                  }
                }
              });
            if (this.isLoggedIn) {
              this.favoriteService.getFavorites()
                .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    throw new Error(error);
                  }
                  const products = data as FavoriteType[];
                  const currentProductExists = products.find(item => item.id === this.productDetail.id);
                  if (currentProductExists) {
                    this.productDetail.isInFavorite = true;
                  }
                });
            }
          });
      }
    });

    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data;
        if (this.isLoggedIn) {
          this.favoriteService.getFavorites()
            .subscribe((data: FavoriteType[] | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                const error = (data as DefaultResponseType).message;
                throw new Error(error);
              }
              const favoritesProducts = data as FavoriteType[];
              this.recommendedProducts = this.recommendedProducts.map( product => {
                const currentProductExists = favoritesProducts.find( item => item.id === product.id);
                if (currentProductExists) {
                  product.isInFavorite = true;
                }
                return product;
              });
            });
        }
      });
  };

  updateCount(value: number) {
    this.count = value;
    if (this.productDetail.countInCart) {
      this.cartService.updateCart(this.productDetail.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.productDetail.countInCart = this.count;
        });
    }
  };
  addToCart() {
    this.cartService.updateCart(this.productDetail.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.productDetail.countInCart = this.count;
      });
  };
  removeFromCart() {
    this.cartService.updateCart(this.productDetail.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.productDetail.countInCart = 0;
        this.count = 1;
      });
  };
  updateFavorite() {
    if (!this.isLoggedIn) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');
      return;
    }
    if (this.productDetail.isInFavorite) {
      this.favoriteService.removeFavorites(this.productDetail.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open('Во время получения ответа произошла ошибка');
            throw new Error(data.message);
          }

          this.productDetail.isInFavorite = false;
        });
    } else {
      this.favoriteService.addFavorites(this.productDetail.id)
        .subscribe((data: DefaultResponseType | FavoriteType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            this._snackBar.open((data as DefaultResponseType).message);
            throw new Error((data as DefaultResponseType).message);
          }
          this.productDetail.isInFavorite = true;
        });
    }
  };
}
