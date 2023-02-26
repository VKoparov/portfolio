import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private url = "https://mailthis.to/valentin.koparov.dev"

  constructor(
    private httpClient: HttpClient
  ) {
  }

  sendEmail(body: any): void {
    this.httpClient.post(this.url, body, { responseType: 'text' })
      .subscribe(() => {
        window.location.href = 'https://mailthis.to/confirm'
      });
  }
}
