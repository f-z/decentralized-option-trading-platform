import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstitutionComponent } from './edit-institution.component';

describe('EditInstitutionComponent', () => {
  let component: EditInstitutionComponent;
  let fixture: ComponentFixture<EditInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
