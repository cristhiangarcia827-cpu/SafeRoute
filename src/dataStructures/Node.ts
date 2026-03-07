import { Report } from '../models/Report';

export class Node {
  data: Report;
  next: Node | null;

  constructor(data: Report) {
    this.data = data;
    this.next = null;
  }
}