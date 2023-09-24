import { Injectable } from '@angular/core';
import { User } from 'src/app/models/auth/user.entity';
import { SerializationHelper } from './serialization-helper';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  user: User;

  constructor() {
    this.user = SerializationHelper.toInstance(
      new User(),
      localStorage.getItem('globaldata')
    );
  }

  load(datajson: any) {
    if (datajson == null) {
      return;
    }
    const data = JSON.parse(datajson);
    this.user = SerializationHelper.toInstance(new User(), data['user']);
  }
}
