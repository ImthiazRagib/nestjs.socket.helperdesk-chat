import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsService {

  getRoomById(id: number) {
    // TODO: implement actual room lookup (e.g., from DB or in-memory store)
    return { id, name: `Room ${id}` };
  }
}
