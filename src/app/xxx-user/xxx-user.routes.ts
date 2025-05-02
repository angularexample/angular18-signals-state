import {Route} from "@angular/router";
import {XxxUserComponent} from "./xxx-user.component";

export const xxxUserRoutes: Route[] = [
    {
        path: '',
        providers: [
        ],
        children: [
            {
                path: '',
                component: XxxUserComponent,
            }
        ],
    },
];
