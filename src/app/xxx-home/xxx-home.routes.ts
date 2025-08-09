import { Route } from "@angular/router";
import { XxxHomeComponent } from "./xxx-home.component";

export const xxxHomeRoutes: Route[] = [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        component: XxxHomeComponent,
      }
    ],
  },
];
