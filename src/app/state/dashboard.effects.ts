import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard/dashboard.service';
import { loadGroups, loadMeasurments, loadTeamList, retrievedGroupList, retrievedGroupListFailure, retrievedMeasurementListFailure, retrievedMeasurementList, retrievedTeamList, retrievedTeamListFailure } from './dashboard.actions';
import { selectFlags } from './dashboard.selectors';

@Injectable()
export class DashBoardEffects {

  // TODO1: add guards to not call apis if isLoading is true 
  loadteams$ = createEffect(() => this.actions$.pipe(
    ofType(loadTeamList),
    exhaustMap((action) => {
      if (!action.group || !action.measurement) {
        return EMPTY
      }
      return this.dashboardService.getDashboardData(action.group, action.measurement)
        .pipe(
          map(teamsData => (retrievedTeamList({ teamsData }))),
          catchError((err) => of(retrievedTeamListFailure()))
        )
    })
  )
  );

  // TODO1: add guards to not call apis if isLoading is true 
  loadMeasurments$ = createEffect(() => this.actions$.pipe(
    ofType(loadMeasurments),
    concatLatestFrom((action) => this.strore.select(selectFlags)),
    exhaustMap(([action, flags]) => {
      if (!action.group) {
        return EMPTY
      }
      return this.dashboardService.getMeasurmentData(action.group)
        .pipe(
          mergeMap(measurements => {
            if (measurements[0] && !flags.hasLoadedTeams) {
              return [retrievedMeasurementList({ measurements }), loadTeamList({ measurement: measurements[0]?.url, group: action.group })]
            }
            return [retrievedMeasurementList({ measurements })];
          }),
          catchError((err) => of(retrievedMeasurementListFailure()))
        )
    }
    ))

  );

  // TODO1: add guards to not call apis if isLoading is true 
  loadGroups$ = createEffect(() => this.actions$.pipe(
    ofType(loadGroups),
    exhaustMap((action) => {

      return this.dashboardService.getGroupsOptions()
        .pipe(
          map(groups => (retrievedGroupList({ groups }))),
          catchError((err) => of(retrievedGroupListFailure()))
        )
    })
  )
  );


  constructor(
    private actions$: Actions,
    private strore: Store,
    private dashboardService: DashboardService
  ) { }
}