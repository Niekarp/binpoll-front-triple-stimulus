import { TestBed } from '@angular/core/testing';

import { KeyboardNavigationService } from './keyboard-navigation.service';

describe('KeyboardNavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyboardNavigationService = TestBed.get(KeyboardNavigationService);
    expect(service).toBeTruthy();
  });
});
