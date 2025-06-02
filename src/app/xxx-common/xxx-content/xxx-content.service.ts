import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {XxxContentApi} from "./xxx-content.types";

@Injectable({
  providedIn: 'root'
})
export class XxxContentService {
  private http: HttpClient = inject(HttpClient);

  /**
   * Get content for a given page or section.
   * @param key Key to desired content data. In this simple implementation, it is used as the filename for reading a JSON file.
   * Example "home" will get content from home.json
   */
  getContent(key: string): Observable<XxxContentApi> {
    const url = `/data/content/${key}.json`;
    return this.http.get<XxxContentApi>(url);
  }
}
