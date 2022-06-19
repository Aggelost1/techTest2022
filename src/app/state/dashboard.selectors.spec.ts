import { DashboardGroup, Measurements, Team } from '../dashboard/dashboard.interface';
import * as fromSelectors from './dashboard.selectors';

describe('selectors', () => {
    describe('selectTeamsData', () => {
        it('should select teamData', () => {
            const initialData: Team[] = [];

            const result = fromSelectors.selectTeamsData.projector(initialData)
            expect(result).toEqual([]);

            const initialData2: Team[] = [{
                today: 1,
                mtd: 2,
                ytd: 3,
                todayClass: 'wot',
                mtdClass: 'wot2',
                ytdClass: 'wot3',
                name: 'peter'
            }];

            const initialDataCopy2: Team[] = [{
                today: 1,
                mtd: 2,
                ytd: 3,
                todayClass: 'wot',
                mtdClass: 'wot2',
                ytdClass: 'wot3',
                name: 'peter'
            }];;

            const result2 = fromSelectors.selectTeamsData.projector(initialData2)
            expect(result2).toEqual(initialDataCopy2);
        })
    })

    describe('selectGroups', () => {
        it('should select groups', () => {
            const initialData: DashboardGroup[] = [];

            const result = fromSelectors.selectGroups.projector(initialData)
            expect(result).toEqual([]);

            const initialState = [{
                label: 'test1',
                url: 'test2',
            }];

            const initialStateCopy = [{
                label: 'test1',
                url: 'test2',
            }];

            const result2 = fromSelectors.selectGroups.projector(initialState)
            expect(result2).toEqual(initialStateCopy);
        })
    })

    describe('selectMeasurements', () => {
        it('should select measurements', () => {
            const initialData: Measurements[] = [];

            const result = fromSelectors.selectMeasurements.projector(initialData)
            expect(result).toEqual([]);

            const initialState = [{
                label: 'test1',
                url: 'test2',
            }];

            const initialStateCopy = [{
                label: 'test1',
                url: 'test2',
            }];

            const result2 = fromSelectors.selectMeasurements.projector(initialState)
            expect(result2).toEqual(initialStateCopy);
        })
    })

    describe('selectFlags', () => {
        it('should select flags', () => {
            const startingState = {
                areMeasurementsLoading: false,
                areGroupsLoading: false,
                areTeamsLoading: false,
                hasLoadedTeams: false,
                hasTeamsLoadingError: false,
                hasGroupsLoadingError: false,
                hasMeasurementsLoadingError: false
            }

            const startingStateCopy = {
                areMeasurementsLoading: false,
                areGroupsLoading: false,
                areTeamsLoading: false,
                hasLoadedTeams: false,
                hasTeamsLoadingError: false,
                hasGroupsLoadingError: false,
                hasMeasurementsLoadingError: false
            }

            const result = fromSelectors.selectFlags.projector(startingState)
            expect(result).toEqual(startingStateCopy);


        })
    })
})