import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { JsonSchemaType, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';


export const createEntityModel = (scope:Construct,id:string,restApi:RestApi)=>{
    return new apigateway.Model(scope, id, {
        contentType: "application/json",
        restApi:restApi,
        description: "validar request de createentity",
        schema: {
            type: JsonSchemaType.OBJECT,
            required: ["name","type","email","password"],
            properties: {
                name:       { type: JsonSchemaType.STRING },
                type:       { type: JsonSchemaType.STRING },
                email:      { type: JsonSchemaType.STRING },
                password:   { type: JsonSchemaType.STRING },
            },
        }
    });
}


