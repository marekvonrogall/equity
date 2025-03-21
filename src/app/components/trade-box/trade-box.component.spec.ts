import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeBoxComponent } from './trade-box.component';

describe('TradeBoxComponent', () => {
  let component: TradeBoxComponent;
  let fixture: ComponentFixture<TradeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
