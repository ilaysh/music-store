import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscListComponent } from './list.component';

describe('DiscListComponent', () => {
  let component: DiscListComponent;
  let fixture: ComponentFixture<DiscListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
