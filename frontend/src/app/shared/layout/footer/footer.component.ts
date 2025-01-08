import { CategoryWithTypeType } from './../../../../types/category-with-type.type';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: false,
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  @Input() categories: CategoryWithTypeType[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
