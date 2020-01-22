import { Condition } from "./condition";

export interface ActivatorInterface {
    name: string;
    parameters: any;
    constraints: Condition[];
}