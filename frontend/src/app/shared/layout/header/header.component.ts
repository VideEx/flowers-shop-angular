import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  searchField = new FormControl();
  showedSearch: boolean = false;
  //searchValue: string = '';
  products: ProductType[] = [];
  isLogged: boolean = false;

  @Input() categories: CategoryWithTypeType[] = [];
  count: number = 0;
  serverStaticPath = environment.serverStaticPath;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
              private router: Router, private cartService: CartService,
              private productService: ProductService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 1) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
        } else {
          this.products = [];
        }
      });

   this.getCountCart();
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getCountCart();
    });

    this.cartService.count$.subscribe(count => this.count = count);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      }
    });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    //this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  }

  //отследить клик на странице и закрыть меню поиска
  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
      //this.searchValue = '';
      this.searchField.setValue('');
    }
  }

}
