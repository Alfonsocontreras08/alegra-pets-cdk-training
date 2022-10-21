import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ApiGW from "aws-cdk-lib/aws-apigateway";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { ApiStackCustom, StackBasicProps } from '../interface';


export class ApiGWStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackCustom) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    const { createEntity } = props.lambdaStack;

    const rest = new ApiGW.RestApi(this,getDefaultResourceName(props,"ApiGW"),{
        deployOptions:{
            stageName: getDefaultResourceName(props,"ApiGW"),
            
        },
    });

    rest.root
    .resourceForPath('entity')
    .addMethod('POST', new ApiGW.LambdaIntegration(createEntity));
    
  } 
}
