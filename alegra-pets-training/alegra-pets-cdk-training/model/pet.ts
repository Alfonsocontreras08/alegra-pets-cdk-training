import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { JsonSchemaType, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';


export const createPetModel = (scope:Construct,id:string,restApi:RestApi)=>{
    return new apigateway.Model(scope, id, {
        contentType: "application/json",
        restApi:restApi,
        description: "validar request de createPet",
        schema: {
            type: JsonSchemaType.OBJECT,
            required: [ "entity_owner", "state", "typePet", "race", "color", "name" ],
            properties: {
                entity_owner:   { type: JsonSchemaType.STRING },
                state:          { type: JsonSchemaType.STRING },
                typePet:        { type: JsonSchemaType.STRING },
                race:           { type: JsonSchemaType.STRING },
                color:          { type: JsonSchemaType.STRING },
                name:           { type: JsonSchemaType.STRING },
            },
        }
    });
}


export const updatePetModel = (scope:Construct,id:string,restApi:RestApi)=>{
    return new apigateway.Model(scope, id, {
        contentType: "application/json",
        restApi:restApi,
        description: "validar request de updatePet",
        schema: {
            type: JsonSchemaType.OBJECT,
            required: [ "entity_owner", "state", "typePet", "race", "color", "name" ],
            properties: {
                entity_owner:   { type: JsonSchemaType.STRING },
                state:          { type: JsonSchemaType.STRING },
                typePet:        { type: JsonSchemaType.STRING },
                race:           { type: JsonSchemaType.STRING },
                color:          { type: JsonSchemaType.STRING },
                name:           { type: JsonSchemaType.STRING },
            },
        }
    });
}

export const AdoptPetModel = (scope:Construct,id:string,restApi:RestApi)=>{
    return new apigateway.Model(scope, id, {
        contentType: "application/json",
        restApi:restApi,
        description: "validar request de adoptPet",
        schema: {
            type: JsonSchemaType.OBJECT,
            required: [ "entity_adopt"],
            properties: {
                entity_adopt:   { type: JsonSchemaType.STRING },
            },
        }
    });
}

