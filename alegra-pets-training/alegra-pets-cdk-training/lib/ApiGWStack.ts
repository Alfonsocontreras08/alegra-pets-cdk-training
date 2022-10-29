import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ApiGW from "aws-cdk-lib/aws-apigateway";
import * as Iam from "aws-cdk-lib/aws-iam";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { ApiStackCustom } from '../interface';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { createEntityModel } from "../model/entity";
import { AdoptPetModel, createPetModel,updatePetModel } from "../model/pet";
import { Version } from 'aws-cdk-lib/aws-lambda';
import { Arn } from 'aws-cdk-lib';


export class ApiGWStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackCustom) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    const { createEntity, searchEntity, createPet, deletePet, searchPet, updatePet , adoptPet } = props.lambdaStack;


    const rest = new ApiGW.RestApi(this,getDefaultResourceName(props,"ApiGW"),{
        deployOptions:{
            stageName: getDefaultResourceName(props,"ApiGW"),
        },
    });

    /*
    * Auth
    */ 

    /*const policyAuthorizer = new Iam.Policy(this,getDefaultResourceName(props,'Iam-policy-authorizer'),{
      statements: [
        new Iam.PolicyStatement({
          actions: ["execute-api:Invoke"],
          resources: ["*"],
          effect: Iam.Effect.ALLOW,
          
        }),
      ],
    });*/
  
  
    const authLambda = new Lambda.Function(this,getDefaultResourceName(props,"lambda-Auth"),{
      functionName:getDefaultResourceName(props,"auth"),
      code:Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/authorizer"),
      handler:"alegra-pets-lambda-authorizer.handler",
      runtime:Lambda.Runtime.NODEJS_16_X,
      environment: {
        TABLA_NAME: cdk.Fn.importValue("DynamoDBTable-entity-name")
      }
    });
    
    //authLambda.role?.attachInlinePolicy(policyAuthorizer)

    const auth = new ApiGW.TokenAuthorizer(this, 'booksAuthorizer', {
      handler: authLambda,
      resultsCacheTtl: cdk.Duration.minutes(0),
      identitySource: ApiGW.IdentitySource.header("Authorization") 
    });

    new Lambda.CfnPermission(this,"permisos",{
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      functionName: authLambda.functionArn, //arn de la lambda
      sourceArn:  Arn.format({
        service: "execute-api",
        resource: rest.restApiId,
        resourceName: "authorizers/*"
      },this)
    });
    
    /*
     *
     * entidad
     */
    // /entities
    const entity = rest.root.addResource('entities');

    entity.addMethod('POST', 
    new ApiGW.LambdaIntegration(createEntity),{
      requestValidator: new ApiGW.RequestValidator(this, "create-entity-validator", {
				restApi: rest,
				validateRequestBody: true,
			}),
       requestModels:{
        "application/json":createEntityModel(this,getDefaultResourceName(props,"model-create-entity"),rest)
      },			
      /*
			authorizationType: r.AuthorizationType.CUSTOM,*/
			authorizer: auth
    })

    entity.addMethod('GET', 
      new ApiGW.LambdaIntegration(searchEntity),{
        
        authorizer: auth,
        //authorizationType: ApiGW.AuthorizationType.CUSTOM,
    });






    /*
     *
     * animales
     */
    
    // /pets
    const pets = rest.root.addResource('pets');

    pets.addMethod('GET', 
      new ApiGW.LambdaIntegration(searchPet),{
        authorizer: auth,
        //authorizationType: ApiGW.AuthorizationType.CUSTOM,
        requestParameters: {
          "method.request.querystring.petId": false,
          "method.request.querystring.entityId": false,
          "method.request.querystring.ColorEquals": false,
          "method.request.querystring.raceEquals": false,
          "method.request.querystring.nameEquals": false,
          "method.request.querystring.typeOfPetEquals": false,
          "method.request.querystring.entityOwnerEquals":false
        },
        requestValidatorOptions: {
            requestValidatorName: "GetPet-validator",
            validateRequestParameters: true,
        }
    });

    pets.addMethod('POST', 
    new ApiGW.LambdaIntegration(createPet),{
      requestValidator: new ApiGW.RequestValidator(this, "create-pet-validator", {
				restApi: rest,
				validateRequestBody: true,
			}),
       requestModels:{
        "application/json":createPetModel(this,getDefaultResourceName(props,"model-create-pet"),rest)
      },			
      /*
			authorizationType: r.AuthorizationType.CUSTOM,
			*/authorizer: auth,
    });



    // /pets/{pets}
    const petsID = pets.addResource('{petId}')
    
    petsID.addMethod("PATCH",
    new ApiGW.LambdaIntegration(adoptPet),{
      requestValidator: new ApiGW.RequestValidator(this, "adopt-pet-validator", {
        restApi: rest,
        validateRequestBody: true,
      }),
      requestModels:{
        "application/json":AdoptPetModel(this,getDefaultResourceName(props,"model-adopt-pet"),rest)
      },
      requestParameters: {
          "method.request.path.petId": true,
      },
      authorizer: auth,
    });
    
    petsID.addMethod("PUT",
      new ApiGW.LambdaIntegration(updatePet),{
        requestValidator: new ApiGW.RequestValidator(this, "update-pet-validator", {
          restApi: rest,
          validateRequestBody: true,
        }),
        requestModels:{
          "application/json":updatePetModel(this,getDefaultResourceName(props,"model-update-pet"),rest)
        },
        requestParameters: {
            "method.request.path.petId": true,
        },	
        authorizer: auth
    });
    
    petsID.addMethod('DELETE', 
      new ApiGW.LambdaIntegration(deletePet),{
        requestParameters: {
          "method.request.path.petId": true,
        },
        /*requestValidatorOptions: {
          //requestValidatorName: "delete-pet-validator",
          validateRequestParameters: true
        }*/
        authorizer: auth,
    });

  }
}
