import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as DynamoDB from "aws-cdk-lib/aws-dynamodb";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import { StackBasicProps } from '../interface';
import { CfnOutput } from 'aws-cdk-lib';

export class DynamoDBStack extends cdk.Stack {
  
  public PetTable:DynamoDB.Table;
  public EntityTable:DynamoDB.Table;

  constructor(scope: Construct, id: string, props: StackBasicProps) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    
    this.PetTable = new DynamoDB.Table(this,getDefaultResourceName(props,"DynamoDBTable-pets"),{
      partitionKey:{
        name:"id",
        type:DynamoDB.AttributeType.STRING
      },
      tableName: getDefaultResourceName(props,"DynamoDBTable-pets")
    });
      
    this.EntityTable = new DynamoDB.Table(this,getDefaultResourceName(props,"DynamoDBTable-entity"),{
      partitionKey:{
        name:"id",
        type:DynamoDB.AttributeType.STRING
      },
      tableName: getDefaultResourceName(props,"DynamoDBTable-entity")
    });
    
    //exportamos el nombre de la tabla de entity
    new CfnOutput(this,"DynamoDBTable-entity-name",{
      exportName:"DynamoDBTable-entity-name",
      value:this.EntityTable.tableName
    })

  }
}
