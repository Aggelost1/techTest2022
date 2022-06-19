import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

import { loadGroups, loadMeasurments, loadTeamList } from '../state/dashboard.actions';

import { DashboardFlags, DashboardGroup, Measurements, Team } from './dashboard.interface';
import { Store } from '@ngrx/store';
import { selectFlags, selectGroups, selectMeasurements, selectTeamsData } from '../state/dashboard.selectors';
import { Observable, Subscription } from 'rxjs';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit, OnDestroy {

  groupsSubscription: Subscription | undefined;
  measurementsSubscription: Subscription | undefined;

  teamsData$: Observable<Team[]> = this.store.select(selectTeamsData);
  groups$: Observable<readonly DashboardGroup[]> = this.store.select(selectGroups);
  measurements$: Observable<readonly Measurements[]> = this.store.select(selectMeasurements);
  flags$: Observable<DashboardFlags> = this.store.select(selectFlags);


  constructor(private store: Store) { }

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective | undefined;

  public selectedGroup: string = '';
  public selectedMeasurement: string = '';
  public errorMesage = 'There was an error getting your data please try again later';

  public ngOnInit(): void {
    this.initiateData();
    this.subscribeToChanges();
  }

  public ngOnDestroy(): void {
    this.killSubscriptions();
  }

  killSubscriptions() {
    this.groupsSubscription?.unsubscribe();
    this.measurementsSubscription?.unsubscribe();
  }


  initiateData() {
    this.getGroupsOptions();
  }

  // TODO1 : set up selected group and selected measurment in store so we no longer need the subscriptions
  subscribeToChanges() {
    this.groupsSubscription = this.groups$.subscribe((groups) => {
      if (groups[0]) {
        this.setSelectedGroup(groups[0].url);
      } else {
        this.setSelectedGroup('');
      }
    });

    this.measurementsSubscription = this.measurements$.subscribe((measurements) => {
      this.selectedMeasurement = measurements[0]?.url || '';
    })
  }

  getGroupsOptions() {
    this.store.dispatch(loadGroups());
  }

  setSelectedGroup(value: string) {
    this.selectedGroup = value;
    this.groupChanged(this.selectedGroup);
  }

  getMeasurmentOptions() {
    this.store.dispatch(loadMeasurments({ group: this.selectedGroup }));
  }

  groupChanged(event?: any) {
    this.getMeasurmentOptions();
  }

  onSearch() {
    if (!this.selectedGroup || !this.selectedMeasurement) {
      return
    }

    this.store.dispatch(loadTeamList({ measurement: this.selectedMeasurement, group: this.selectedGroup }));
  }

}
