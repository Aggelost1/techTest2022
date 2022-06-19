


import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing'
import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { DashBoardEffects } from './dashboard.effects';
import { DashboardService } from '../dashboard/dashboard.service';
import { loadGroups, loadMeasurments, loadTeamList, retrievedGroupList, retrievedGroupListFailure, retrievedMeasurementList, retrievedMeasurementListFailure, retrievedTeamList, retrievedTeamListFailure } from './dashboard.actions';
import { Measurements } from '../dashboard/dashboard.interface';


describe('DashBoardEffects', () => {

    let actions: Observable<any>;
    let effects: DashBoardEffects;
    let store: MockStore;
    let dashboardServiceMock: any;
    let testScheduler: TestScheduler;
    const initialState = {
        teams: [],
        groups: [],
        measurements: [],
        flags: {
            areMeasurementsLoading: false,
            areGroupsLoading: false,
            areTeamsLoading: false,
            hasLoadedTeams: false,
            hasTeamsLoadingError: false,
            hasGroupsLoadingError: false,
            hasMeasurementsLoadingError: false
        }
    };

    beforeEach(() => {
        dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
            'getDashboardData',
            'getMeasurmentData',
            'getGroupsOptions',
        ]);

        TestBed.configureTestingModule({
            providers: [
                DashBoardEffects,
                provideMockStore({ initialState }),
                provideMockActions(() => actions),
                { provide: DashboardService, useValue: dashboardServiceMock }
            ],
        });

        effects = TestBed.inject(DashBoardEffects);
        store = TestBed.inject(MockStore);
        store.setState(initialState);

        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        })
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadteams ', () => {
        it('should be load teams and return retrievedTeamList action on success', () => {
            const teamsData = [{
                today: 1,
                mtd: 2,
                ytd: 3,
                todayClass: 'wot',
                mtdClass: 'wot2',
                ytdClass: 'wot3',
                name: 'peter'
            }]
            const action = loadTeamList({ measurement: 'w', group: 'o' });
            const outcome = retrievedTeamList({ teamsData });

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-b|', { b: teamsData });
                dashboardServiceMock.getDashboardData.and.returnValue(response);

                expectObservable(effects.loadteams$).toBe('--b', { b: outcome })
            })

        });

        it('should be load teams and return retrievedTeamListFail action on fail', () => {
            const error = 'test err';
            const action = loadTeamList({ measurement: 'w', group: 'o' });
            const outcome = retrievedTeamListFailure();

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-#', {}, error);
                dashboardServiceMock.getDashboardData.and.returnValue(response);

                expectObservable(effects.loadteams$).toBe('--b', { b: outcome });
            })

        });
    })

    describe('loadGroups ', () => {
        it('should be load teams and return retrievedGroupList action on success', () => {
            const groups = [{
                url: 'w',
                label: 'o'
            }]
            const action = loadGroups();
            const outcome = retrievedGroupList({ groups });

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-b|', { b: groups });
                dashboardServiceMock.getGroupsOptions.and.returnValue(response);

                expectObservable(effects.loadGroups$).toBe('--b', { b: outcome })
            })

        });

        it('should be load teams and return retrievedGroupList Fail action on fail', () => {
            const error = 'test err';
            const action = loadGroups();
            const outcome = retrievedGroupListFailure();

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-#', {}, error);
                dashboardServiceMock.getGroupsOptions.and.returnValue(response);

                expectObservable(effects.loadGroups$).toBe('--b', { b: outcome });
            })

        });
    })

    describe('loadMeasurments ', () => {
        it('should be on  load measuremnts and return retrievedTeamList action on success', () => {
            const measurements: Measurements[] = []
            const action = loadMeasurments({ group: 'o' });
            const outcome1 = retrievedMeasurementList({ measurements });

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-b|', { b: measurements });
                dashboardServiceMock.getMeasurmentData.and.returnValue(response);

                expectObservable(effects.loadMeasurments$).toBe('--c', { c: outcome1 })
            })

        });

        it('should be on load measuremnts and return retrievedTeamList action and fire loadTeamList if measurement is not empty on success', () => {
            const measurements = [{
                url: 'w',
                label: 'o'
            }]
            const action = loadMeasurments({ group: 'o' });
            const outcome1 = retrievedMeasurementList({ measurements });
            const outcome2 = loadTeamList({ measurement: 'w', group: 'o' });


            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-b|', { b: measurements });
                dashboardServiceMock.getMeasurmentData.and.returnValue(response);

                expectObservable(effects.loadMeasurments$).toBe('--(bc)', { b: outcome1, c: outcome2 })
            })

        });

        it('should be on load measuremnts return retrievedTeamList action and NOT  loadTeamList if hasLoadedTeams on success', () => {
            const measurements = [{
                url: 'w',
                label: 'o'
            }]
            const action = loadMeasurments({ group: 'o' });
            const outcome1 = retrievedMeasurementList({ measurements });
            const outcome2 = loadTeamList({ measurement: 'w', group: 'o' });


            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-b|', { b: measurements });
                dashboardServiceMock.getMeasurmentData.and.returnValue(response);

                expectObservable(effects.loadMeasurments$).toBe('--(bc)', { b: outcome1, c: outcome2 })
            })

        });


        it('should be on load measuremnts and return retrievedMeasurementListFail action on fail', () => {
            const error = 'test err';
            const action = loadMeasurments({ group: 'o' });
            const outcome = retrievedMeasurementListFailure();

            testScheduler.run(({ hot, cold, expectObservable }) => {
                actions = hot('-a', { a: action });
                const response = cold('-#', {}, error);
                dashboardServiceMock.getMeasurmentData.and.returnValue(response);

                expectObservable(effects.loadMeasurments$).toBe('--b', { b: outcome });
            })

        });
    })
})

