import { Operator } from './operator'

export interface Condition {
    contextName: string;
    operator: Operator;
    values: string[];
}