import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  public title = 'nba2k-randomizer';
  public shuffleIcon = faShuffle;
  public form!: FormGroup;
  public maxValue = 29;
  public showNumOfTeams = true;
  public showSelectedTeams = false;
  public showFinalTeam = false;
  public randomlySelectedTeams: any[] = [];
  public shouldReset: boolean = false;

  public checkboxOptions: {value: string, name: string}[] = [
    { value: 'Celtics', name: 'Celtics' },
    { value: 'Bulls', name: 'Bulls' },
    { value: 'Pacers', name: 'Pacers' },
    { value: 'Bucks', name: 'Bucks' },
    { value: '76ers', name: '76ers' },
    { value: 'Jazz', name: 'Jazz' },
    { value: 'Hawks', name: 'Hawks' },
    { value: 'Rockets', name: 'Rockets' },
    { value: 'Nuggets', name: 'Nuggets' },
    { value: 'Cavaliers', name: 'Cavaliers' },
    { value: 'Clippers', name: 'Clippers' },
    { value: 'Timberwolves', name: 'Timberwolves' },
    { value: 'Lakers', name: 'Lakers' },
    { value: 'Trail Blazers', name: 'Trail Blazers' },
    { value: 'Hornets', name: 'Hornets' },
    { value: 'Grizzlies', name: 'Grizzlies' },
    { value: 'Nets', name: 'Nets' },
    { value: 'Pistons', name: 'Pistons' },
    { value: 'Warriors', name: 'Warriors' },
    { value: 'Knicks', name: 'Knicks' },
    { value: 'Thunder', name: 'Thunder' },
    { value: 'Kings', name: 'Kings' },
    { value: 'Mavericks', name: 'Mavericks' },
    { value: 'Raptors', name: 'Raptors'},
    { value: 'Heat', name: 'Heat' },
    { value: 'Wizards', name: 'Wizards' },
    { value: 'Suns', name: 'Suns' },
    { value: 'Pelicans', name: 'Pelicans' },
    { value: 'Spurs', name: 'Spurs' },
    { value: 'Magic', name: 'Magic'}
  ];

  public constructor(private fb: FormBuilder) {
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      checkboxes: this.fb.array([]),
      numOfTeams: new FormControl(3, [this.maxValidator(this.maxValue), Validators.min(0)])
    });

    this.addCheckboxes();
  }

  get checkboxes() {
    return (this.form.get('checkboxes') as FormArray);
  }

  get selectedValues() {
    return this.form.value.checkboxes
    .map((checked: any, index: any) => checked ? this.checkboxOptions[index].value : null)
    .filter((value: any) => value !== null);
  }

  private updateMaxValue(newMaxValue: number): void {
    this.maxValue = newMaxValue;
    this.form.get('numOfTeams')?.setValidators([this.maxValidator(this.maxValue), Validators.min(0)]);
    this.form.get('numOfTeams')?.updateValueAndValidity();
  }

  private addCheckboxes(): void {
    this.checkboxOptions.forEach(() => {
      this.checkboxes.push(this.fb.control(false));
    });
  }

  private getRandomTeam(options: any[], previouslyAddedOptions: any[] = []): any {
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];

    if (!previouslyAddedOptions.includes(selectedOption)) {
      return selectedOption;
    }

    return this.getRandomTeam(options, previouslyAddedOptions);
  }

  private maxValidator(maxValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value !== null && control.value > maxValue) {
        return { 'max': { value: control.value, max: maxValue } };
      }
      return null;
    };
  }

  public onSubmit() {
    if (this.form.invalid) return;

    this.shouldReset = true;

    const selectedTeams = this.selectedValues.map((value: any) => ({
      name: value
    }));
    const teamsToRandomize = this.form.get('numOfTeams')?.value ?? 1;
    var randomlySelectedTeams: any[] = [];

    if (selectedTeams.length > 0) {
      for (let i = 0; i < teamsToRandomize; i++) {
        randomlySelectedTeams.push(this.getRandomTeam(selectedTeams, randomlySelectedTeams));
      }
    }
    else {
      for (let i = 0; i < teamsToRandomize; i++) {
        randomlySelectedTeams.push(this.getRandomTeam(this.checkboxOptions, randomlySelectedTeams))
      }
    }

    this.randomlySelectedTeams = randomlySelectedTeams;
    this.showSelectedTeams = true;
  }

  public deselectAll(): void {
    this.form.reset();
  }

  public onCheckboxChange(event: MatCheckboxChange): void {
    const selectedTeams = this.selectedValues;
    this.updateMaxValue(selectedTeams.length -1);
    this.showNumOfTeams = selectedTeams.length > 1;
    this.form.get('numOfTeams')?.setValue(this.maxValue);
  }

  public finalChoice(): void {
    this.randomlySelectedTeams = [];

    const selectedTeams = this.selectedValues.map((value: any) => ({
      name: value
    }));

    if (selectedTeams.length > 0) {
      this.randomlySelectedTeams.push(this.getRandomTeam(selectedTeams));
    }
    else {
      this.randomlySelectedTeams.push(this.getRandomTeam(this.checkboxOptions));
    }
    console.log(this.randomlySelectedTeams);
    this.showSelectedTeams = false;
    this.showFinalTeam = true;
  }

  public reset(): void {
    this.randomlySelectedTeams = [];
    this.form.reset();
    this.form.get('numOfTeams')?.setValue(3);
    this.showSelectedTeams = this.showFinalTeam = this.shouldReset = false;
    
  }
}
