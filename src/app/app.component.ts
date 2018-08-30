import { Component, OnInit, ViewChild } from '@angular/core';
import { GridService } from './providers/grid.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CltThemeService, CltPopupComponent } from 'ngx-callisto/dist';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedLetter;
  gridForm: FormGroup;
  @ViewChild('warningPopup') warningPopup: CltPopupComponent;
  @ViewChild('settingsPanel') settingsPanel: CltPopupComponent;
  constructor(public gridService: GridService, private fb: FormBuilder, theme: CltThemeService) { }
  ngOnInit() {
    this.gridForm = this.fb.group({
      width: [5, [Validators.required]],
      height: [5, [Validators.required]],
      hidden: [true, [Validators.required]]
    });
    this.generate();
  }

  generate() {
    this.gridService.generateGrid(this.gridForm.value.width, this.gridForm.value.height, this.gridForm.value.hidden);
  }
  select(letter) {
    if (this.selectedLetter) {
      this.gridService.selectWord(this.selectedLetter, letter);
      letter.selected = false;
      this.selectedLetter.selected = false;
      this.selectedLetter = null;
    } else {
      letter.selected = true;
      this.selectedLetter = letter;
    }
  }

  warn() {
    this.settingsPanel.close();
    this.warningPopup.open().subscribe(result => {
      if (!result) return;
      this.generate();
    });
  }
}
