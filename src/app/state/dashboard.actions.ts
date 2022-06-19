// in a production codebase this would have a more discriptive name (refering to the actuall data) like managment info or yearly spending .... instead of dashboard
import { createAction, props } from "@ngrx/store";

import { DashboardGroup, Measurements, Team } from "../dashboard/dashboard.interface"

export const loadTeamList =
    createAction(
        '[Dashboard] load Teams',
        props<{ measurement: string, group: string }>()
    );

export const retrievedTeamList =
    createAction(
        '[Dashboard] Retrieve Teams Success',
        props<{ teamsData: Team[] }>()
    );

export const retrievedTeamListFailure =
    createAction(
        '[Dashboard] Retrieve Teams Failed',
    );

export const loadMeasurments =
    createAction(
        '[Dashboard] load Measurments',
        props<{ group: string }>()
    );

export const retrievedMeasurementList =
    createAction(
        '[Dashboard] Retrieve Measurments Success',
        props<{ measurements: ReadonlyArray<Measurements> }>()
    );

export const retrievedMeasurementListFailure =
    createAction(
        '[Dashboard] Retrieve Measurments Failed'
    );


export const loadGroups =
    createAction(
        '[Dashboard] load Groups',
    );

export const retrievedGroupList =
    createAction(
        '[Dashboard] Retrieve Groups Success',
        props<{ groups: ReadonlyArray<DashboardGroup> }>()
    );

export const retrievedGroupListFailure =
    createAction(
        '[Dashboard] Retrieve Groups Failed',
    );


