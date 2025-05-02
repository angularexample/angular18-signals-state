import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {XxxContent} from "./xxx-content.types";

@Injectable({
    providedIn: 'root'
})
export class XxxContentFacadeService {
    isContentEmpty$ = (key: string): Observable<boolean> => of(false);
    isContentError$ = (key: string): Observable<boolean> => of(false);
    isContentLoading$ = (key: string): Observable<boolean> => of(false);
    contentByKey$ = (key: string): Observable<XxxContent | undefined> => of(undefined);

    getContent(key: string): void {
    }
}
