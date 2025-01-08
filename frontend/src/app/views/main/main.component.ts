import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../shared/services/product.service";
import {ProductType} from "../../../types/product.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {AuthService} from "../../core/auth/auth.service";
import {FavoriteService} from "../../shared/services/favorite.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  standalone: false
})
export class MainComponent implements OnInit {
  bestProducts: ProductType[] = [];
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
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    margin: 26,
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
      }
    },
    nav: false
  };
  isLoggedIn: boolean = false;
  reviews = [
    {
      name: 'Ирина',
      image: 'Review-5.jpg',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
    },
    {
      name: 'Анастасия',
      image: 'Review-6.jpg',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      name: 'Илья',
      image: 'Review-7.jpg',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      name: 'Аделина',
      image: 'Review-1.jpg',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию'
    },
    {
      name: 'Яника',
      image: 'Review-2.jpg',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Марина',
      image: 'Review-3.jpg',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: 'Станислав',
      image: 'Review-4.jpg',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    }
  ];

  constructor(private productService: ProductService, private authService: AuthService, private favoriteService: FavoriteService) {
  };

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
          this.bestProducts = data;
          if (this.isLoggedIn) {
            this.favoriteService.getFavorites()
              .subscribe((data: FavoriteType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  const error = (data as DefaultResponseType).message;
                  throw new Error(error);
                }
                const favoritesProducts = data as FavoriteType[];
                this.bestProducts = this.bestProducts.map(product => {
                  const currentProductExists = favoritesProducts.find(item => item.id === product.id);
                  if (currentProductExists) {
                    product.isInFavorite = true;
                  }
                  return product;
                });
              });
          }
        },
      );
  };
}
