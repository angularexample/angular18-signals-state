import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {XxxUser} from "./xxx-user.types";

@Injectable({
    providedIn: 'root'
})
export class XxxUserFacadeService {
    isUsersEmpty$: Observable<boolean> = of(false);
    isUsersLoaded$: Observable<boolean> = of(false);
    isUsersLoading$: Observable<boolean> = of(false);
    selectedUserId$: Observable<number | undefined> = of(undefined);
    users$: Observable<XxxUser[]> = of([]);

    showUsers(): void {
    }

    selectUser(userId: number): void {
    }
}
