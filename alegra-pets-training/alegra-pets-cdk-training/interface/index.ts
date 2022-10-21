import { DynamoDBStack } from "../lib/DynamoDBStack";
import { LambdaStack } from "../lib/LambdaStack";

export interface StackBasicProps {
    account:string,
    region:string,
    environment:string,
    name:string
}

export interface DynamoStackCustom extends StackBasicProps{
    lambdaStack: LambdaStack
}

export interface ApiStackCustom extends StackBasicProps{
    lambdaStack: LambdaStack
}

export interface LambdaStackCustom extends StackBasicProps{
    DynamoDBStack: DynamoDBStack
}