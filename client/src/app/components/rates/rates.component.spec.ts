import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesComponent } from './rates.component';

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
