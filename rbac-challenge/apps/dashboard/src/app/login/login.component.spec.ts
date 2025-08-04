import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SharedUserService } from '../shared-user.service';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockSharedUserService {
  getAll() {
    return [
      { username: 'testuser', password: 'testpass', role: 'viewer' }
    ];
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: SharedUserService, useClass: MockSharedUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login with hardcoded user', () => {
    component.username = 'owner';
    component.password = 'ownerpass';
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard-owner']);
  });

  it('should login with shared user', () => {
    component.username = 'testuser';
    component.password = 'testpass';
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard-viewer']);
  });

  it('should set error for invalid user', () => {
    component.username = 'invalid';
    component.password = 'invalid';
    component.login();
    expect(component.error).not.toBe('');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
