import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from "aws-cdk-lib/aws-lambda";

import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { LambdaStackCustom, StackBasicProps } from '../interface';
import { CfnOutcome } from 'aws-cdk-lib/aws-frauddetector';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';

export class LambdaStack extends cdk.Stack {
    public createEntity:Lambda.Function;
    public createPet:Lambda.Function;
    public deletePet:Lambda.Function;
    public searchPet:Lambda.Function;
    public updatePet:Lambda.Function;

    constructor(scope: Construct, id: string, props: LambdaStackCustom) {
        super(scope, id, getCdkPropsFromCustomProps(props));
        const { EntityTable, PetTable }= props.DynamoDBStack; //tabla de animales y de fundaciones
        
        /**
         * capas
         */
        const commonLayer = new Lambda.LayerVersion(this, getDefaultResourceName(props,'common-layer'), {
            compatibleRuntimes: [
              Lambda.Runtime.NODEJS_16_X
            ],
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/layers/custom"),
            description: 'lambda comun con uuid y sdk',
        });

        const s3BucketName = cdk.Fn.importValue("s3-bucket-name-output");

        //////// Funciones  /////
        this.createEntity = new Lambda.Function(this,getDefaultResourceName(props,"lambda-CreateEntity"),{
            functionName:getDefaultResourceName(props,"create-entity"),
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/entity/create"),
            handler:"alegra-pets-lambda-create-entity.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            layers:[commonLayer],
            environment: {
                TABLA_NAME: EntityTable.tableName,
                S3_Bucket_Name: s3BucketName
            },
        });
       
       this.createPet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-CreatePet"),{
            functionName:getDefaultResourceName(props,"create-pet"),
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/pet/create"),
            handler:"alegra-pets-lambda-create-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            layers:[commonLayer],
            environment: {
                TABLA_NAME: PetTable.tableName,
                S3_Bucket_Name: s3BucketName
            }

        });
        
        this.deletePet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-DeletePet"),{
            functionName:getDefaultResourceName(props,"delete-pet"),
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/pet/delete"),
            handler:"alegra-pets-lambda-delete-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            layers:[commonLayer],
            environment: {
                TABLA_NAME: PetTable.tableName
            },
        });
       
        this.searchPet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-SearchPet"),{
            functionName:getDefaultResourceName(props,"search-pet"),
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/pet/search"),
            handler:"alegra-pets-lambda-search-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            layers:[commonLayer],
            environment: {
                TABLA_NAME: PetTable.tableName
            }
        });

        this.updatePet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-UpdatePet"),{
            functionName:getDefaultResourceName(props,"update-pet"),
            code: Lambda.Code.fromAsset("../alegra-pets-backend-training/lambdas/pet/update"),
            handler:"alegra-pets-lambda-update-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            layers:[commonLayer],
            environment: {
                TABLA_NAME: PetTable.tableName,
                S3_Bucket_Name: s3BucketName
            },
            
        });

       
        
        /*const updatePet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-UpdatePet"),{
            functionName:getDefaultResourceName(props,"update-pet"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-update-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: PetTable.tableName
            }
        });*/
        
    //////////// permisos ///////
    /**
     * mascotas
     * 
     */
    PetTable.grantWriteData(this.createPet);
    PetTable.grantReadData(this.searchPet);
    PetTable.grantReadWriteData(this.deletePet);
    PetTable.grantReadWriteData(this.updatePet);
    

    /**
     * entidad    
    */
    EntityTable.grantWriteData(this.createEntity);
    
  }
}
