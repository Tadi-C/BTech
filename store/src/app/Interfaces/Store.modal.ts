import { Timestamp } from "firebase/firestore";

export interface Product {
  ID: string;
  Name: string;
  Category: string;
  Brand: string;
  Description: string;
  Price: number;
  Discount_Price: number;
  Availability: number;
  Date_Added: Timestamp;
}
