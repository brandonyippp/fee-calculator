import { isPermittedCategory } from "../../constants/constants";
import { Container } from "../../interfaces/Container/Container";
import { CsvRow } from "../../interfaces/CsvRow/CsvRow";
import { Category } from "../Category/Category";

export class Department implements Container<Category> {
  private data: Map<string, Category>;
  private surchargeTotal: number;
  private numCategories: number;
  private invalidData: CsvRow[];
  private department: string;
  private total: number;

  constructor(current: CsvRow, invalidData: CsvRow[]) {
    this.data = new Map<string, Category>();
    this.department = current.Department__c;
    this.invalidData = invalidData;
    this.surchargeTotal = 0;
    this.numCategories = 0;
    this.total = 0;
    this.addNode(current);
  }

  /* Primary Functions */

  public addNode(current: CsvRow): void {
    const department: string = current.Department__c;
    const category: string = current.Category__c;

    if (!isPermittedCategory(category, department)) {
      this.processInvalidData(current);
    } else if (this.data.has(category)) {
      this.proceed(current);
    } else if (!this.data.has(category)) {
      this.addCategory(current);
      this.numCategories++;
    } else {
      throw new Error(`Failed to add JSON.stringify${current}`);
    }
  }

  /* Helper Functions */

  private proceed(current: CsvRow): void {
    this.data.get(current.Category__c)!.addNode(current);
  }

  private addCategory(current: CsvRow): void {
    this.data.set(current.Category__c, new Category(current, this.invalidData));
  }

  private processInvalidData(current: CsvRow): void {
    this.invalidData.push({
      ...current,
      reason: `Category ${current.Category__c} not valid for Department ${current.Department__c}.`,
    });
  }

  /* Getters & Setters */

  public getTotal(): number {
    return this.total;
  }

  public setTotal(childrenSum: number): void {
    this.total = childrenSum;
  }

  public getSurchargeTotal(): number {
    return this.surchargeTotal;
  }

  public setSurchargeTotal(childrenSum: number): void {
    this.surchargeTotal = childrenSum;
  }

  public getDepartment(): string {
    return this.department;
  }

  public getData(): Map<string, Category> {
    return this.data;
  }

  public getNumChildren(): number {
    return this.numCategories;
  }
}
