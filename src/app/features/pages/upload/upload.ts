import { Component, inject } from '@angular/core';
import { Auth } from '../../../shared/services/auth';
import { Storage } from '../../../shared/services/storage';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user-service';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.html',
  styleUrl: './upload.css'
})
export class Upload {

  storageService = inject(Storage);
  authService = inject(Auth);
  userService = inject(UserService);
  router = inject(Router);

  onUploadImage(event:Event){
    let inputFile = event.target as HTMLInputElement;
    if(!inputFile.files || inputFile.files.length <= 0){
      return;
    }

    const imageFile = inputFile.files[0];
    const username = this.authService.getUserLogged().username;
    //Swal.showLoading()
    this.storageService.uploadFile(imageFile, username)
    .then(response=>{
      response = {} as typeof response; 
      if(response && response.data){
        const url = this.storageService.getImageUrl(response.data.fullPath);
        
        this.userService.saveImage(username, url);
        Swal.close();
        
      }else if(response){
        console.log(response.error)
        Swal.fire({
          toast: true,
          position: 'top-end', 
          icon: 'error',
          title: 'Error, no se pudo subir la imagen',
          showConfirmButton: false,
          timer: 3000,
          didOpen: () => {
            Swal.showLoading();
          }
        });
      }
      });

      this.router.navigate(['home']);
  
  }
}
