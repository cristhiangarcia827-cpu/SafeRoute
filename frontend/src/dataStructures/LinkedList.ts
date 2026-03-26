import { Report } from '../models/Report';
import { Node } from './Node';

export class LinkedList {
  private head: Node | null;
  private tail: Node | null;
  private length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(report: Report): void {
    const newNode = new Node(report);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        this.tail = newNode;
      }
    }
    this.length++;
  }

  getAll(): Report[] {
    const reports: Report[] = [];
    let current = this.head;
    while (current) {
      reports.push(current.data);
      current = current.next;
    }
    return reports;
  }

  getById(id: string): Report | null {
    let current = this.head;
    while (current) {
      if (current.data.id === id) {
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  delete(id: string): boolean {
    if (!this.head) return false;
    if (this.head.data.id === id) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      return true;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.data.id === id) {
        current.next = current.next.next;
        if (!current.next) this.tail = current;
        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  getSize(): number {
    return this.length;
  }
}