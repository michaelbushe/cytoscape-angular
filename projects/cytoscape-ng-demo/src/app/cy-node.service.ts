import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CyNodeService {

  constructor(public http: HttpClient) { }

  getData(name):Observable<any> {
    return this.http.get('assets/' + name + '.cyjs')
  }

  getStylesheet(name):Observable<any> {
    return this.http.get('assets/' + name + '.json')
  }
}
