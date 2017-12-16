import { TestBed, inject } from '@angular/core/testing';

import { QrcodeWorkerService } from './qrcode-worker.service';

describe('QrcodeWorkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrcodeWorkerService]
    });
  });

  it('should be created', inject([QrcodeWorkerService], (service: QrcodeWorkerService) => {
    expect(service).toBeTruthy();
  }));
});
