import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordRepeatDirective} from "./directives/password-repeat.directive";
import {RouterModule} from "@angular/router";
import {ProductCardComponent} from "./components/product-card/product-card.component";
import {CountSelectorComponent} from "./components/count-selector/count-selector.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {CategoryFilterComponent} from "./components/category-filter/category-filter.component";
import {LoaderComponent} from "./components/loader/loader.component";


@NgModule({
  declarations: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CountSelectorComponent,
    CategoryFilterComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  exports: [
    PasswordRepeatDirective,
    ProductCardComponent,
    CountSelectorComponent,
    CategoryFilterComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
