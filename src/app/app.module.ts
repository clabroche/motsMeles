import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { GridService } from './providers/grid.service';
import { CltOverlayModule } from 'ngx-callisto/dist';
import { WordsPipe } from './pipe/words.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WordsPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CltOverlayModule.forRoot()
  ],
  providers: [GridService],
  bootstrap: [AppComponent]
})
export class AppModule { }
