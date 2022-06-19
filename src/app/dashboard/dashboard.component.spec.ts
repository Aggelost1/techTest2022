import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideMockStore, MockStore } from '@ngrx/store/testing'
import { Observable, Subscription } from 'rxjs';
import { loadGroups, loadMeasurments, loadTeamList } from '../state/dashboard.actions';
import { selectGroups, selectMeasurements } from '../state/dashboard.selectors';

import { DashboardComponent } from './dashboard.component';
import { DashboardGroup, Team } from './dashboard.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;
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

  let storeSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    store = TestBed.inject(MockStore)
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    storeSpy = spyOn(store, 'dispatch').and.callFake(() => { });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  describe('ngOnInit', () => {
    it('should exist', () => {
      expect(component.ngOnInit).toBeTruthy();
    });

    it('should call initiateData oninit', () => {
      const spy = spyOn(component, 'initiateData').and.callThrough();
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call subscribeToChanges oninit', () => {
      const spy = spyOn(component, 'subscribeToChanges').and.callThrough();
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  })

  describe('ngOnDestroy', () => {
    it('should exist', () => {
      expect(component.ngOnDestroy).toBeTruthy();
    });

    it('should call killSubscriptions', () => {
      const spy = spyOn(component, 'killSubscriptions').and.callThrough();
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });

  })

  describe('killSubscriptions', () => {
    it('should exist', () => {
      expect(component.killSubscriptions).toBeTruthy();
    });

    it('should kill Subscriptions', () => {
      component.groupsSubscription = new Subscription();
      component.measurementsSubscription = new Subscription();

      const groupSpy = spyOn(component.groupsSubscription, 'unsubscribe').and.callThrough();
      const measurementSpy = spyOn(component.measurementsSubscription, 'unsubscribe').and.callThrough();

      component.killSubscriptions();
      expect(groupSpy).toHaveBeenCalled();
      expect(measurementSpy).toHaveBeenCalled();
    });

    it('should not call unSubscribe if subscriptions are undefined', () => {
      component.groupsSubscription = new Subscription();
      component.measurementsSubscription = new Subscription();

      const groupSpy = spyOn(component.groupsSubscription, 'unsubscribe').and.callThrough();
      const measurementSpy = spyOn(component.measurementsSubscription, 'unsubscribe').and.callThrough();

      component.groupsSubscription = undefined;
      component.measurementsSubscription = undefined;

      component.killSubscriptions();
      expect(groupSpy).not.toHaveBeenCalled();
      expect(measurementSpy).not.toHaveBeenCalled();
    });

  })

  describe('initiateData', () => {
    it('should exist', () => {
      expect(component.initiateData).toBeTruthy();
    });

    it('should call getGroupsOptions', () => {
      const spy = spyOn(component, 'getGroupsOptions').and.callThrough();
      component.initiateData();
      expect(spy).toHaveBeenCalled();
    });

  })

  describe('subscribeToChanges', () => {
    it('should exist', () => {
      expect(component.subscribeToChanges).toBeTruthy();
    });

    it('should subsribe toGroups and measurements ', () => {
      const groupSpy = spyOn(component.groups$, 'subscribe').and.callThrough();
      const measurementSpy = spyOn(component.measurements$, 'subscribe').and.callThrough();


      component.subscribeToChanges();
      expect(groupSpy).toHaveBeenCalled();
      expect(measurementSpy).toHaveBeenCalled();
    });

    it('should set elected Groups with the first elements of array', () => {
      let mockGroupsSelector = store.overrideSelector(selectGroups, [{ label: 'wot1', url: 'wot2' }]);
      const groupSpy = spyOn(component.groups$, 'subscribe').and.callThrough();
      component.subscribeToChanges();
      store.refreshState();
      fixture.detectChanges();

      expect(component.selectedGroup).toEqual('wot2');

      mockGroupsSelector = store.overrideSelector(selectGroups, [{ label: 'wot1', url: 'wot3' }]);
      store.refreshState();
      fixture.detectChanges();
      expect(component.selectedGroup).toEqual('wot3');

      mockGroupsSelector = store.overrideSelector(selectGroups, []);
      store.refreshState();
      fixture.detectChanges();
      expect(component.selectedGroup).toEqual('');


    });

    it('should set elected measurements with the first elements of array', () => {
      let mockmeasurementsSelector = store.overrideSelector(selectMeasurements, [{ label: 'wot1', url: 'wot2' }]);
      const measurementspy = spyOn(component.measurements$, 'subscribe').and.callThrough();
      component.subscribeToChanges();
      store.refreshState();
      fixture.detectChanges();

      expect(component.selectedMeasurement).toEqual('wot2');

      mockmeasurementsSelector = store.overrideSelector(selectMeasurements, [{ label: 'wot1', url: 'wot3' }]);
      store.refreshState();
      fixture.detectChanges();
      expect(component.selectedMeasurement).toEqual('wot3');

      mockmeasurementsSelector = store.overrideSelector(selectMeasurements, []);
      store.refreshState();
      fixture.detectChanges();
      expect(component.selectedMeasurement).toEqual('');
    });

  })

  describe('getGroupsOptions', () => {
    it('should exist', () => {
      expect(component.getGroupsOptions).toBeTruthy();
    });

    it('should call store.dispatch', () => {
      component.selectedGroup = 'wot11'
      const excpectedArg = loadGroups();
      storeSpy.calls.reset();
      component.getGroupsOptions();
      expect(storeSpy).toHaveBeenCalledWith(excpectedArg);
    });

  })

  describe('setSelectedGroup', () => {
    it('should exist', () => {
      expect(component.setSelectedGroup).toBeTruthy();
    });

    it('should call groupChanged', () => {
      const spy = spyOn(component, 'groupChanged').and.callThrough();
      component.setSelectedGroup('wot15');
      expect(spy).toHaveBeenCalledWith('wot15')
    });

    it('should set selectedGroup', () => {
      component.selectedGroup = 'test12';
      component.setSelectedGroup('wot15');
      expect(component.selectedGroup).toBe('wot15');
    });
  })

  describe('getMeasurmentOptions', () => {
    it('should exist', () => {
      expect(component.getMeasurmentOptions).toBeTruthy();
    });

    it('should call store.dispatch', () => {
      component.selectedGroup = 'wot11'
      const excpectedArg = loadMeasurments({ group: 'wot11' })
      storeSpy.calls.reset();
      component.getMeasurmentOptions();
      expect(storeSpy).toHaveBeenCalledWith(excpectedArg);
    });

  })


  describe('groupChanged', () => {
    it('should exist', () => {
      expect(component.groupChanged).toBeTruthy();
    });

    it('should call getMeasurmentOptions', () => {
      const spy = spyOn(component, 'getMeasurmentOptions').and.callThrough();
      component.groupChanged();
      expect(spy).toHaveBeenCalled();
    });

  })

  describe('onSearch', () => {
    it('should exist', () => {
      expect(component.onSearch).toBeTruthy();
    });

    it('should call store.dispatch with correct args', () => {
      component.selectedGroup = 'wot21';
      component.selectedMeasurement = 'wot22';
      const excpectedArg = loadTeamList({ measurement: 'wot22', group: 'wot21' });
      storeSpy.calls.reset();
      component.onSearch();
      expect(storeSpy).toHaveBeenCalledWith(excpectedArg);
    });

    it('should not call store.dispatch if no grou or measurement is selected', () => {

      component.selectedGroup = '';
      component.selectedMeasurement = 'wot22';
      storeSpy.calls.reset();
      component.onSearch();
      expect(storeSpy).not.toHaveBeenCalled();

      component.selectedGroup = 'wot';
      component.selectedMeasurement = '';
      storeSpy.calls.reset();
      component.onSearch();
      expect(storeSpy).not.toHaveBeenCalled();

      component.selectedGroup = '';
      component.selectedMeasurement = '';
      storeSpy.calls.reset();
      component.onSearch();
      expect(storeSpy).not.toHaveBeenCalled();
    });

  })


});
