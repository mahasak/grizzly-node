import { 
    Condition,
    Context,
    Operator
} from '../interfaces/';

const getContextValue = (context: Context, fieldName: string ) => 
        context[fieldName] 
            ? context[fieldName] 
            : context.properties[fieldName] 
                ? context.properties[fieldName] 
                : undefined;

export class Activator {
    public name: string;
    private passed: boolean;

    constructor(name: string, passed: boolean = false){
        this.name = name;
        this.passed = passed;
    }

    check(context: Context, condition: Condition) {
        const contextValue = getContextValue(context, condition.contextName);
        const isValueInContext = condition.values.some(val => val.trim() === contextValue);
        return condition.operator ===  Operator.IN 
                    ? isValueInContext 
                    : !isValueInContext;
    }

    checkAll(context: Context, conditions: Condition[]) {
        if (!conditions || conditions.length === 0 ) return true;

        return conditions.every( condition => this.check(context, condition));
    }

    isEnabled( context: Context, params: any): boolean {
        return this.passed;
    }

    isEnabledWithConditions(context: Context, conditions: Condition[] = [],  params: any = {}): boolean {
        return this.checkAll(context, conditions) && this.isEnabled(context, params );
    }

}