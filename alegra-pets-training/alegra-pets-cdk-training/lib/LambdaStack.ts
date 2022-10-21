import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from "aws-cdk-lib/aws-lambda";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { LambdaStackCustom, StackBasicProps } from '../interface';

export class LambdaStack extends cdk.Stack {
    public createEntity:Lambda.Function;

    constructor(scope: Construct, id: string, props: LambdaStackCustom) {
        super(scope, id, getCdkPropsFromCustomProps(props));
        const { EntityTable, PetTable }= props.DynamoDBStack; //tabla de animales y de fundaciones
    
        //////// Funciones  /////
        this.createEntity = new Lambda.Function(this,getDefaultResourceName(props,"lambda-CreateEntity"),{
            functionName:getDefaultResourceName(props,"create-entity"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-create-entity.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: EntityTable.tableName
            },
        });

       /* const createPet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-CreatePet"),{
            functionName:getDefaultResourceName(props,"create-pet"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-create-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: PetTable.tableName
            }
        });

        const deletePet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-CreatePet"),{
            functionName:getDefaultResourceName(props,"delete-pet"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-delete-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: PetTable.tableName
            }
        });
       
        const searchPet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-SearchPet"),{
            functionName:getDefaultResourceName(props,"search-pet"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-search-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: PetTable.tableName
            }
        });

        const updatePet = new Lambda.Function(this,getDefaultResourceName(props,"lambda-UpdatePet"),{
            functionName:getDefaultResourceName(props,"update-pet"),
            code:Lambda.Code.fromAsset("../alegra-pets-backend-training"),
            handler:"alegra-pets-lambda-update-pet.handler",
            runtime:Lambda.Runtime.NODEJS_16_X,
            environment: {
                TABLA_NAME: PetTable.tableName
            }
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
    /*PetTable.grantWriteData(createPet);
    PetTable.grantReadData(searchPet);
    PetTable.grantReadWriteData(deletePet);
    PetTable.grantReadWriteData(updatePet);*/
    

    /**
     * entidad    
    */
    EntityTable.grantWriteData(this.createEntity);
    
  }
}
