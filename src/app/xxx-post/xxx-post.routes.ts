import {Route} from "@angular/router";
import {XxxPostComponent} from "./xxx-post.component";
import {XxxPostEditComponent} from "./xxx-post-edit/xxx-post-edit.component";

export const xxxPostRoutes: Route[] = [
    {
        path: '',
        providers: [
        ],
        children: [
            {
                path: '',
                component: XxxPostComponent,
            },
            {
                path: 'edit',
                component: XxxPostEditComponent,
            },
        ],
    },
];
