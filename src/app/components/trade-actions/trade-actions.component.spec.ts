import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeActionsComponent } from './trade-actions.component';

describe('TradeActionsComponent', () => {
  let component: TradeActionsComponent;
  let fixture: ComponentFixture<TradeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
