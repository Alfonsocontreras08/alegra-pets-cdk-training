import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as S3 from "aws-cdk-lib/aws-s3";
import { getCdkPropsFromCustomProps, getDefaultResourceName } from '../utils';
import * as path from "path"
import { DynamoStackCustom } from '../interface';
import { CfnOutput } from 'aws-cdk-lib';

export class BucketS3Stack extends cdk.Stack {
    
    constructor(scope: Construct, id: string, props: DynamoStackCustom) {
    super(scope, id, getCdkPropsFromCustomProps(props));
    
    const { createEntity , createPet , updatePet  } = props.lambdaStack; //todas las lambdas

    const bucket = new S3.Bucket(this,"bucket",{
        bucketName: getDefaultResourceName(props,"bucket"),
    });

    bucket.grantWrite(createEntity);
    bucket.grantWrite(createPet);
    bucket.grantWrite(updatePet);

    new CfnOutput(this,"s3-bucket-name-output", {
       value: bucket.bucketName,
       exportName: "s3-bucket-name-output"
    });
    
  }
}
