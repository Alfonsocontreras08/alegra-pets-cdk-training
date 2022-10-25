import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ApiGW from "aws-cdk-lib/aws-apigateway";

import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { ApiStackCustom } from '../interface';
import * as Lambda from 'aws-cdk-lib/aws-lambda';


export class ApiGWStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackCustom) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    const { createEntity, createPet, deletePet, searchPet, updatePet } = props.lambdaStack;


    const rest = new ApiGW.RestApi(this,getDefaultResourceName(props,"ApiGW"),{
        deployOptions:{
            stageName: getDefaultResourceName(props,"ApiGW"),
        },
        defaultCorsPreflightOptions: {
          allowHeaders: [
            'Content-Type',
            'X-Amz-Date',
            'X-Amz-Security-Token',
            'Authorization',
            'authorizationToken',
            'X-Api-Key',
            'X-Requested-With',
            'Accept',
            'Access-Control-Allow-Methods',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
          ],
          allowMethods: [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          allowCredentials: true,
          allowOrigins:["*"]
        }
    });


    /*
    * Auth
    */ 
    const authLambda = new Lambda.Function(this,getDefaultResourceName(props,"lambda-Auth"),{
      functionName:getDefaultResourceName(props,"auth"),
      code:Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/authorizer"),
      handler:"alegra-pets-lambda-authorizer.handler",
      runtime:Lambda.Runtime.NODEJS_16_X,
      /* environment: {
          TABLA_NAME: EntityTable.tableName
      }*/
    });
    

    const auth = new ApiGW.TokenAuthorizer(this, 'booksAuthorizer', {
      handler: authLambda,
    });

    
    /*
     *
     * entidad
     */
    // /entities
    const entity = rest.root.addResource('entities');

    entity.addMethod('POST', 
    new ApiGW.LambdaIntegration(createEntity),{
      //authorizer: auth
    });


    /*
     *
     * animales
     */
    // /pets
    const pets = rest.root.addResource('pets');
    
    pets.addMethod('POST', 
    new ApiGW.LambdaIntegration(createPet),{
      //authorizer: auth
    });

    pets.addMethod('GET', 
    new ApiGW.LambdaIntegration(searchPet),{
      authorizer: auth
    });



    // /pets/{pets}
    pets.addResource('{petId}');

    pets.addMethod('DELETE', 
    new ApiGW.LambdaIntegration(deletePet),{
      //authorizer: auth
    });

    
  }
}
