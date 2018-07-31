import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInstitutionComponent } from './delete-institution.component';

describe('DeleteInstitutionComponent', () => {
  let component: DeleteInstitutionComponent;
  let fixture: ComponentFixture<DeleteInstitutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteInstitutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
