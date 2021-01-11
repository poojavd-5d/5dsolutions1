import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
//import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = `${environment.apiBaseUrl}/fileupload`;
 // private handleError: HandleError;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  redirectUrl: string;

  constructor(
    private http: HttpClient,
   // private httpErrorHandler: HttpErrorHandler
  ) {
    //this.handleError = this.httpErrorHandler.createHandleError('FileUploadService')
  }

  fileUpload(formData: any) {debugger

    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(
      map(event => this.getEventMessage(event)),
      //catchError()
    );
  }

  private getEventMessage(event: HttpEvent<any>) {debugger
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
      case HttpEventType.Response:
        return event.body;
      default:
        return `Upload event: ${event.type}.`;
        
    }
  }

  private fileUploadProgress(event: any) {debugger
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { progress: percentDone, files: [] };
  }


  
}